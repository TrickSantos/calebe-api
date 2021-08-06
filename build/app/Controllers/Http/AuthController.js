"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Recuperar_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Mailers/Recuperar"));
class AuthController {
    async login({ request, response, auth }) {
        const { email, password } = request.all();
        try {
            const token = await auth.use('api').attempt(email, password, {
                expiresIn: '7 days',
            });
            await User_1.default.findOrFail(token.user.id).then(async (user) => {
                await user.load('equipe');
                response.status(200).send({ ...token, user });
            });
        }
        catch (error) {
            if (error.code === 'E_INVALID_AUTH_UID' || error.code === 'E_INVALID_AUTH_PASSWORD') {
                return response
                    .status(500)
                    .send({ message: 'Email ou senha invalidos, favor tentar novamente.' });
            }
            else {
                return response
                    .status(500)
                    .send({ message: 'Ocorreu um erro durante a autenticação, favor tentar novamente.' });
            }
        }
    }
    async logout({ response, auth }) {
        try {
            return await auth.use('api').logout();
        }
        catch (error) {
            return response
                .status(500)
                .send({ message: 'Ocorreu um erro durante a autenticação, favor tentar novamente.' });
        }
    }
    async recuperar({ request, response, auth }) {
        const { email } = request.all();
        try {
            const user = await User_1.default.findByOrFail('email', email);
            const token = await auth.use('api').generate(user, {
                expiresIn: '30min',
            });
            await new Recuperar_1.default(user, token.token).send();
            return response.status(200).send({ message: 'Email enviado com sucesso' });
        }
        catch (error) {
            console.log(error);
            return response.status(500).send({ message: 'Este email não existe, tente novamente' });
        }
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map