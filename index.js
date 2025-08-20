import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDb from './config/connectDb.js';
import userRouter from './routes/user.route.js';
import categoryRouter from './routes/category.route.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';
import wishListRouter from './routes/wishList.route.js';

const app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined'));
app.use(helmet({
    crossOriginResourcePolicy: false,
}))

app.get('/', (request, response) => {
    response.json({
        message : 'Server is running ' + process.env.PORT
    });
});


app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishListRouter);


connectDb().then(() => {
    app.listen(process.env.PORT,'0.0.0.0', () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
    console.log(`Server is running on port ${process.env.PORT}`);
})