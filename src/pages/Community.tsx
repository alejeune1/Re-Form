import { motion } from 'framer-motion';
import { useCallback } from 'react';
import AuthPanel from '../components/AuthPanel';
import CommunityPostCard from '../components/CommunityPostCard';
import { communityPosts } from '../data/community';
import { useAuth } from '../hooks/useAuth';
import { useCommunityInteractions } from '../hooks/useCommunityInteractions';
import { useRepositoryList } from '../hooks/useRepositoryList';
import { getCommunityPosts } from '../services/reformRepository';

export default function Community() {
  const { user } = useAuth();
  const loadCommunityPosts = useCallback(() => getCommunityPosts(user?.id), [user?.id]);
  const { items, isLoading, source, reload } = useRepositoryList(loadCommunityPosts, communityPosts);
  const { likedPostIds, votedPostIds, commentsByPostId, status, isSyncing, toggleLike, toggleVote, addComment } =
    useCommunityInteractions({
      posts: items,
      source,
      onRemoteChange: reload,
    });

  return (
    <section className="px-4 pb-24 pt-36 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.58fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-4xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sage">Communauté</p>
            <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.06em] text-ink sm:text-7xl">
              Montrer les transformations, voter, commenter.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-textile/74">
              Un feed pensé pour valoriser les réparations, les pièces reconstruites et les idées utiles. Connecté, il synchronise les likes et commentaires avec Supabase.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full bg-sage/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sage">
                {source === 'supabase' ? 'Données Supabase' : 'Fallback mock'}
              </span>
              <span className="rounded-full border border-textile/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-textile/62">
                Likes · Commentaires · Votes
              </span>
              {status ? (
                <span className="rounded-full bg-bone/48 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-textile/72">
                  {status}
                </span>
              ) : null}
            </div>
          </motion.div>

          <AuthPanel />
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2" aria-busy={isLoading}>
          {items.map((post, index) => (
            <CommunityPostCard
              key={post.id}
              post={post}
              index={index}
              liked={likedPostIds.includes(post.id)}
              voted={votedPostIds.includes(post.id)}
              comments={commentsByPostId[post.id] ?? []}
              isSyncing={isSyncing}
              onToggleLike={toggleLike}
              onToggleVote={toggleVote}
              onAddComment={addComment}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
