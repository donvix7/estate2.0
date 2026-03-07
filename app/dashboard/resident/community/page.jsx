import CommunityChat from '@/components/CommunityChat';
import { BackButton } from '@/components/ui/BackButton';

export default function ResidentCommunityPage() {
  return (
    <div className="p-6">
      <BackButton fallbackRoute="/dashboard/resident" label="Back to Dashboard" />
      <CommunityChat currentUserRole="resident" currentUserName="Resident User" currentUserAvatar="RU" />
    </div>
  );
}
