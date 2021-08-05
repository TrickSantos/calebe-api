"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Aviso_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Mailers/Aviso"));
const Equipe_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Equipe"));
const S3_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/S3"));
const fs_1 = __importDefault(require("fs"));
class EquipesController {
    async index({ response, request }) {
        const { ranking } = request.all();
        try {
            await Equipe_1.default.query()
                .where((builder) => {
                if (ranking) {
                    builder.whereNot({ id: 2 });
                }
            })
                .preload('membros')
                .preload('igreja')
                .withAggregate('respostas', (query) => {
                query.sum('pontos').as('pontuacao');
            })
                .orderBy('pontuacao', 'desc')
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
                        nome: Validator_1.schema.string({ trim: true }, [
                            Validator_1.rules.unique({
                                column: 'nome',
                                table: 'equipes',
                            }),
                        ]),
                        igrejaId: Validator_1.schema.number([Validator_1.rules.exists({ column: 'id', table: 'igrejas' })]),
                        instagram: Validator_1.schema.string({ trim: true }),
                        avatar: Validator_1.schema.file.optional({ extnames: ['jpg', 'png'], size: '10mb' }),
                    }),
                    lider: Validator_1.schema.object().members({
                        email: Validator_1.schema.string({ trim: true }, [
                            Validator_1.rules.email(),
                            Validator_1.rules.unique({ column: 'email', table: 'users' }),
                        ]),
                        avatar: Validator_1.schema.file.optional({ extnames: ['jpg', 'png'], size: '10mb' }),
                        password: Validator_1.schema.string({ trim: true }),
                        nome: Validator_1.schema.string({ trim: true }),
                        cpf: Validator_1.schema.string({}, [
                            Validator_1.rules.maxLength(11),
                            Validator_1.rules.minLength(11),
                            Validator_1.rules.unique({ column: 'cpf', table: 'users' }),
                        ]),
                    }),
                }),
                messages: {
                    'equipe.nome': 'O nome da equipe precisa ser informado',
                    'equipe.nome.unique': 'Este nome já está em uso, verifique se não está tentando cadastrar 2 vezes',
                    'equipe.igrejaId': 'A igreja precisa ser informada',
                    'equipe.instagram': 'O @ da equipe precisa ser informada',
                    'equipe.avatar.extnames': 'A imagem precisa ser .jpg ou .png',
                    'equipe.avatar.size': 'A imagem pode ter no maximo 10mb',
                    'lider.nome': 'O nome da equipe precisa ser informado',
                    'lider.cpf.required': 'O CPF precisa ser informado',
                    'lider.cpf.unique': 'O CPF Já está em uso',
                    'lider.cpf.maxLength': 'CPF invalido',
                    'lider.cpf.minLength': 'CPF invalido',
                    'lider.email.required': 'O email do lider precisa ser informado',
                    'lider.email.email': 'O email do lider precisa ser valido',
                    'lider.email.unique': 'O email do lider já está em uso',
                    'lider.avatar.extnames': 'A imagem precisa ser .jpg ou .png',
                    'lider.avatar.size': 'A imagem pode ter no maximo 10mb',
                    'lider.password.required': 'A senha precisa ser informada',
                },
            })
                .then(async (data) => {
                await Database_1.default.transaction(async (trx) => {
                    const equipe = new Equipe_1.default();
                    equipe.merge({ ...data.equipe, avatar: '' });
                    equipe.useTransaction(trx);
                    await equipe.save();
                    await equipe
                        .related('membros')
                        .create({ ...data.lider, perfil: 'lider', avatar: '' })
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
                await equipe.load('fotos', (query) => {
                    query.preload('usuario', (query) => query.preload('equipe'));
                    query.preload('likes');
                });
                await equipe.load('membros');
                return response.send(equipe);
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
                    nome: Validator_1.schema.string.optional({ trim: true }),
                    igrejaId: Validator_1.schema.number.optional([Validator_1.rules.exists({ column: 'id', table: 'igrejas' })]),
                    instagram: Validator_1.schema.string.optional({ trim: true }),
                    avatar: Validator_1.schema.file.optional({ extnames: ['jpg', 'png'], size: '10mb' }),
                }),
                messages: {
                    'nome': 'O nome da equipe precisa ser informado',
                    'igrejaId': 'A igreja precisa ser informada',
                    'instagram': 'O @ da equipe precisa ser informada',
                    'avatar.extnames': 'A imagem precisa ser .jpg ou .png',
                    'avatar.size': 'A imagem pode ter no maximo 10mb',
                },
            })
                .then(async (data) => {
                const { id } = params;
                await Equipe_1.default.findOrFail(id).then(async (equipe) => {
                    let avatar = equipe.avatar;
                    if (data.avatar && data.avatar.type && data.avatar.tmpPath) {
                        await S3_1.default.upload(fs_1.default.createReadStream(data.avatar.tmpPath), `${Helpers_1.cuid()}.${data.avatar.extname}`, data.avatar.type, 'equipe', 'public-read').then((url) => {
                            avatar = url;
                        });
                    }
                    equipe.merge({ ...data, avatar });
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