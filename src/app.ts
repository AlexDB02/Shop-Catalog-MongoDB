import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api', routes);


// Mongoose connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/geolocation')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(3001, () => {
      console.log('Server running on http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

export default app;
