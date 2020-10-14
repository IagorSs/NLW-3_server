import express, { json } from 'express';
import 'express-async-errors';
import routes from './routes';
import './database/connection';
import path from 'path';
import errorHandler from './errors/handler';
import cors from 'cors';

const PORT = 3333;

const app = express();

app.use(cors());

app.use(json());

app.use(routes);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use(errorHandler);

// app.use((err:any, req:Request, res:Response) => {
//   return res.status(err.statusCode||500).json({error: err.message});
// });

app.listen(PORT, () => {
  console.log(`Server is running on port - ${PORT}`);
});
