"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const fs_1 = __importDefault(require("fs"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const S3_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/S3"));
const Convite_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Mailers/Convite"));
class UsuariosController {
    async index({ response }) {
        try {
            await User_1.default.all().then((users) => response.status(200).send(users));
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
    async store({ response, request }) {
        try {
            await request
                .validate({
                schema: Validator_1.schema.create({
                    email: Validator_1.schema.string({ trim: true }, [
                        Validator_1.rules.email(),
                        Validator_1.rules.unique({ column: 'email', table: 'users' }),
                    ]),
                    nome: Validator_1.schema.string({ trim: true }),
                    cpf: Validator_1.schema.string({}, [Validator_1.rules.unique({ column: 'cpf', table: 'users' })]),
                    equipeId: Validator_1.schema.number([Validator_1.rules.exists({ column: 'id', table: 'equipes' })]),
                    perfil: Validator_1.schema.enum(['pastor', 'lider', 'membro']),
                }),
                messages: {
                    'email.required': 'O email precisa ser informado',
                    'email.email': 'O email precisa estar em um formato válido',
                    'email.unique': 'Este já está sendo usado',
                    'nome': 'O nome precisa ser informado',
                    'cpf.required': 'O CPF precisa ser informado',
                    'cpf.unique': 'O CPF já está em uso',
                    'equipeId': 'A equipe precisa ser informada',
                    'perfil.enum': 'O perfil precisa ser do tipo: lider ou membro',
                },
            })
                .then(async (data) => {
                await User_1.default.create({ ...data, password: data.cpf }).then(async (usuario) => {
                    await usuario.load('equipe');
                    await new Convite_1.default(usuario, usuario.equipe).send();
                    return response.status(200).send(usuario);
                });
            });
        }
        catch (error) {
            if (error.messages) {
                return response.status(500).send(error.messages);
            }
            else {
                return response.status(500).send(error.message);
            }
        }
    }
    async show({ params, response }) {
        try {
            const { id } = params;
            await User_1.default.findOrFail(id).then(async (user) => response.status(200).send(user));
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
    async update({ params, request, response }) {
        try {
            await request
                .validate({
                schema: Validator_1.schema.create({
                    email: Validator_1.schema.string.optional({ trim: true }, [
                        Validator_1.rules.email(),
                        Validator_1.rules.unique({ column: 'email', table: 'users' }),
                    ]),
                    nome: Validator_1.schema.string.optional({ trim: true }),
                    cpf: Validator_1.schema.string.optional({}, [Validator_1.rules.unique({ column: 'cpf', table: 'users' })]),
                    password: Validator_1.schema.string.optional(),
                    avatar: Validator_1.schema.file.optional({ extnames: ['jpg', 'gif', 'png'], size: '2mb' }),
                    equipeId: Validator_1.schema.number.optional([Validator_1.rules.exists({ column: 'id', table: 'equipes' })]),
                    perfil: Validator_1.schema.enum.optional(['pastor', 'lider', 'membro']),
                }),
                messages: {
                    'email.email': 'O email precisa estar em um formato válido',
                    'email.unique': 'O email já está em uso',
                    'nome': 'O nome precisa ser informado',
                    'cpf.unique': 'O CPF já está em uso',
                    'avatar.extnames': 'A imagem precisa ser .jpg ou .png',
                    'avatar.size': 'A imagem pode ter no maximo 10mb',
                    'equipeId': 'A equipe precisa ser informada',
                    'perfil.enum': 'O perfil precisa ser do tipo: lider ou membro',
                },
            })
                .then(async (data) => {
                const { id } = params;
                await User_1.default.findOrFail(id).then(async (user) => {
                    let avatar = user.avatar;
                    if (data.avatar && data.avatar.type && data.avatar.tmpPath) {
                        await S3_1.default.upload(fs_1.default.createReadStream(data.avatar.tmpPath), `${Helpers_1.cuid()}.${data.avatar.extname}`, data.avatar.type, 'user', 'public-read').then((url) => {
                            avatar = url;
                        });
                    }
                    user.merge({ ...data, avatar });
                    await user.save();
                    await user.load('equipe');
                    return response.status(200).send(user);
                });
            });
        }
        catch (error) {
            if (error.messages) {
                return response.status(500).send(error.messages);
            }
            else {
                return response.status(500).send(error.message);
            }
        }
    }
    async destroy({ params, response }) {
        try {
            const { id } = params;
            await User_1.default.findOrFail(id).then(async (user) => {
                await user.delete();
                return response.status(200);
            });
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
    async upload({ request, response }) {
        try {
            await request
                .validate({
                schema: Validator_1.schema.create({
                    file: Validator_1.schema.file(),
                    pasta: Validator_1.schema.string(),
                }),
            })
                .then(async ({ file, pasta }) => {
                let link = '';
                if (file && file.type && file.tmpPath) {
                    await S3_1.default.upload(fs_1.default.createReadStream(file.tmpPath), `${Helpers_1.cuid()}.${file.extname}`, file.type, pasta, 'public-read').then((url) => {
                        link = url;
                    });
                    return response.status(200).send({ url: link });
                }
            });
        }
        catch (error) {
            console.log(error);
            if (error.messages) {
                return response.status(500).send(error.messages);
            }
            else {
                return response.status(500).send(error.message);
            }
        }
    }
}
exports.default = UsuariosController;
//# sourceMappingURL=UsuariosController.js.map