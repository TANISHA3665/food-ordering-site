import { Request, Response } from 'express';
import { CreateFoodInput, EditVendorProfileInput, LoginVendorInput } from '../dto';
import { FindVendor } from './AdminController';
import { GenerateAccessToken, VerifyPassword } from '../utility';
import { AuthenticatedRequest } from '../middlewares';
import { Food } from '../models';

export const LoginVendor = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = <LoginVendorInput>req.body;

    const existingVendor = await FindVendor('', email);

    if (existingVendor) {
        const validate = await VerifyPassword(password, existingVendor.password);

        if (validate) {
            const accessToken = GenerateAccessToken({
                _id: existingVendor.id,
                email: existingVendor.email,
                foodType: existingVendor.foodType,
                name: existingVendor.name
            });

            return res.status(200).json({ accessToken: accessToken });
        }
        else {
            return res.status(400).json({ error: "Password is not valid" });
        }
    }

    return res.status(400).json({ error: "Invalid credentials" });
};

export const UpdateVendorProfile = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const { name, address, phone, foodType } = <EditVendorProfileInput>req.body;

    const user = req.user;
    if (user) {
        const existingVendor = await FindVendor(user._id);

        if (existingVendor) {
            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodType;

            const savedResult = await existingVendor.save();
            return res.status(200).json(savedResult);
        }

        return res.status(200).json(existingVendor);
    }

    return res.status(400).json({ error: "Vendor information not found" });
};

export const UpdateVendorCoverImage = async (req: AuthenticatedRequest, res: Response): Promise<any> => {

    const user = req.user;

    if (user) {

        const existingVendor = await FindVendor(user._id);

        if (existingVendor) {

            const files = req.files as [Express.Multer.File];

            const images = files.map((file: Express.Multer.File) => file.filename);

            existingVendor.coverImages.push(...images);
            const result = await existingVendor.save();

            return res.status(200).json(result);
        }

        return res.status(200).json(existingVendor);
    }

    return res.status(400).json({ error: "Vendor information not found" });
};

export const UpdateVendorService = async (req: AuthenticatedRequest, res: Response): Promise<any> => {

    const user = req.user;

    if (user) {
        const existingVendor = await FindVendor(user._id);

        if (existingVendor) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;

            const savedResult = await existingVendor.save();
            return res.status(200).json(savedResult);
        }

        return res.status(200).json(existingVendor);
    }

    return res.status(400).json({ error: "Vendor information not found" });
};

export const AddFood = async (req: AuthenticatedRequest, res: Response): Promise<any> => {

    const user = req.user;

    if (user) {

        const { name, description, category, foodType, readyTime, price } = <CreateFoodInput>req.body;

        const existingVendor = await FindVendor(user._id);

        if (existingVendor) {

            const files = req.files as [Express.Multer.File];

            const images = files.map((file: Express.Multer.File) => file.filename);
            
            const createdFood = await Food.create({
                vendorId: existingVendor._id,
                name: name,
                description: description,
                category: category,
                foodType: foodType,
                readyTime: readyTime,
                price: price,
                rating: 0,
                images: images,
            });

            existingVendor.foods.push(createdFood);
            const result = await existingVendor.save();

            return res.status(200).json(result);
        }

        return res.status(200).json(existingVendor);
    }

    return res.status(400).json({ error: "Vendor information not found" });
};

export const GetFoods = async (req: AuthenticatedRequest, res: Response): Promise<any> => {

    const user = req.user;

    if (user) {
        const foods = await Food.find({ vendorId: user._id });

        return res.status(200).json(foods);
    }

    return res.status(400).json({ error: "Vendor information not found" });
};

export const GetVendorProfile = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const user = req.user;
    if (user) {
        const existingVendor = await FindVendor(user._id);

        return res.status(200).json(existingVendor);
    }

    return res.json({ error: "Vendor information not found" });
};