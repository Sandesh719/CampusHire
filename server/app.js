// server/app.js
import express from 'express';
const app = express();
import cors from 'cors';
import dotenv from 'dotenv';
import User from './routes/UserRoutes.js';
import Job from './routes/JobRoutes.js'
import Application from './routes/ApplicationRoutes.js';
import Admin from './routes/AdminRoutes.js';
import portfolioRoutes from './routes/PortfolioRoutes.js'; // ADD THIS IMPORT

// --------------------------------------------------
//  Load environment variables
// --------------------------------------------------
dotenv.config({ path: './config/config.env' });

// --------------------------------------------------
//  Core Express middlewares
// --------------------------------------------------
app.use(
  cors({
    origin: '*',        // allow all origins; tighten later for production
    credentials: true,
  })
);

// JSON / URL‑encoded parsers – only for non‑multipart routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --------------------------------------------------
//  Routers
// --------------------------------------------------

//const { errorMiddleware } = require('./middlewares/error');

// Attach route groups
app.use('/api/v1', User);
app.use('/api/v1', Job);
app.use('/api/v1', Application);
app.use('/api/v1', Admin);
app.use('/api/v1', portfolioRoutes); // ADD THIS LINE

// --------------------------------------------------
//  Simple health endpoint
// --------------------------------------------------
app.get('/', (req, res) => {
  res.json('Server is running ✅');
});

// --------------------------------------------------
//  Global error handler
// --------------------------------------------------
//app.use(errorMiddleware);

// --------------------------------------------------
//  Export app (entry script imports and starts listener)
// --------------------------------------------------
export default app;