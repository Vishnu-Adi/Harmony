import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  album: mongoose.Types.ObjectId;
  rating: number;
  text: string;
  isFavorite: boolean;
  listenedDate: Date;
  likes: mongoose.Types.ObjectId[];
  comments: {
    user: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    album: { type: Schema.Types.ObjectId, ref: 'Album', required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    text: { type: String },
    isFavorite: { type: Boolean, default: false },
    listenedDate: { type: Date, default: Date.now },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
