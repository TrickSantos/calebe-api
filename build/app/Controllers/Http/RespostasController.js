"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Resposta_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Resposta"));
const Equipe_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Equipe"));
const luxon_1 = require("luxon");
class RespostasController {
    async index({ response, request }) {
        const { desafioId } = request.all();
        try {
            await Equipe_1.default.query()
                .whereHas('resposta', (builder) => builder.where({ desafioId }))
                .preload('resposta', (builder) => builder.where({ desafioId }))
                .then((equipes) => response.send(equipes));
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
                    desafioId: Validator_1.schema.number([
                        Validator_1.rules.exists({
                            column: 'id',
                            table: 'desafios',
                        }),
                    ]),
                    equipeId: Validator_1.schema.number([
                        Validator_1.rules.exists({
                            column: 'id',
                            table: 'equipes',
                        }),
                    ]),
                    respostas: Validator_1.schema.array().members(Validator_1.schema.object().members({
                        resposta: Validator_1.schema.string(),
                    })),
                }),
                messages: {
                    'desafioId.exists': 'Desafio não encontrado',
                    'desafioId.required': 'O desafio precisa ser informado',
                    'equipeId.exists': 'Equipe não encontrada',
                    'equipeId.required': 'A equipe precisa ser informada',
                    'respostas.required': 'As respostas precisam ser informadas',
                },
            })
                .then(async (data) => {
                await Resposta_1.default.create({ ...data, respostas: JSON.stringify(data.respostas) }).then((resposta) => response.send(resposta));
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
    async show({ response, params }) {
        try {
            const { id } = params;
            await Resposta_1.default.findOrFail(id).then((resposta) => response.send(resposta));
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
                    desafioId: Validator_1.schema.number.optional([
                        Validator_1.rules.exists({
                            column: 'id',
                            table: 'equipes',
                        }),
                    ]),
                    equipeId: Validator_1.schema.number.optional([
                        Validator_1.rules.exists({
                            column: 'id',
                            table: 'equipes',
                        }),
                    ]),
                    respostas: Validator_1.schema.array.optional().members(Validator_1.schema.object().members({
                        resposta: Validator_1.schema.string(),
                    })),
                    pontos: Validator_1.schema.number(),
                }),
                messages: {
                    'desafioId.exists': 'Desafio não encontrado',
                    'desafioId.required': 'O desafio precisa ser informado',
                    'equipeId.exists': 'Equipe não encontrada',
                    'equipeId.required': 'A equipe precisa ser informada',
                    'respostas.required': 'As respostas precisam ser informadas',
                    'pontos.required': 'Os pontos precisam ser informados',
                    'aprovado.required': 'A avaliação precisa ser informado',
                },
            })
                .then(async (data) => {
                const { id } = params;
                await Resposta_1.default.findOrFail(id).then(async (resposta) => {
                    resposta.merge({ ...data, aprovado: true, aprovadoEm: luxon_1.DateTime.utc() });
                    await resposta.save();
                    return response.send(resposta);
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
            await Resposta_1.default.findOrFail(id).then(async (resposta) => {
                await resposta.delete();
                return response.status(200);
            });
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
}
exports.default = RespostasController;
//# sourceMappingURL=RespostasController.js.map