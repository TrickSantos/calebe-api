"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bull_1 = __importDefault(global[Symbol.for('ioc.use')]("Rocketseat/Bull"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const PORT = 9999;
const isDevelopment = Env_1.default.get('NODE_ENV') === 'development';
Bull_1.default.process();
if (isDevelopment) {
    Bull_1.default.ui(PORT);
}
//# sourceMappingURL=bull.js.map