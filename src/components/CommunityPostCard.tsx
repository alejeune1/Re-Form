import { motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import type { CommunityComment, CommunityPost } from '../data/community';

const swatches: Record<CommunityPost['imageVariant'], string> = {
  denim: 'from-[#254A64] via-[#6C8FA5] to-[#D8C7AA]',
  canvas: 'from-[#DCC9AA] via-[#F6F0E6] to-[#8D755C]',
  sage: 'from-[#5F7F5E] via-[#A9B89A] to-[#EFE3D1]',
  technical: 'from-[#3A352E] via-[#536B7F] to-[#A89F91]',
};

type CommunityPostCardProps = {
  post: CommunityPost;
  index?: number;
  liked: boolean;
  voted: boolean;
  comments: CommunityComment[];
  isSyncing?: boolean;
  onToggleLike: (postId: string) => void;
  onToggleVote: (postId: string) => void;
  onAddComment: (postId: string, comment: string) => void;
};

export default function CommunityPostCard({
  post,
  index = 0,
  liked,
  voted,
  comments,
  isSyncing = false,
  onToggleLike,
  onToggleVote,
  onAddComment,
}: CommunityPostCardProps) {
  const [commentDraft, setCommentDraft] = useState('');

  function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAddComment(post.id, commentDraft);
    setCommentDraft('');
  }

  return (
    <motion.article
      id={post.id}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.62, delay: index * 0.06, ease: 'easeOut' }}
      className="overflow-hidden rounded-[2rem] border border-textile/10 bg-cream/70 shadow-[0_24px_80px_rgba(90,70,50,0.1)] backdrop-blur"
    >
      <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${swatches[post.imageVariant]}`}>
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(135deg,rgba(246,240,230,0.8)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="absolute left-5 top-5 rounded-full bg-cream/82 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-textile backdrop-blur">
          {post.challenge}
        </div>
        <div className="absolute bottom-5 left-5 right-5 rounded-[1.25rem] border border-cream/40 bg-cream/62 p-4 backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage">{post.material}</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-ink">{post.title}</h2>
        </div>
      </div>

      <div className="grid gap-5 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-bold tracking-[-0.03em] text-ink">{post.authorName}</p>
            <p className="text-sm font-semibold text-textile/60">{post.authorRole}</p>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-textile/48">
            {new Date(post.createdAt).toLocaleDateString('fr-FR')}
          </p>
        </div>

        <p className="leading-7 text-textile/74">{post.description}</p>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-bone/45 px-3 py-1 text-xs font-bold text-textile/72">{post.technique}</span>
          <span className="rounded-full bg-bone/45 px-3 py-1 text-xs font-bold text-textile/72">{post.material}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            aria-pressed={liked}
            disabled={isSyncing}
            onClick={() => onToggleLike(post.id)}
            className={`rounded-full px-3 py-2 text-sm font-bold transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
              liked ? 'bg-sage text-cream' : 'border border-textile/12 text-ink hover:bg-sage/12'
            }`}
          >
            {post.likes + (liked && !post.viewerHasLiked ? 1 : 0)} likes
          </button>
          <button
            type="button"
            aria-pressed={voted}
            disabled={isSyncing}
            onClick={() => onToggleVote(post.id)}
            className={`rounded-full px-3 py-2 text-sm font-bold transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
              voted ? 'bg-ink text-cream' : 'border border-textile/12 text-ink hover:bg-sage/12'
            }`}
          >
            {post.votes + (voted && !post.viewerHasVoted ? 1 : 0)} votes
          </button>
          <span className="rounded-full border border-textile/12 px-3 py-2 text-center text-sm font-bold text-textile/72">
            {post.commentsCount + Math.max(0, comments.length - (post.comments?.length ?? 0))} com.
          </span>
        </div>

        <form className="grid gap-2" onSubmit={handleCommentSubmit}>
          <label className="sr-only" htmlFor={`comment-${post.id}`}>
            Ajouter un commentaire
          </label>
          <input
            id={`comment-${post.id}`}
            value={commentDraft}
            onChange={(event) => setCommentDraft(event.target.value.slice(0, 180))}
            maxLength={180}
            placeholder="Ajouter un retour constructif..."
            className="rounded-full border border-textile/12 bg-bone/28 px-4 py-3 text-sm font-semibold text-textile outline-none placeholder:text-textile/45"
          />
        </form>

        {comments.length > 0 ? (
          <div className="grid gap-2">
            {comments.map((comment) => (
              <p key={comment.id} className="rounded-[1rem] bg-bone/30 px-4 py-3 text-sm leading-6 text-textile/76">
                <span className="font-bold text-ink">{comment.authorName} · </span>
                {comment.body}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}
