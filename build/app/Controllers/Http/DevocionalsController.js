"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Devocional_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Devocional"));
const Comentario_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Comentario"));
const Bull_1 = __importDefault(global[Symbol.for('ioc.use')]("Rocketseat/Bull"));
const LiberarDevocional_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Jobs/LiberarDevocional"));
const luxon_1 = require("luxon");
class DevocionalsController {
    async index({ response, request }) {
        try {
            const { status } = request.all();
            const page = request.input('page');
            if (status) {
                await Devocional_1.default.query()
                    .where({ status })
                    .preload('autor')
                    .preload('comentarios', (query) => query.preload('usuario'))
                    .preload('likes')
                    .orderBy('liberacao', 'desc')
                    .paginate(page, 4)
                    .then((devocionais) => {
                    devocionais.namingStrategy = {
                        paginationMetaKeys() {
                            return {
                                total: 'total',
                                perPage: 'perPage',
                                currentPage: 'currentPage',
                                lastPage: 'lastPage',
                                firstPage: 'firstPage',
                                firstPageUrl: 'firstPageUrl',
                                lastPageUrl: 'lastPageUrl',
                                nextPageUrl: 'nextPageUrl',
                                previousPageUrl: 'previousPageUrl',
                            };
                        },
                    };
                    return response.status(200).send(devocionais);
                });
            }
            else {
                await Devocional_1.default.query()
                    .preload('autor')
                    .preload('comentarios')
                    .preload('likes')
                    .orderBy('id', 'desc')
                    .then((devocionais) => response.status(200).send(devocionais));
            }
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
    async store({ request, response, auth }) {
        try {
            await request
                .validate({
                schema: Validator_1.schema.create({
                    titulo: Validator_1.schema.string({ trim: true }),
                    verso: Validator_1.schema.string.optional({ trim: true }),
                    cover: Validator_1.schema.string.optional(),
                    video: Validator_1.schema.string.optional(),
                    conteudo: Validator_1.schema.string.optional({ trim: true }),
                    liberacao: Validator_1.schema.date(),
                }),
                messages: {
                    'titulo.required': 'O titulo precisa ser informado',
                    'liberacao.required': 'A liberação precisa ser informada',
                },
            })
                .then(async (data) => {
                await Devocional_1.default.create({ ...data, autorId: auth.user?.id }).then((devocional) => {
                    if (devocional.liberacao > luxon_1.DateTime.utc()) {
                        Bull_1.default.schedule(new LiberarDevocional_1.default().key, devocional, devocional.liberacao.toJSDate());
                    }
                    else {
                        Bull_1.default.add(new LiberarDevocional_1.default().key, devocional);
                    }
                    return response.status(200).send(devocional);
                });
            });
        }
        catch (error) {
            if (error.messages) {
                return response.status(500).send(error.messages);
            }
            else {
                console.log(error);
                return response.status(500).send(error.message);
            }
        }
    }
    async update({ request, response, params, auth }) {
        try {
            await request
                .validate({
                schema: Validator_1.schema.create({
                    titulo: Validator_1.schema.string.optional({ trim: true }),
                    verso: Validator_1.schema.string.optional({ trim: true }),
                    cover: Validator_1.schema.string.optional(),
                    video: Validator_1.schema.string.optional(),
                    conteudo: Validator_1.schema.string.optional({ trim: true }),
                    liberacao: Validator_1.schema.date.optional(),
                }),
                messages: {
                    'cover.extnames': 'A imagem precisa ser .jpg ou .png',
                    'cover.size': 'A imagem pode ter no maximo 10mb',
                },
            })
                .then(async (data) => {
                const { id } = params;
                await Devocional_1.default.findOrFail(id).then(async (devocional) => {
                    devocional.merge({ ...data, autorId: auth.user?.id });
                    await devocional.save();
                    if (data.liberacao) {
                        if (devocional.liberacao > luxon_1.DateTime.utc()) {
                            Bull_1.default.schedule(new LiberarDevocional_1.default().key, devocional, devocional.liberacao.toJSDate());
                        }
                        else {
                            Bull_1.default.add(new LiberarDevocional_1.default().key, devocional);
                        }
                    }
                    return response.status(200).send(devocional);
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
            await Devocional_1.default.findOrFail(id).then(async (devocional) => {
                await devocional.delete();
                return response.status(200);
            });
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
    async comentar({ params, response, request, auth }) {
        try {
            const { comentario } = request.all();
            const { id } = params;
            await Devocional_1.default.findOrFail(id).then(async (devocional) => {
                await devocional
                    .related('comentarios')
                    .create({
                    comentario,
                    userId: auth.user?.id,
                })
                    .then(async () => {
                    await devocional.load('comentarios', (query) => query.preload('usuario'));
                    await devocional.load('likes');
                    return response.status(200).send(devocional);
                });
            });
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
    async curtir({ params, response, auth }) {
        try {
            const { id } = params;
            await Devocional_1.default.findOrFail(id).then(async (devocional) => {
                await devocional
                    .related('likes')
                    .create({
                    userId: auth.user?.id,
                })
                    .then(async () => {
                    await devocional.load('likes');
                    await devocional.load('comentarios');
                    return response.status(200).send(devocional);
                });
            });
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
    async removerComentario({ params, response }) {
        try {
            const { id } = params;
            await Comentario_1.default.findOrFail(id).then(async (comentario) => {
                await comentario.delete();
                return response.status(200);
            });
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
    async removerCurtida({ params, response, auth }) {
        try {
            const { id } = params;
            await Devocional_1.default.findOrFail(id).then(async (devocional) => {
                await devocional.load('likes');
                const like = devocional.likes.find((like) => like.userId === auth.user?.id);
                await like?.delete();
                await devocional.load('likes');
                await devocional.load('comentarios');
                return response.status(200).send(devocional);
            });
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
}
exports.default = DevocionalsController;
//# sourceMappingURL=DevocionalsController.js.map