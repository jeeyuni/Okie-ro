'use client'

import { useState, useEffect } from 'react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [dongName, setDongName] = useState('위치 확인 중...');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 익명 ID 생성
  const generateAnonId = () => {
    return `익명${Math.floor(Math.random() * 10000)}`;
  };

  // 위치 정보 가져오기
  useEffect(() => {
    if (isOpen) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lon: longitude });
            setDongName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            // TODO: 리버스 지오코딩 API를 사용해 실제 동 이름 가져오기
          },
          (error) => {
            console.error('위치 정보 가져오기 실패:', error);
            setDongName('위치를 가져올 수 없습니다');
            setError('위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
          }
        );
      } else {
        setDongName('위치 서비스를 지원하지 않습니다');
        setError('브라우저가 위치 서비스를 지원하지 않습니다.');
      }
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('내용을 입력해주세요');
      return;
    }

    if (!location) {
      setError('위치 정보를 가져오는 중입니다. 잠시만 기다려주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          lat: location.lat,
          lon: location.lon,
          anon_id: generateAnonId(),
          dong_name: dongName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '메시지 작성 중 오류가 발생했습니다');
      }

      // 성공
      setContent('');
      setLocation(null);
      setDongName('위치 확인 중...');
      onClose();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('POST error:', err);
      setError(err instanceof Error ? err.message : '메시지 작성 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">새 글 작성</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <div className="p-4 space-y-4">
          {/* 위치 정보 */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{dongName}</span>
          </div>

          {/* 내용 입력 */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="무슨 생각을 하고 계신가요?"
            className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />

          {/* 에러 메시지 */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {/* 글자 수 */}
          <div className="text-sm text-gray-500 text-right">
            {content.length} / 500
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={isLoading || !content.trim() || !location}
          >
            {isLoading ? '작성 중...' : '작성 완료'}
          </button>
        </div>
      </div>
    </div>
  );
}
