import { Request, Response } from 'express';
import { FoodDoc, Vendor } from '../models';

export const GetFoodAvailabilty = async (req: Request, res: Response): Promise<any> => {
    const pincode = req.params.pincode;

    const foods = await Vendor.find({ pincode: pincode, serviceAvailable: true })
        .sort([['rating', 'descending']])
        .populate('foods');

    return res.status(200).json(foods);
};

export const GetTopRestaurants = async (req: Request, res: Response): Promise<any> => {
    const pincode = req.params.pincode;

    const restaurants = await Vendor.find({ pincode: pincode, serviceAvailable: true })
        .sort([['rating', 'descending']])
        .limit(10);

    return res.status(200).json(restaurants);
};

export const GetFoodsIn30Min = async (req: Request, res: Response): Promise<any> => {
    const pincode = req.params.pincode;

    const data = await Vendor.find({ pincode: pincode, serviceAvailable: true })
        .populate("foods");

    let foodResult: any = [];

    data.map(vendor => {
        const foods = vendor.foods as [FoodDoc];

        foodResult.push(...foods.filter(food => food.readyTime <= 30));
    });

    return res.status(200).json(foodResult);
};

export const SearchFoods = async (req: Request, res: Response): Promise<any> => {
    const pincode = req.params.pincode;

    const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
        .populate("foods");
    
    let foodResult: any = [];

    result.map(item => foodResult.push(...item.foods));
    
    res.status(200).json(foodResult);
};

export const GetRestaurantById = async (req: Request, res: Response): Promise<any> => {
    const id = req.params.id;

    const vendor = await Vendor.findById(id).populate("foods");

    if (vendor) {
        return res.status(200).json(vendor);
    }

    return res.status(400).json({ "error": "No data found" });
};