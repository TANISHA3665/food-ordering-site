import { Request, Response, NextFunction } from 'express';
import { AuthPayload } from '../dto';
import { ValidateAccessToken } from '../utility';

export interface AuthenticatedRequest extends Request {
    user?: AuthPayload;
}

export const Authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
    const validate = await ValidateAccessToken(req);

    if (validate) {
        return next();
    }

    return res.status(400).json({ error: "Unauthorized access" });
};
