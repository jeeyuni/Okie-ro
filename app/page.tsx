'use client'

import { use, useState, useEffect } from 'react';
import PostCard from './components/PostCard';
interface Message {
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

export default function Home({
  searchParams
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const params = use(searchParams);
  const [posts, setPosts] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [myAnonId, setMyAnonId] = useState<string | null>(null);

  const isMyPage = params.filter === 'my';

  // 시간 차이 계산 함수
  const getTimeAgo = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 전`;
  };

  useEffect(() => {
    // localStorage에서 내 anon_id 가져오기
    const storedAnonId = localStorage.getItem('anon_id');
    setMyAnonId(storedAnonId);

    // 현재 위치 가져오기
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(`/api/messages?lat=${latitude}&lon=${longitude}`);
            const data = await response.json();

            if (response.ok && data.success) {
              setPosts(data.data);
            } else {
              setError(data.error || '메시지를 불러오는 중 오류가 발생했습니다');
            }
          } catch (err) {
            console.error('Fetch error:', err);
            setError('메시지를 불러오는 중 오류가 발생했습니다');
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error('위치 정보 가져오기 실패:', error);
          setError('위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
          setIsLoading(false);
        }
      );
    } else {
      setError('브라우저가 위치 서비스를 지원하지 않습니다.');
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-4">
        <div className="text-center text-gray-500">로딩 중...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-4">
        <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
          {error}
        </div>
      </main>
    );
  }

  // 필터링 로직
  const displayedPosts = isMyPage && myAnonId
    ? posts.filter(post => post.anon_id === myAnonId)
    : posts;

  // 빈 상태 처리
  if (isMyPage && !myAnonId) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-4">
        <div className="text-center text-gray-500 bg-gray-50 p-8 rounded-lg">
          <p className="text-lg mb-2">아직 작성한 글이 없습니다</p>
          <p className="text-sm">첫 번째 메시지를 작성해보세요!</p>
        </div>
      </main>
    );
  }

  if (displayedPosts.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-4">
        <div className="text-center text-gray-500 bg-gray-50 p-8 rounded-lg">
          {isMyPage ? (
            <>
              <p className="text-lg mb-2">작성한 글이 없습니다</p>
              <p className="text-sm">이 지역에 작성한 메시지가 없습니다</p>
            </>
          ) : (
            <>
              <p className="text-lg mb-2">주변에 메시지가 없습니다</p>
              <p className="text-sm">첫 번째 메시지를 작성해보세요!</p>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    // 메인 피드
    <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
      {displayedPosts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          anon_id={post.anon_id}
          content={post.content}
          votes_count={post.votes_count}
          lat = {post.lat}
          lon = {post.lon}
          dong_name= {post.dong_name}
          comments_count={post.comments_count}
          created_at={post.created_at}
        />
      ))}
    </main>
  );
}
