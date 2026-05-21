import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { connectDB } from './config/db';
import { corsMiddleware } from './middleware/cors';
import { rateLimiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './routes/user.routes';
import trendingRoutes from './routes/trending.routes';

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(helmet());
app.use(corsMiddleware);
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimiter);

app.use('/api/user', userRoutes);
app.use('/api/trending', trendingRoutes);

app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

export default app;
