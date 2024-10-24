// app/models/Hole.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IHole extends Document {
  _id: string;
  number: number;
  par: number;
  handicapStroke: number; // HS value shown in the hole card
  yardages: {
    red: number;    // Example: 324y from red tee
    white: number;  // Example: 359y from white tee
    yellow: number; // Example: 375y from yellow tee
    blue: number;   // Example: 398y from blue tee
  };
  waterHazards: {
    left: boolean;
    right: boolean;
    front: boolean;
  };
  bunkers: {
    positions: string[]; // ["left", "right", "greenside"]
    count: number;
  };
  green: {
    shape: string;
    size: "small" | "medium" | "large";
  };
  holeLayout: {
    type: string; // "straight" | "dogleg-left" | "dogleg-right"
    fairwayWidth: "narrow" | "medium" | "wide";
  };
  imageUrl: string; // Individual hole diagram
}

const HoleSchema: Schema = new Schema({
  number: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 18 
  },
  par: { 
    type: Number, 
    required: true, 
    min: 3, 
    max: 6 
  },
  handicapStroke: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 18 
  },
  yardages: {
    red: { type: Number, required: true },
    white: { type: Number, required: true },
    yellow: { type: Number, required: true },
    blue: { type: Number, required: true }
  },
  waterHazards: {
    left: { type: Boolean, default: false },
    right: { type: Boolean, default: false },
    front: { type: Boolean, default: false }
  },
  bunkers: {
    positions: [{ type: String }],
    count: { type: Number, default: 0 }
  },
  green: {
    shape: { type: String },
    size: { 
      type: String, 
      enum: ["small", "medium", "large"],
      default: "medium"
    }
  },
  holeLayout: {
    type: { type: String },
    fairwayWidth: { 
      type: String, 
      enum: ["narrow", "medium", "wide"],
      default: "medium"
    }
  },
  imageUrl: { type: String }
}, { timestamps: true });

export const Hole = mongoose.models.Hole || mongoose.model<IHole>("Hole", HoleSchema);
