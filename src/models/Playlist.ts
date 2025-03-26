import mongoose, { Schema, Document } from 'mongoose';

export interface IPlaylist extends Document {
  title: string;
  creator: mongoose.Types.ObjectId;
  coverImage: string;
  albums: mongoose.Types.ObjectId[];
  description: string;
  isPublic: boolean;
  likes: mongoose.Types.ObjectId[];
  comments: {
    user: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    coverImage: { type: String, required: true },
    albums: [{ type: Schema.Types.ObjectId, ref: 'Album' }],
    description: { type: String },
    isPublic: { type: Boolean, default: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

export default mongoose.models.Playlist || mongoose.model<IPlaylist>('Playlist', PlaylistSchema);
