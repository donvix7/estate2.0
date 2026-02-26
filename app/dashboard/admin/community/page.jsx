import CommunityChat from '@/components/CommunityChat';

export default function AdminCommunityPage() {
  return <CommunityChat currentUserRole="admin" currentUserName="System Admin" currentUserAvatar="SA" />;
}
