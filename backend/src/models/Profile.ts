import { Schema, model, Document } from 'mongoose';
import { GitHubProfile } from '../types';

export interface IProfile extends Document {
  username: string;
  data: GitHubProfile;
  cachedAt: Date;
}

const ProfileSchema = new Schema<IProfile>({
  username: { type: String, required: true, unique: true, lowercase: true },
  data: { type: Schema.Types.Mixed, required: true },
  cachedAt: { type: Date, default: Date.now, index: { expireAfterSeconds: 300 } },
});

export const Profile = model<IProfile>('Profile', ProfileSchema);
