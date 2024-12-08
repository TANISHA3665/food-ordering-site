import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { AdminRouter, VendorRouter } from './routes';
import { MONGO_URI } from './config';

const app = express();

const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/admin', AdminRouter);
app.use('/vendor', VendorRouter);

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch(err => console.log(`err : ${err}`));

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});