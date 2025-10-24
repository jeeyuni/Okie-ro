'use client'; // 클라이언트 컴포넌트로 변경

import PostCard from './components/PostCard';
import { useEffect, useState } from 'react';

interface Message {
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

export default function Home() {
  // 게시글 목록 데이터
  const [posts, setPosts] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //GET API 호출
    fetch('/api/messages')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);


  if (loading) return <div>로딩중...</div>;


  return (
    // 메인 피드
    <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          anon_id={post.anon_id}
          content={post.content}
          likes_count={post.likes_count}
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
