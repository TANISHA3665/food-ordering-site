import { Request, Response } from 'express';
import { EditVendorProfileInput, LoginVendorInput } from '../dto';
import { FindVendor } from './AdminController';
import { GenerateAccessToken, VerifyPassword } from '../utility';
import { AuthenticatedRequest } from '../middlewares';

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

export const GetVendorProfile = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const user = req.user;
    if (user) {
        const existingVendor = await FindVendor(user._id);

        return res.status(200).json(existingVendor);
    }

    return res.json({ error: "Vendor information not found" });
};