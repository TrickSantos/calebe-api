"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Bull_1 = __importDefault(global[Symbol.for('ioc.use')]("Rocketseat/Bull"));
const Desafio_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Desafio"));
const LiberarDesafio_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Jobs/LiberarDesafio"));
const EncerrarDesafio_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Jobs/EncerrarDesafio"));
const luxon_1 = require("luxon");
class DesafiosController {
    async index({ response, request }) {
        try {
            const { equipeId } = request.all();
            await Desafio_1.default.query()
                .where((builder) => {
                if (equipeId) {
                    builder.where('status', '=', true);
                    builder.whereDoesntHave('respostas', (query) => {
                        query.where({ equipeId });
                    });
                }
            })
                .then((desafios) => response.status(200).send(desafios));
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
    async store({ request, response }) {
        try {
            await request
                .validate({
                schema: Validator_1.schema.create({
                    titulo: Validator_1.schema.string({ trim: true }),
                    pontos: Validator_1.schema.number(),
                    cover: Validator_1.schema.string.optional(),
                    video: Validator_1.schema.string.optional(),
                    conteudo: Validator_1.schema.string({ trim: true }),
                    liberacao: Validator_1.schema.date(),
                    encerramento: Validator_1.schema.date(),
                }),
                messages: {
                    'titulo.required': 'titulo precisa ser informado',
                    'pontos.required': 'pontos precisa ser informado',
                    'conteudo.required': 'conteudo precisa ser informado',
                    'liberacao.required': 'liberacao precisa ser informado',
                    'encerramento.required': 'encerramento precisa ser informado',
                },
            })
                .then(async (data) => {
                await Desafio_1.default.create(data).then((desafio) => {
                    if (desafio.liberacao > luxon_1.DateTime.utc()) {
                        Bull_1.default.schedule(new LiberarDesafio_1.default().key, desafio, desafio.liberacao.toJSDate());
                    }
                    else {
                        Bull_1.default.add(new LiberarDesafio_1.default().key, desafio);
                    }
                    Bull_1.default.schedule(new EncerrarDesafio_1.default().key, desafio, desafio.encerramento.startOf('day').toJSDate());
                    return response.send(desafio);
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
            await Desafio_1.default.findOrFail(id).then((desafio) => response.send(desafio));
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
    async update({ params, response, request }) {
        try {
            await request
                .validate({
                schema: Validator_1.schema.create({
                    titulo: Validator_1.schema.string.optional({ trim: true }),
                    pontos: Validator_1.schema.number.optional(),
                    cover: Validator_1.schema.string.optional(),
                    video: Validator_1.schema.string.optional(),
                    conteudo: Validator_1.schema.string.optional({ trim: true }),
                    liberacao: Validator_1.schema.date.optional(),
                    encerramento: Validator_1.schema.date.optional(),
                }),
                messages: {
                    'titulo.required': 'titulo precisa ser informado',
                    'pontos.required': 'pontos precisa ser informado',
                    'conteudo.required': 'conteudo precisa ser informado',
                    'liberacao.required': 'liberacao precisa ser informado',
                    'encerramento.required': 'encerramento precisa ser informado',
                },
            })
                .then(async (data) => {
                const { id } = params;
                await Desafio_1.default.findOrFail(id).then(async (desafio) => {
                    desafio.merge(data);
                    await desafio.save();
                    if (data.liberacao) {
                        Bull_1.default.schedule(new LiberarDesafio_1.default().key, desafio, desafio.liberacao.startOf('day').toJSDate());
                    }
                    if (data.encerramento) {
                        Bull_1.default.schedule(new EncerrarDesafio_1.default().key, desafio, desafio.encerramento.startOf('day').toJSDate());
                    }
                    return response.send(desafio);
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
            await Desafio_1.default.findOrFail(id).then(async (desafio) => {
                await desafio.delete();
                return response.status(200);
            });
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
}
exports.default = DesafiosController;
//# sourceMappingURL=DesafiosController.js.map