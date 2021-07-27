"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Distrito_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Distrito"));
class DistritosController {
    async index({ response }) {
        try {
            await Distrito_1.default.query()
                .preload('igrejas')
                .then((distritos) => response.status(200).send(distritos));
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
}
exports.default = DistritosController;
//# sourceMappingURL=DistritosController.js.map