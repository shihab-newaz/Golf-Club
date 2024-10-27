// app/dashboard/types.ts

export interface DashboardStats {
  membershipStatus: string;
  name: string;
  totalBookings: number;
  completedBookings: number;
  upcomingBookings: number;
  registeredEvents: number;
  memberSince: Date;
}

export interface BookingData {
  _id: string;
  teeTime: {
    date: Date;
    time: string;
  };
  players: number;
  status: string;
}

export interface TeeTimeData {
  _id: string;
  date: Date;
  time: string;
  maxPlayers: number;
  availableSlots: number;
  price: number;
  isAvailable: boolean;
}

export interface EventData {
  _id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  description: string;
}

export interface DashboardData {
  stats: DashboardStats;
  bookings: BookingData[];
  events: EventData[];
  teeTimes: {
    items: TeeTimeData[];
    totalPages: number;
    currentPage: number;
  };
}

export interface StatsCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
}

export interface TableProps {
  data: any[];
  columns: {
    header: string;
    accessor: string;
    cell?: (row: any) => React.ReactNode;
  }[];
}