"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Desafio_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Desafio"));
class LiberarDesafio {
    constructor() {
        this.key = 'LiberarDesafio';
    }
    async handle(job) {
        const { data } = job;
        await Desafio_1.default.findOrFail(data.id)
            .then(async (desafio) => {
            desafio.merge({ status: true });
            await desafio.save();
        })
            .catch((e) => console.log(e));
        return data;
    }
}
exports.default = LiberarDesafio;
//# sourceMappingURL=LiberarDesafio.js.map