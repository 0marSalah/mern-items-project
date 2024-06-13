import mongoose, { Schema } from 'mongoose';

interface ItemI {
  name: string;
  description: string;
}

const ItemSchema = new Schema<ItemI>({
  name: { type: String, require: true },
  description: { type: String, require: true },
});

export const Item = mongoose.model('Item', ItemSchema);
