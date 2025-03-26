import mongoose, { Schema, Document } from 'mongoose';

export interface IArtist extends Document {
  name: string;
  image: string;
  spotifyId?: string;
  popularity: number;
  genres: string[];
  albums: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ArtistSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    spotifyId: { type: String },
    popularity: { type: Number, default: 0 },
    genres: [{ type: String }],
    albums: [{ type: Schema.Types.ObjectId, ref: 'Album' }]
  },
  { timestamps: true }
);

export default mongoose.models.Artist || mongoose.model<IArtist>('Artist', ArtistSchema);
