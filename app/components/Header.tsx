import { BriefcaseIcon } from './Icons';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {/* 로고 아이콘 */}
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <BriefcaseIcon />
        </div>
        <h1 className="text-xl font-bold text-gray-900">5km: 오키로</h1>
      </div>
    </header>
  );
}
