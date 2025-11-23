import { Shield, CreditCard, Crown } from 'lucide-react';

interface ProfileHeaderProps {
  userData: {
    fullName: string;
    email: string;
    avatar: string;
  };
  me?: any;
}

export default function ProfileHeader({ userData, me }: ProfileHeaderProps) {
  return (
    <div className="flex items-center space-x-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
          <img
            src={userData.avatar || "https://th.bing.com/th/id/OIP.kUFzwD5-mfBV0PfqgI5GrAHaHa?w=192&h=192&c=7&r=0&o=7&pid=1.7&rm=3"}
            className="w-24 h-24 rounded-full object-cover border"
          />
          {/* Vương miện luôn vàng */}
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
            <Crown className="w-8 h-8 drop-shadow" style={{ color: '#FFD700' }} />
          </span>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold">{userData.fullName}</h3>
        <p className="text-muted-foreground">{userData.email}</p>
        {/* Card điểm tích lũy và hạng */}
        <div className="mt-2 flex gap-4">
          <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-blue-700">Điểm tích lũy: 1000</span>
            {/* <span className="font-bold text-blue-900">{me?.loyalty_points ?? 0}</span> */}
          </div>
          <div className="px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-yellow-700">Hạng: GOLD</span>
            {/* <span className="font-bold text-yellow-900">{me?.rank ?? "Chưa có hạng"}</span> */}
          </div>
        </div>
      </div>
    </div>
  );
}
