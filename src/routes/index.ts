import express  from 'express';
import userRouter from './userRouter';

const routes = express.Router();

routes.use("/user", userRouter);

export default routes;

