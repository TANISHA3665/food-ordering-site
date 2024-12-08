export interface CreateVendorInput {
    name: string,
    ownerName: string,
    foodType: [string],
    phone: string,
    email: string,
    address: string,
    pincode: string,
    password: string,
};

export interface EditVendorProfileInput {
    name: string,
    foodType: [string],
    phone: string,
    address: string,
};

export interface LoginVendorInput {
    email: string,
    password: string,
};

export interface VendorPayload {
    _id: string,
    email: string,
    name: string,
    foodType: [string],
};