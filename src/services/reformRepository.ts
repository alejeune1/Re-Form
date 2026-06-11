import { challenges as fallbackChallenges, type Challenge } from '../data/challenges';
import { communityPosts as fallbackCommunityPosts, type CommunityComment, type CommunityPost } from '../data/community';
import { tutorials as fallbackTutorials, type Tutorial } from '../data/tutorials';
import type { Database } from '../lib/database.types';
import { supabase } from '../lib/supabase';

type DataSource = 'mock' | 'supabase';
type TutorialRow = Database['public']['Tables']['tutorials']['Row'];
type ChallengeRow = Database['public']['Tables']['challenges']['Row'];
type CreationRow = Database['public']['Tables']['creations']['Row'];
type CreationInsert = Database['public']['Tables']['creations']['Insert'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type LikeRow = Database['public']['Tables']['creation_likes']['Row'];
type CommentRow = Database['public']['Tables']['creation_comments']['Row'];
type VoteRow = Database['public']['Tables']['votes']['Row'];

export type RepositoryResult<T> = {
  items: T[];
  source: DataSource;
  error?: string;
};

export type MaterialCreationInput = {
  title: string;
  pieceType: string;
  condition: string;
  goal: string;
  material: string;
  notes: string;
  imageName: string;
  imageDataUrl: string;
  visibility?: Database['public']['Enums']['creation_visibility'];
};

export type SaveCreationResult =
  | { mode: 'local'; reason: 'not-configured' | 'not-authenticated' | 'remote-error'; error?: string }
  | { mode: 'supabase'; creationId: string };

type CommunityMeta = {
  profilesById: Map<string, ProfileRow>;
  likesByCreationId: Map<string, number>;
  commentsByCreationId: Map<string, CommunityComment[]>;
  commentCountsByCreationId: Map<string, number>;
  votesByCreationId: Map<string, number>;
  viewerLikedPostIds: Set<string>;
  viewerVotedPostIds: Set<string>;
};

const CREATION_IMAGES_BUCKET = 'creation-images';

function mapTutorial(row: TutorialRow): Tutorial {
  return {
    id: row.id,
    title: row.title,
    material: row.material,
    difficulty: row.difficulty,
    duration: row.duration,
    category: row.category,
    image: row.image,
    description: row.description,
  };
}

function mapChallenge(row: ChallengeRow): Challenge {
  return {
    id: row.id,
    title: row.title,
    theme: row.theme,
    status: row.status === 'Terminé' ? 'Bientôt' : row.status,
    participants: row.participants,
    description: row.description,
  };
}

function getImageVariant(material: string): CommunityPost['imageVariant'] {
  const normalizedMaterial = material.toLowerCase();

  if (normalizedMaterial.includes('denim') || normalizedMaterial.includes('jean')) {
    return 'denim';
  }

  if (normalizedMaterial.includes('toile') || normalizedMaterial.includes('technique')) {
    return 'technical';
  }

  if (normalizedMaterial.includes('canvas') || normalizedMaterial.includes('coton')) {
    return 'canvas';
  }

  return 'sage';
}

function inferChallengeId(row: CreationRow) {
  const normalizedText = `${row.material} ${row.goal} ${row.piece_type}`.toLowerCase();

  if (normalizedText.includes('denim') || normalizedText.includes('jean')) {
    return 'denim-second-life';
  }

  if (normalizedText.includes('toile') || normalizedText.includes('technique') || normalizedText.includes('tente')) {
    return 'technical-textile';
  }

  return 'visible-repair';
}

function mapCreation(row: CreationRow, meta?: CommunityMeta): CommunityPost {
  const profile = meta?.profilesById.get(row.owner_id);
  const comments = meta?.commentsByCreationId.get(row.id) ?? [];

  return {
    id: row.id,
    authorName: profile?.display_name || 'Membre RE:FORM',
    authorRole: 'Créateur textile',
    title: row.title,
    description: row.notes || `Transformation ${row.goal.toLowerCase()} autour de ${row.material.toLowerCase()}.`,
    material: row.material,
    technique: row.goal,
    challenge: row.piece_type,
    challengeId: inferChallengeId(row),
    imageVariant: getImageVariant(row.material),
    likes: meta?.likesByCreationId.get(row.id) ?? 0,
    commentsCount: meta?.commentCountsByCreationId.get(row.id) ?? comments.length,
    comments,
    votes: meta?.votesByCreationId.get(row.id) ?? 0,
    viewerHasLiked: meta?.viewerLikedPostIds.has(row.id) ?? false,
    viewerHasVoted: meta?.viewerVotedPostIds.has(row.id) ?? false,
    createdAt: row.created_at,
  };
}

function createSafeId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `item-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function parseImageDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([a-zA-Z0-9+/=]+)$/);

  if (!match) {
    throw new Error('Invalid image data URL');
  }

  const [, mimeType, base64] = match;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  const extension = mimeType === 'image/jpeg' ? 'jpg' : mimeType.replace('image/', '');

  return {
    blob: new Blob([bytes], { type: mimeType }),
    extension,
    mimeType,
  };
}

function countByCreationId(rows: Array<Pick<LikeRow | CommentRow | VoteRow, 'creation_id'>>) {
  return rows.reduce<Map<string, number>>((counts, row) => {
    counts.set(row.creation_id, (counts.get(row.creation_id) ?? 0) + 1);
    return counts;
  }, new Map());
}

function groupComments(rows: CommentRow[], profilesById: Map<string, ProfileRow>) {
  return rows.reduce<Map<string, CommunityComment[]>>((commentsByCreation, row) => {
    const comments = commentsByCreation.get(row.creation_id) ?? [];

    if (comments.length < 3) {
      comments.push({
        id: row.id,
        authorName: profilesById.get(row.user_id)?.display_name || 'Membre RE:FORM',
        body: row.body,
        createdAt: row.created_at,
      });
    }

    commentsByCreation.set(row.creation_id, comments);
    return commentsByCreation;
  }, new Map());
}

async function getCommunityMeta(rows: CreationRow[], viewerId?: string): Promise<CommunityMeta> {
  const creationIds = rows.map((row) => row.id);
  const ownerIds = rows.map((row) => row.owner_id);

  const [profilesResult, likesResult, commentsResult, votesResult] = await Promise.all([
    supabase!.from('profiles').select('id,display_name,avatar_url,created_at,updated_at').in('id', ownerIds),
    supabase!.from('creation_likes').select('id,creation_id,user_id,created_at').in('creation_id', creationIds),
    supabase!
      .from('creation_comments')
      .select('id,creation_id,user_id,body,created_at,updated_at')
      .in('creation_id', creationIds)
      .order('created_at', { ascending: false })
      .limit(80),
    supabase!.from('votes').select('id,challenge_id,creation_id,voter_id,created_at').in('creation_id', creationIds),
  ]);

  const profiles = profilesResult.data ?? [];
  const likes = likesResult.data ?? [];
  const comments = commentsResult.data ?? [];
  const votes = votesResult.data ?? [];
  const commentUserIds = Array.from(new Set(comments.map((comment) => comment.user_id)));

  const commentProfilesResult =
    commentUserIds.length > 0
      ? await supabase!.from('profiles').select('id,display_name,avatar_url,created_at,updated_at').in('id', commentUserIds)
      : { data: [] as ProfileRow[] };

  const profilesById = [...profiles, ...(commentProfilesResult.data ?? [])].reduce<Map<string, ProfileRow>>((profileMap, profile) => {
    profileMap.set(profile.id, profile);
    return profileMap;
  }, new Map());

  return {
    profilesById,
    likesByCreationId: countByCreationId(likes),
    commentsByCreationId: groupComments(comments, profilesById),
    commentCountsByCreationId: countByCreationId(comments),
    votesByCreationId: countByCreationId(votes),
    viewerLikedPostIds: new Set(viewerId ? likes.filter((like) => like.user_id === viewerId).map((like) => like.creation_id) : []),
    viewerVotedPostIds: new Set(viewerId ? votes.filter((vote) => vote.voter_id === viewerId).map((vote) => vote.creation_id) : []),
  };
}

export async function getTutorials(limit?: number): Promise<RepositoryResult<Tutorial>> {
  if (!supabase) {
    return { items: limit ? fallbackTutorials.slice(0, limit) : fallbackTutorials, source: 'mock' };
  }

  let query = supabase
    .from('tutorials')
    .select('id,title,material,difficulty,duration,category,image,description,is_published,created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || data.length === 0) {
    return {
      items: limit ? fallbackTutorials.slice(0, limit) : fallbackTutorials,
      source: 'mock',
      error: error?.message,
    };
  }

  return { items: data.map(mapTutorial), source: 'supabase' };
}

export async function getChallenges(limit?: number): Promise<RepositoryResult<Challenge>> {
  if (!supabase) {
    return { items: limit ? fallbackChallenges.slice(0, limit) : fallbackChallenges, source: 'mock' };
  }

  let query = supabase
    .from('challenges')
    .select('id,title,theme,status,participants,description,is_published,starts_at,ends_at,created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || data.length === 0) {
    return {
      items: limit ? fallbackChallenges.slice(0, limit) : fallbackChallenges,
      source: 'mock',
      error: error?.message,
    };
  }

  return { items: data.map(mapChallenge), source: 'supabase' };
}

export async function getCommunityPosts(viewerId?: string, limit?: number): Promise<RepositoryResult<CommunityPost>> {
  if (!supabase) {
    return { items: limit ? fallbackCommunityPosts.slice(0, limit) : fallbackCommunityPosts, source: 'mock' };
  }

  let query = supabase
    .from('creations')
    .select('id,owner_id,title,piece_type,condition,goal,material,notes,image_name,image_path,visibility,created_at')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || data.length === 0) {
    return {
      items: limit ? fallbackCommunityPosts.slice(0, limit) : fallbackCommunityPosts,
      source: 'mock',
      error: error?.message,
    };
  }

  const meta = await getCommunityMeta(data, viewerId);

  return { items: data.map((row) => mapCreation(row, meta)), source: 'supabase' };
}

export async function toggleCommunityLike(postId: string, shouldLike: boolean) {
  if (!supabase) {
    return { ok: false, reason: 'not-configured' as const };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, reason: 'not-authenticated' as const };
  }

  const { error } = shouldLike
    ? await supabase.from('creation_likes').upsert(
        {
          creation_id: postId,
          user_id: user.id,
        },
        { onConflict: 'creation_id,user_id', ignoreDuplicates: true },
      )
    : await supabase.from('creation_likes').delete().match({ creation_id: postId, user_id: user.id });

  return error ? { ok: false, reason: 'remote-error' as const, error: error.message } : { ok: true };
}

export async function addCommunityComment(postId: string, body: string) {
  if (!supabase) {
    return { ok: false, reason: 'not-configured' as const };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, reason: 'not-authenticated' as const };
  }

  const safeBody = body.trim().slice(0, 500);

  if (!safeBody) {
    return { ok: false, reason: 'invalid-input' as const };
  }

  const { error } = await supabase.from('creation_comments').insert({
    creation_id: postId,
    user_id: user.id,
    body: safeBody,
  });

  return error ? { ok: false, reason: 'remote-error' as const, error: error.message } : { ok: true };
}

export async function toggleCommunityVote(postId: string, challengeId: string | undefined, shouldVote: boolean) {
  if (!supabase || !challengeId) {
    return { ok: false, reason: 'not-supported' as const };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, reason: 'not-authenticated' as const };
  }

  const { error } = shouldVote
    ? await supabase.from('votes').upsert(
        {
          challenge_id: challengeId,
          creation_id: postId,
          voter_id: user.id,
        },
        { onConflict: 'challenge_id,creation_id,voter_id', ignoreDuplicates: true },
      )
    : await supabase.from('votes').delete().match({ challenge_id: challengeId, creation_id: postId, voter_id: user.id });

  return error ? { ok: false, reason: 'remote-error' as const, error: error.message } : { ok: true };
}

export async function saveMaterialCreation(input: MaterialCreationInput): Promise<SaveCreationResult> {
  if (!supabase) {
    return { mode: 'local', reason: 'not-configured' };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { mode: 'local', reason: 'not-authenticated', error: userError?.message };
  }

  try {
    const creationId = createSafeId();
    const { blob, extension, mimeType } = parseImageDataUrl(input.imageDataUrl);
    const safeImageName = sanitizeFileName(input.imageName) || `creation.${extension}`;
    const imagePath = `${user.id}/${creationId}-${safeImageName}`;

    const { error: uploadError } = await supabase.storage.from(CREATION_IMAGES_BUCKET).upload(imagePath, blob, {
      cacheControl: '3600',
      contentType: mimeType,
      upsert: false,
    });

    if (uploadError) {
      return { mode: 'local', reason: 'remote-error', error: uploadError.message };
    }

    const creation: CreationInsert = {
      id: creationId,
      owner_id: user.id,
      title: input.title,
      piece_type: input.pieceType,
      condition: input.condition,
      goal: input.goal,
      material: input.material,
      notes: input.notes,
      image_name: input.imageName,
      image_path: imagePath,
      visibility: input.visibility ?? 'private',
    };

    const { error: insertError } = await supabase.from('creations').insert(creation);

    if (insertError) {
      await supabase.storage.from(CREATION_IMAGES_BUCKET).remove([imagePath]);
      return { mode: 'local', reason: 'remote-error', error: insertError.message };
    }

    return { mode: 'supabase', creationId };
  } catch (error) {
    return {
      mode: 'local',
      reason: 'remote-error',
      error: error instanceof Error ? error.message : 'Unexpected Supabase error',
    };
  }
}
