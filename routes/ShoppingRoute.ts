import express from 'express';
import { GetFoodAvailabilty, GetFoodsIn30Min, GetRestaurantById, GetTopRestaurants, SearchFoods } from '../controllers';

const router = express.Router();

// Food Availability
router.get('/:pincode', GetFoodAvailabilty);

// Top Restaurants
router.get('/top-restaurants/:pincode', GetTopRestaurants);

// Foods available in 30 minutes
router.get('/foods-in-30-minutes/:pincode', GetFoodsIn30Min);

// Search foods
router.get('/search/:pincode', SearchFoods);

// Food restaurant by id
router.get('/restaurant/:id', GetRestaurantById);

export { router as ShoppingRoute };