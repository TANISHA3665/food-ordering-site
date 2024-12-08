import express from 'express';
import { GetVendorProfile, LoginVendor, UpdateVendorProfile, UpdateVendorService } from '../controllers';
import { Authenticate } from '../middlewares';

const router = express.Router();

router.post('/login', LoginVendor);

router.use(Authenticate);

router.patch('/profile', UpdateVendorProfile);
router.patch('/service', UpdateVendorService);

router.get('/profile', GetVendorProfile);

export { router as VendorRouter };