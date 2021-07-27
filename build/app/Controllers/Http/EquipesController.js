"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Equipe_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Equipe"));
const Aviso_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Mailers/Aviso"));
class EquipesController {
    async index({ response }) {
        try {
            await Equipe_1.default.query()
                .preload('membros')
                .preload('igreja')
                .then((equipes) => response.status(200).send(equipes));
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
                    equipe: Validator_1.schema.object().members({
                        nome: Validator_1.schema.string(),
                        igrejaId: Validator_1.schema.number([Validator_1.rules.exists({ column: 'id', table: 'igrejas' })]),
                        instagram: Validator_1.schema.string(),
                        avatar: Validator_1.schema.string.optional(),
                    }),
                    lider: Validator_1.schema.object().members({
                        email: Validator_1.schema.string({}, [Validator_1.rules.email()]),
                        avatar: Validator_1.schema.string.optional(),
                        password: Validator_1.schema.string(),
                        nome: Validator_1.schema.string(),
                        cpf: Validator_1.schema.string({}, [Validator_1.rules.maxLength(11), Validator_1.rules.minLength(11)]),
                    }),
                }),
                messages: {
                    'equipe.nome': 'O nome da equipe precisa ser informado',
                    'equipe.igrejaId': 'A igreja precisa ser informada',
                    'equipe.instagram': 'O @ da equipe precisa ser informada',
                    'lider.nome': 'O nome da equipe precisa ser informado',
                    'lider.cpf.required': 'O CPF precisa ser informado',
                    'lider.cpf.maxLength': 'CPF invalido',
                    'lider.cpf.minLength': 'CPF invalido',
                    'lider.email.required': 'O email do lider precisa ser informado',
                    'lider.email.email': 'O email do lider precisa ser valido',
                    'lider.password.required': 'A senha precisa ser informada',
                },
            })
                .then(async (data) => {
                await Database_1.default.transaction(async (trx) => {
                    const equipe = new Equipe_1.default();
                    equipe.merge(data.equipe);
                    equipe.useTransaction(trx);
                    await equipe.save();
                    await equipe
                        .related('membros')
                        .create({ ...data.lider, perfil: 'lider' })
                        .then(async (lider) => {
                        await trx.commit();
                        await new Aviso_1.default(lider, equipe).send();
                        return response.status(200).send(equipe);
                    })
                        .catch(async (e) => {
                        await trx.rollback();
                        throw new Error(e);
                    });
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
            await Equipe_1.default.findOrFail(id).then(async (equipe) => {
                await equipe.load('igreja', (query) => query.preload('distrito'));
                await equipe.load('membros');
                response.send(equipe);
            });
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
    async update({ request, params, response }) {
        try {
            await request
                .validate({
                schema: Validator_1.schema.create({
                    nome: Validator_1.schema.string.optional(),
                    igrejaId: Validator_1.schema.number.optional([Validator_1.rules.exists({ column: 'id', table: 'igrejas' })]),
                    instagram: Validator_1.schema.string.optional(),
                    avatar: Validator_1.schema.string.optional(),
                }),
                messages: {
                    nome: 'O nome da equipe precisa ser informado',
                    igrejaId: 'A igreja precisa ser informada',
                    instagram: 'O @ da equipe precisa ser informada',
                },
            })
                .then(async (data) => {
                const { id } = params;
                await Equipe_1.default.findOrFail(id).then(async (equipe) => {
                    equipe.merge(data);
                    await equipe.save();
                    return response.send(equipe);
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
    async destroy({ response, params }) {
        try {
            const { id } = params;
            await Equipe_1.default.findOrFail(id).then(async (equipe) => {
                await equipe.delete();
                return response.status(200);
            });
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
}
exports.default = EquipesController;
//# sourceMappingURL=EquipesController.js.map