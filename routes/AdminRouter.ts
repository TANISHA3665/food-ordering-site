import express from 'express';
import { CreateVendor, GetAllVendors, GetVendorById } from '../controllers';

const router = express.Router();

router.post('/vendor', CreateVendor);

router.get('/vendor/:id', GetVendorById);
router.get('/vendor', GetAllVendors);

export { router as AdminRouter };