import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthPayload, VendorPayload } from '../dto';
import { SECRET_KEY } from '../config';
import { AuthenticatedRequest } from '../middlewares';

export const GenerateSalt = async () => {
    return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
};

export const VerifyPassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const GenerateAccessToken = (payload: VendorPayload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
};

export const ValidateAccessToken = async (req: AuthenticatedRequest) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (authHeader && typeof authHeader === 'string') {
        const token = authHeader.split(' ')[1];

        try {
            const payload = jwt.verify(token, SECRET_KEY) as AuthPayload;

            req.user = payload;

            return true;
        } catch (err) {
            if (err instanceof Error) {
                console.error('Invalid token:', err.message);
            } else {
                console.error('Unknown error during token verification', err);
            }
            return false;
        }
    }

    return false;
};
