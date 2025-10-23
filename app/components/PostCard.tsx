import { UpvoteIcon, DownvoteIcon, CommentIcon } from './Icons';

interface PostCardProps {
  content: string;
  voteCount: number;
  commentCount: number;
  timeAgo: string;
}

export default function PostCard({ content, voteCount, commentCount, timeAgo }: PostCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex gap-4">
        {/* 투표 섹션 */}
        <div className="flex flex-col items-center gap-1">
          <button className="text-gray-400 hover:text-gray-600">
            <UpvoteIcon />
          </button>
          <span className="text-blue-600 font-semibold text-lg">{voteCount}</span>
          <button className="text-gray-400 hover:text-gray-600">
            <DownvoteIcon />
          </button>
        </div>

        {/* 게시글 내용 */}
        <div className="flex-1">
          <p className="text-gray-900 text-base mb-2">{content}</p>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{timeAgo}</span>
            <div className="flex items-center gap-1">
              <CommentIcon />
              <span>{commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
