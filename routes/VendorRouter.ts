import express from 'express';
import multer from 'multer';
import { AddFood, GetFoods, GetVendorProfile, LoginVendor, UpdateVendorCoverImage, UpdateVendorProfile, UpdateVendorService } from '../controllers';
import { Authenticate } from '../middlewares';

const router = express.Router();

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const images = multer({ storage: imageStorage }).array('images', 10);

router.post('/login', LoginVendor);

router.use(Authenticate);

// Profile

router.patch('/profile', UpdateVendorProfile);
router.patch('/coverimage', images, UpdateVendorCoverImage);
router.patch('/service', UpdateVendorService);

router.get('/profile', GetVendorProfile);

// Foods

router.post('/food', images, AddFood);

router.get('/foods', GetFoods);

export { router as VendorRouter };