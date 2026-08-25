import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

import { authRouter } from './routes/auth';
import { profileRouter } from './routes/profiles';
import { todoRouter } from './routes/todo';
import { stepoutRouter } from './routes/stepout';
import { eventRouter } from './routes/events';
import { choreRouter } from './routes/chores';
import { examRouter } from './routes/exams';
import { olympiadRouter } from './routes/olympiad';
import { homeworkRouter } from './routes/homework';
import { fitnessRouter } from './routes/fitness';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profiles', profileRouter);
app.use('/api/v1/todo', todoRouter);
app.use('/api/v1/stepout', stepoutRouter);
app.use('/api/v1/events', eventRouter);
app.use('/api/v1/chores', choreRouter);
app.use('/api/v1/exams', examRouter);
app.use('/api/v1/olympiad', olympiadRouter);
app.use('/api/v1/homework', homeworkRouter);
app.use('/api/v1/fitness', fitnessRouter);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
