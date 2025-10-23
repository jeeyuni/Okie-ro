import PostCard from './components/PostCard';

export default function Home() {
  // 게시글 목록 데이터
  const posts = [
    {
      id: 1,
      content: '오늘도 회의가 3개... 정말 일 언제 하라는 건지 모르겠네요',
      voteCount: 39,
      commentCount: 12,
      timeAgo: '5분 전',
    },
    {
      id: 2,
      content: '점심 메뉴 추천 받습니다! 강남역 근처',
      voteCount: 27,
      commentCount: 8,
      timeAgo: '23분 전',
    },
    {
      id: 3,
      content: '재택근무 계속 했으면 좋겠다는 사람 손!',
      voteCount: 144,
      commentCount: 45,
      timeAgo: '1시간 전',
    },
  ];

  return (
    // 메인 피드
    <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          content={post.content}
          voteCount={post.voteCount}
          commentCount={post.commentCount}
          timeAgo={post.timeAgo}
        />
      ))}
    </main>
  );
}
