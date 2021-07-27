"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Igreja_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Igreja"));
class IgrejasController {
    async index({ response }) {
        try {
            await Igreja_1.default.all().then((igrejas) => response.status(200).send(igrejas));
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
}
exports.default = IgrejasController;
//# sourceMappingURL=IgrejasController.js.map