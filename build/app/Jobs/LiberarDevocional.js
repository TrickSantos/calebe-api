"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Devocional_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Devocional"));
class LiberarDevocional {
    constructor() {
        this.key = 'LiberarDevocional';
    }
    async handle(job) {
        const { data } = job;
        await Devocional_1.default.findOrFail(data.id)
            .then(async (devocional) => {
            devocional.merge({ status: true });
            await devocional.save();
        })
            .catch((e) => console.log(e));
        return data;
    }
}
exports.default = LiberarDevocional;
//# sourceMappingURL=LiberarDevocional.js.map