import mongoose, { Schema, Document } from 'mongoose';

export interface IAlbum extends Document {
  title: string;
  artist: mongoose.Types.ObjectId;
  coverImage: string;
  releaseDate: Date;
  genre: string[];
  tracks: {
    title: string;
    duration: number;
  }[];
  spotifyId?: string;
  totalDuration: number;
  popularity: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const AlbumSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
    coverImage: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    genre: [{ type: String }],
    tracks: [{
      title: { type: String, required: true },
      duration: { type: Number, required: true } // in seconds
    }],
    spotifyId: { type: String },
    totalDuration: { type: Number }, // in seconds
    popularity: { type: Number, default: 0 },
    description: { type: String }
  },
  { timestamps: true }
);

// Virtual for calculating average rating
AlbumSchema.virtual('averageRating').get(function() {
  // This would be implemented when the Review model is linked
  return 0;
});

export default mongoose.models.Album || mongoose.model<IAlbum>('Album', AlbumSchema);
