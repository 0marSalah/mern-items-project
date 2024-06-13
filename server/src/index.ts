import express, { NextFunction, Response, Request } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import {
  createItem,
  deleteItem,
  getItems,
  updateItem,
} from './controllers/item';
import cors from 'cors';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/firstTechAssess');
    console.log('Database connected');
  } catch (err) {
    console.log('error sdtart the databasde' + err);
  }
};

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} on http://localhost:4040${req.url}`);
  next();
});

connectDB();

app.route('/items').post(createItem).get(getItems);

app.route('/items/:id').get().put(updateItem).delete(deleteItem);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`${req.method} on ${req.url} - Error:`, err);

  res.status(500).json({ error: 'Internal server error', success: false });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found', success: false });
});

app.listen(4040, () => {
  console.log('server running on http://localhost:4040');
});
