'use client'

import { useState, useEffect } from 'react';
import { UpvoteIcon, DownvoteIcon, CommentIcon } from './Icons';
import { getUserId } from '@/lib/user';

interface PostCardProps {
  id: string;
  anon_id: string;
  content: string;
  votes_count: number;
  lat: number;
  lon: number;
  dong_name: string;
  comments_count: number;
  created_at: string;
}

export default function PostCard({ id, anon_id, content, votes_count, lat, lon, dong_name, comments_count, created_at }: PostCardProps) {
  const [currentVote, setCurrentVote] = useState<number>(0); // -1, 0, 1
  const [displayCount, setDisplayCount] = useState(votes_count);
  const [isLoading, setIsLoading] = useState(false);

  // 컴포넌트 마운트 시 사용자의 투표 상태 확인
  useEffect(() => {
    const fetchVoteStatus = async () => {
      const userId = getUserId();
      try {
        const response = await fetch(`/api/messages/${id}/vote?user_id=${userId}`);
        const data = await response.json();
        if (data.success) {
          setCurrentVote(data.vote_type);
        }
      } catch (error) {
        console.error('Failed to fetch vote status:', error);
      }
    };

    fetchVoteStatus();
  }, [id]);

  const handleVote = async (voteType: number) => {
    if (isLoading) return;

    const userId = getUserId();
    const previousVote = currentVote;
    const previousCount = displayCount;

    // 같은 버튼을 누르면 투표 취소
    const newVote = currentVote === voteType ? 0 : voteType;

    // 낙관적 업데이트 (UI 즉시 반영)
    // previousCount에서 이전 투표를 빼고 새 투표를 더함
    const newCount = previousCount - previousVote + newVote;

    setCurrentVote(newVote);
    setDisplayCount(newCount);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/messages/${id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vote_type: newVote,
          user_id: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '투표 중 오류가 발생했습니다');
      }
    } catch (error) {
      console.error('Vote error:', error);
      // 에러 발생 시 이전 상태로 롤백
      setCurrentVote(previousVote);
      setDisplayCount(previousCount);
      alert('투표 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex gap-4">
        {/* 투표 섹션 */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => handleVote(1)}
            disabled={isLoading}
            className={`transition-colors ${
              currentVote === 1
                ? 'text-orange-500'
                : 'text-gray-400 hover:text-orange-500'
            } disabled:opacity-50`}
          >
            <UpvoteIcon />
          </button>
          <span className={`font-semibold text-lg ${
            displayCount > 0 ? 'text-orange-500' : displayCount < 0 ? 'text-blue-500' : 'text-gray-500'
          }`}>
            {displayCount}
          </span>
          <button
            onClick={() => handleVote(-1)}
            disabled={isLoading}
            className={`transition-colors ${
              currentVote === -1
                ? 'text-blue-500'
                : 'text-gray-400 hover:text-blue-500'
            } disabled:opacity-50`}
          >
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
