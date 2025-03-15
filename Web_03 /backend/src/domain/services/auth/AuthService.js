import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../../models/User';
import config from '../../../config/auth.config';

class AuthService {
    async register(userData) {
        const existingUser = await User.findOne({ where: { email: userData.email } });
        
        if (existingUser) {
            throw createError(409, 'Email already exists');
        }

        const user = await User.create(userData);
        const token = this.generateToken(user);

        return {
            user: this.sanitizeUser(user),
            token
        };
    }

    async login(email, password) {
        const user = await User.findOne({ where: { email } });

        if (!user || !(await user.validatePassword(password))) {
            throw createError(401, 'Invalid credentials');
        }

        if (!user.isActive) {
            throw createError(403, 'Account is disabled');
        }

        await user.update({ lastLogin: new Date() });
        const token = this.generateToken(user);

        return {
            user: this.sanitizeUser(user),
            token
        };
    }

    generateToken(user) {
        return jwt.sign(
            { 
                id: user.id,
                email: user.email,
                role: user.role 
            },
            config.jwtSecret,
            { expiresIn: config.jwtExpiration }
        );
    }

    sanitizeUser(user) {
        const { password, ...sanitizedUser } = user.toJSON();
        return sanitizedUser;
    }
}

export default new AuthService(); 