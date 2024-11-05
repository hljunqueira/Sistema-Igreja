// frontend/src/types/dashboard.ts
export interface DashboardData {
    totalMembers: number;
    upcomingEvents: number;
    totalMinistries: number;
    memberGrowth: {
      name: string;
      membros: number;
    }[];
  }