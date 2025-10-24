'use client'

import { useState } from 'react';
import { HomeIcon, UserIcon, PlusIcon } from './Icons';
import CreatePostModal from './CreatePostModal_o';

export default function BottomNav() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        {/* 플로팅 버튼 (새 글 작성) - 네비게이션 바 위에 배치 */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute -top-7 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
        >
          <PlusIcon />
        </button>

      <div className="max-w-2xl mx-auto flex justify-around items-center h-16">
        {/* 피드 탭 (활성화) */}
        <button className="flex flex-col items-center gap-1 px-4 py-2">
          <HomeIcon active />
          <span className="text-xs text-blue-600 font-medium">피드</span>
        </button>

        {/* 새 글 버튼 공간 */}
        <div className="w-14"></div>

        {/* 내 글 탭 */}
        <button className="flex flex-col items-center gap-1 px-4 py-2">
          <UserIcon />
          <span className="text-xs text-gray-400">내 글</span>
        </button>
      </div>

      {/* 새 글 버튼 라벨 */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
        새 글
      </div>
    </nav>

    {/* Modal */}
    <CreatePostModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSuccess={() => {
        // TODO: 메시지 목록 새로고침
        window.location.reload();
      }}
    />
    </>
  );
}
