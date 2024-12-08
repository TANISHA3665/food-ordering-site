import { Request, Response} from 'express';
import { CreateVendorInput } from '../dto';
import { Vendor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';

export const FindVendor = async (id: string | undefined, email?: string) => {

    if (email) {
        return await Vendor.findOne({ email });
    }
    else {
        return await Vendor.findById(id);
    }
};

export const CreateVendor = async (req: Request, res: Response): Promise<any> => {
    const { name, address, pincode, foodType, email, password, ownerName, phone } = <CreateVendorInput>req.body;

    const existingVendor = await FindVendor('', email);

    if (existingVendor) {
        return res.json({ error: "Vendor already exists with this emailId" });
    }

    const salt = await GenerateSalt();
    const hashedPassword = await GeneratePassword(password, salt);

    const createVendor = await Vendor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: hashedPassword,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
        salt: salt
    });

    return res.status(201).json(createVendor);
};

export const GetVendorById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    const vendor = await FindVendor(id);

    if (vendor) {
        return res.status(200).json(vendor);
    }

    res.status(400).json({ error: "No such vendor found" });
};

export const GetAllVendors = async (req: Request, res: Response): Promise<any> => {
    const vendors = await Vendor.find();
    return res.status(200).json(vendors);
};
