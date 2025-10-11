import express from 'express';

import errorHandler from './middleware/errorHandeler.js';
import userRoutes from './routes/User.Routes.js'
import audioRoutes from './routes/audio.Routes.js'
import auth from './routes/auth.Routes.js'

import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

const app = express();


// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true, 
//   legacyHeaders: false,
// });

// app.use(limiter);
app.use(helmet());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/audios',audioRoutes)
app.use('/api/users',userRoutes)
app.use('/api/auth',auth)

app.use(errorHandler);
export default app;
