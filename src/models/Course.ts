// app/models/Course.ts
import mongoose, { Document, Schema } from "mongoose";
import { IHole } from "./Hole";
export interface ICourse extends Document {
  name: string; // "Bueng Aram Golf Club"
  description: string;
  layout: {
    totalHoles: number;
    totalPar: number;
    courseType: "lakeside" | "links" | "parkland" | "desert";
    terrain: string;
    waterFeatures: {
      mainLake: boolean;
      streams: boolean;
      ponds: number;
    };
  };
  facilities: {
    drivingRange: {
      available: boolean;
      underRenovation: boolean;
    };
    practice: {
      puttingGreen: boolean;
      chippingArea: boolean;
    };
    clubhouse: {
      available: boolean;
      amenities: string[];
    };
  };
  holes: mongoose.Types.ObjectId[] | IHole[];
  overallRating: {
    difficulty: number;
    maintenance: number;
    scenic: number;
  };
  gpsCoordinates: {
    latitude: number;
    longitude: number;
  };
  mainImageUrls: string[]; // Course layout image
  holeLayouts: string[]; // Array of individual hole layout images
}

const CourseSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    layout: {
      totalHoles: { type: Number, default: 18 },
      totalPar: { type: Number, required: true },
      courseType: {
        type: String,
        enum: ["lakeside", "links", "parkland", "desert"],
        required: true,
      },
      terrain: { type: String },
      waterFeatures: {
        mainLake: { type: Boolean, default: false },
        streams: { type: Boolean, default: false },
        ponds: { type: Number, default: 0 },
      },
    },
    facilities: {
      drivingRange: {
        available: { type: Boolean, default: true },
        underRenovation: { type: Boolean, default: false },
      },
      practice: {
        puttingGreen: { type: Boolean, default: true },
        chippingArea: { type: Boolean, default: true },
      },
      clubhouse: {
        available: { type: Boolean, default: true },
        amenities: [{ type: String }],
      },
    },
    holes: [{ type: Schema.Types.ObjectId, ref: "Hole", required: true }],
    overallRating: {
      difficulty: { type: Number, min: 1, max: 5 },
      maintenance: { type: Number, min: 1, max: 5 },
      scenic: { type: Number, min: 1, max: 5 },
    },
    gpsCoordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    mainImageUrls: [{ type: String, required: true }],
    holeLayouts: [{ type: String }],
  },
  { timestamps: true }
);
const Course =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
