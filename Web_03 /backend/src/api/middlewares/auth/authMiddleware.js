import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import config from '../../../config/auth.config';

export const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            throw createError(401, 'Authentication token is required');
        }

        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            next(createError(401, 'Invalid token'));
        } else if (error.name === 'TokenExpiredError') {
            next(createError(401, 'Token expired'));
        } else {
            next(error);
        }
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            next(createError(403, 'Unauthorized access'));
            return;
        }
        next();
    };
}; 