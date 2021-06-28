import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import connectDB from './config/db.js';

const app = express();

await connectDB();

app.use(cors());

app.use(express.json());

process.env.NODE_ENV !== 'production' && app.use(morgan('dev'));

console.table(listEndpoints(app));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server runnig on port ${PORT}`));
