import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api', routes);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/geolocation';
const PORT = parseInt(String(process.env.PORT || 3000));


// Mongoose connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`Connected to MongoDB at ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Error connecting to MongoDB at ${MONGO_URI}`);
    console.error('MongoDB connection error:', err);
  });

export default app;
