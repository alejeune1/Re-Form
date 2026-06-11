import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CommunityComment, CommunityPost } from '../data/community';
import { useAuth } from './useAuth';
import { addCommunityComment, toggleCommunityLike, toggleCommunityVote } from '../services/reformRepository';

type CommunityInteractionState = {
  likedPostIds: string[];
  votedPostIds: string[];
  commentsByPostId: Record<string, CommunityComment[]>;
};

type CommunityInteractionOptions = {
  posts: CommunityPost[];
  source: 'mock' | 'supabase';
  onRemoteChange: () => void;
};

const STORAGE_KEY = 'reform:community-interactions';
const MAX_STORED_COMMENTS_PER_POST = 6;
const MAX_COMMENT_LENGTH = 180;

const emptyState: CommunityInteractionState = {
  likedPostIds: [],
  votedPostIds: [],
  commentsByPostId: {},
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function sanitizeList(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean))).slice(0, 80);
}

function sanitizeComments(value: unknown) {
  if (!value || typeof value !== 'object') {
    return {};
  }

  return Object.entries(value).reduce<Record<string, CommunityComment[]>>((comments, [postId, entries]) => {
    if (!postId || !isStringArray(entries)) {
      return comments;
    }

    comments[postId.slice(0, 100)] = entries
      .map((comment, index) => ({
        id: `local-${postId}-${index}`,
        authorName: 'Vous',
        body: comment.trim().slice(0, MAX_COMMENT_LENGTH),
        createdAt: new Date().toISOString(),
      }))
      .filter((comment) => comment.body)
      .slice(0, MAX_STORED_COMMENTS_PER_POST);

    return comments;
  }, {});
}

function readStoredInteractions(): CommunityInteractionState {
  try {
    const rawState = localStorage.getItem(STORAGE_KEY);
    const parsedState = rawState ? JSON.parse(rawState) : null;

    if (!parsedState || typeof parsedState !== 'object') {
      return emptyState;
    }

    const state = parsedState as Partial<{ likedPostIds: unknown; votedPostIds: unknown; commentsByPostId: unknown }>;

    return {
      likedPostIds: isStringArray(state.likedPostIds) ? sanitizeList(state.likedPostIds) : [],
      votedPostIds: isStringArray(state.votedPostIds) ? sanitizeList(state.votedPostIds) : [],
      commentsByPostId: sanitizeComments(state.commentsByPostId),
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return emptyState;
  }
}

function persistInteractions(nextState: CommunityInteractionState) {
  const serializedState = {
    likedPostIds: nextState.likedPostIds,
    votedPostIds: nextState.votedPostIds,
    commentsByPostId: Object.fromEntries(
      Object.entries(nextState.commentsByPostId).map(([postId, comments]) => [postId, comments.map((comment) => comment.body)]),
    ),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedState));
}

function togglePostId(postIds: string[], postId: string) {
  return postIds.includes(postId) ? postIds.filter((id) => id !== postId) : [...postIds, postId].slice(0, 80);
}

export function useCommunityInteractions({ posts, source, onRemoteChange }: CommunityInteractionOptions) {
  const { user, profile } = useAuth();
  const [localState, setLocalState] = useState<CommunityInteractionState>(emptyState);
  const [status, setStatus] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setLocalState(readStoredInteractions());
  }, []);

  const remoteLikedPostIds = useMemo(() => posts.filter((post) => post.viewerHasLiked).map((post) => post.id), [posts]);
  const remoteVotedPostIds = useMemo(() => posts.filter((post) => post.viewerHasVoted).map((post) => post.id), [posts]);
  const remoteCommentsByPostId = useMemo(
    () =>
      posts.reduce<Record<string, CommunityComment[]>>((comments, post) => {
        comments[post.id] = post.comments ?? [];
        return comments;
      }, {}),
    [posts],
  );

  const canUseRemote = source === 'supabase' && Boolean(user);
  const likedPostIds = canUseRemote ? remoteLikedPostIds : localState.likedPostIds;
  const votedPostIds = canUseRemote ? remoteVotedPostIds : localState.votedPostIds;
  const commentsByPostId = canUseRemote ? remoteCommentsByPostId : localState.commentsByPostId;

  const updateLocalState = useCallback((updater: (current: CommunityInteractionState) => CommunityInteractionState) => {
    setLocalState((current) => {
      const nextState = updater(current);

      try {
        persistInteractions(nextState);
      } catch {
        return current;
      }

      return nextState;
    });
  }, []);

  const toggleLike = useCallback(
    async (postId: string) => {
      setStatus('');

      if (!canUseRemote) {
        updateLocalState((current) => ({ ...current, likedPostIds: togglePostId(current.likedPostIds, postId) }));
        setStatus(user ? '' : 'Connecte-toi pour synchroniser ce like avec Supabase.');
        return;
      }

      const shouldLike = !remoteLikedPostIds.includes(postId);
      setIsSyncing(true);
      const result = await toggleCommunityLike(postId, shouldLike);
      setIsSyncing(false);

      if (result.ok) {
        onRemoteChange();
      } else {
        setStatus('Action impossible côté Supabase. Réessaie après reconnexion.');
      }
    },
    [canUseRemote, onRemoteChange, remoteLikedPostIds, updateLocalState, user],
  );

  const toggleVote = useCallback(
    async (postId: string) => {
      setStatus('');
      const post = posts.find((item) => item.id === postId);

      if (!canUseRemote || !post?.challengeId) {
        updateLocalState((current) => ({ ...current, votedPostIds: togglePostId(current.votedPostIds, postId) }));
        setStatus(user ? 'Vote conservé localement : aucun défi Supabase lié à ce post.' : 'Connecte-toi pour synchroniser ce vote avec Supabase.');
        return;
      }

      const shouldVote = !remoteVotedPostIds.includes(postId);
      setIsSyncing(true);
      const result = await toggleCommunityVote(postId, post.challengeId, shouldVote);
      setIsSyncing(false);

      if (result.ok) {
        onRemoteChange();
      } else {
        setStatus('Vote impossible côté Supabase. Vérifie que le défi est publié.');
      }
    },
    [canUseRemote, onRemoteChange, posts, remoteVotedPostIds, updateLocalState, user],
  );

  const addComment = useCallback(
    async (postId: string, comment: string) => {
      const safeComment = comment.trim().slice(0, MAX_COMMENT_LENGTH);

      if (!safeComment) {
        return;
      }

      setStatus('');

      if (!canUseRemote) {
        updateLocalState((current) => {
          const currentComments = current.commentsByPostId[postId] ?? [];

          return {
            ...current,
            commentsByPostId: {
              ...current.commentsByPostId,
              [postId]: [
                {
                  id: `local-${Date.now()}`,
                  authorName: profile?.display_name || 'Vous',
                  body: safeComment,
                  createdAt: new Date().toISOString(),
                },
                ...currentComments,
              ].slice(0, MAX_STORED_COMMENTS_PER_POST),
            },
          };
        });
        setStatus(user ? '' : 'Connecte-toi pour synchroniser ce commentaire avec Supabase.');
        return;
      }

      setIsSyncing(true);
      const result = await addCommunityComment(postId, safeComment);
      setIsSyncing(false);

      if (result.ok) {
        onRemoteChange();
      } else {
        setStatus('Commentaire impossible côté Supabase. Réessaie après reconnexion.');
      }
    },
    [canUseRemote, onRemoteChange, profile?.display_name, updateLocalState, user],
  );

  return {
    commentsByPostId,
    likedPostIds,
    votedPostIds,
    status,
    isSyncing,
    toggleLike,
    toggleVote,
    addComment,
  };
}
