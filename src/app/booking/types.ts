// app/booking/types.ts
import { Types } from 'mongoose';

export interface ICourse {
  _id: Types.ObjectId;
  name: string;
}

export interface ITeeTimeDocument {
  _id: Types.ObjectId;
  date: Date;
  time: string;
  course: ICourse;
  maxPlayers: number;
  availableSlots: number;
  price: number;
  isAvailable: boolean;
}

export interface IPopulatedTeeTime extends ITeeTimeDocument {
  course: {
    _id: Types.ObjectId;
    name: string;
  };
}

export interface TeeTimeBooking {
  teeTimeId: string;
  date: Date;
  time: string;
  players: number;
  phoneNumber: string;
}

export interface TeeTimeResponse {
  _id: string;
  teeTimeId: string;
  date: Date;
  time: string;
  available: boolean;
  availableSlots: number;
  price: number;
  courseName: string;
  players: number;
  phoneNumber: string;
  formattedDate: string;
}

export interface PaginatedTeeTimeResponse {
  data: TeeTimeResponse[];
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
  totalCount?: number;
}