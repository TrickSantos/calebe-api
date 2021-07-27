"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Desafio_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Desafio"));
class EncerrarDesafio {
    constructor() {
        this.key = 'EncerrarDesafio';
    }
    async handle(job) {
        const { data } = job;
        await Desafio_1.default.findOrFail(data.id)
            .then(async (desafio) => {
            desafio.merge({ status: false });
            await desafio.save();
        })
            .catch((e) => console.log(e));
        return data;
    }
}
exports.default = EncerrarDesafio;
//# sourceMappingURL=EncerrarDesafio.js.map