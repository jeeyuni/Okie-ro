// Heroicons를 사용한 아이콘 컴포넌트
import {
  BriefcaseIcon as HeroBriefcaseIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChatBubbleLeftIcon,
  PlusIcon as HeroPlusIcon,
  HomeIcon as HeroHomeIcon,
  UserIcon as HeroUserIcon,
} from '@heroicons/react/24/outline';
import { HomeIcon as HeroHomeIconSolid } from '@heroicons/react/24/solid';

export const BriefcaseIcon = () => (
  <HeroBriefcaseIcon className="w-6 h-6 text-white" />
);

export const UpvoteIcon = () => (
  <ChevronUpIcon className="w-6 h-6" />
);

export const DownvoteIcon = () => (
  <ChevronDownIcon className="w-6 h-6" />
);

export const CommentIcon = () => (
  <ChatBubbleLeftIcon className="w-4 h-4" />
);

export const PlusIcon = () => (
  <HeroPlusIcon className="w-8 h-8 text-white" />
);

export const HomeIcon = ({ active = false }: { active?: boolean }) => {
  const Icon = active ? HeroHomeIconSolid : HeroHomeIcon;
  return <Icon className={`w-6 h-6 ${active ? 'text-blue-600' : 'text-gray-400'}`} />;
};

export const UserIcon = ({ active = false }: { active?: boolean }) => (
  <HeroUserIcon className={`w-6 h-6 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
);
