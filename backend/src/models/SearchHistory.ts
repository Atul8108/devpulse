import { Schema, model, Document } from 'mongoose';

export interface ISearchHistory extends Document {
  username: string;
  searchedAt: Date;
}

const SearchHistorySchema = new Schema<ISearchHistory>({
  username: { type: String, required: true, lowercase: true },
  searchedAt: { type: Date, default: Date.now },
});

SearchHistorySchema.index({ searchedAt: -1 });

export const SearchHistory = model<ISearchHistory>('SearchHistory', SearchHistorySchema);
