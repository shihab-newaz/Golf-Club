// app/booking/types.ts
export interface TeeTimeBooking {
  _id: string;
  teeTimeId: string; 
  date: Date;
  time: string;
  players: number;
  phoneNumber: string;
  available: boolean;
  userId?: string;
}

export interface HotelBooking {
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
}