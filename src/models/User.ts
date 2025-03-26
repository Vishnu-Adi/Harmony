import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  displayName: string;
  profileImage: string;
  spotifyId?: string;
  spotifyToken?: string;
  spotifyRefreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  favoriteAlbums: mongoose.Types.ObjectId[];
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    profileImage: { type: String, default: 'https://via.placeholder.com/100' },
    spotifyId: { type: String },
    spotifyToken: { type: String },
    spotifyRefreshToken: { type: String },
    favoriteAlbums: [{ type: Schema.Types.ObjectId, ref: 'Album' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
