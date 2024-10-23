// app/types/course.ts

import { Types } from "mongoose";

// Raw course data from MongoDB
export interface RawCourse {
  _id: Types.ObjectId;
  name: string;
  description: string;
  imageUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  par: number;
  length: number;
  rating: number;
  isOpen: boolean;
}

// Transformed course data for client use
export interface FeaturedCourse {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: string;
  par: number;
  length: number;
  rating: number;
  isOpen: boolean;
}