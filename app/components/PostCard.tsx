import { UpvoteIcon, DownvoteIcon, CommentIcon } from './Icons';

interface PostCardProps {
  id: string;
  anon_id: string;
  content: string;
  likes_count: number;
  lat: number;
  lon: number;
  dong_name: string;
  comments_count: number;
  created_at: string;
}

export default function PostCard({ id, anon_id, content, likes_count,lat,lon, dong_name, comments_count, created_at }: PostCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex gap-4">
        {/* 투표 섹션 */}
        <div className="flex flex-col items-center gap-1">
          <button className="text-gray-400 hover:text-gray-600">
            <UpvoteIcon />
          </button>
          <span className="text-blue-600 font-semibold text-lg">{likes_count}</span>
          <button className="text-gray-400 hover:text-gray-600">
            <DownvoteIcon />
          </button>
        </div>

        {/* 게시글 내용 */}
        <div className="flex-1">
          <p className="text-gray-900 text-base mb-2">{content}</p>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{created_at}</span>
            <div className="flex items-center gap-1">
              <CommentIcon />
              <span>{comments_count}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
