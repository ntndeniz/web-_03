import AuthService from '../../../domain/services/auth/AuthService';
import { validateRegistration, validateLogin } from '../../validators/auth/AuthValidator';

class AuthController {
    async register(req, res, next) {
        try {
            const { error } = validateRegistration(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const result = await AuthService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { error } = validateLogin(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const { email, password } = req.body;
            const result = await AuthService.login(email, password);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController(); 