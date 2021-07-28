"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
exports.default = Env_1.default.rules({
    HOST: Env_1.default.schema.string({ format: 'host' }),
    PORT: Env_1.default.schema.number(),
    APP_KEY: Env_1.default.schema.string(),
    APP_NAME: Env_1.default.schema.string(),
    NODE_ENV: Env_1.default.schema.enum(['development', 'production', 'testing']),
    PG_HOST: Env_1.default.schema.string({ format: 'host' }),
    PG_PORT: Env_1.default.schema.number(),
    PG_USER: Env_1.default.schema.string(),
    PG_PASSWORD: Env_1.default.schema.string.optional(),
    PG_DB_NAME: Env_1.default.schema.string(),
    SMTP_HOST: Env_1.default.schema.string({ format: 'host' }),
    SMTP_PORT: Env_1.default.schema.number(),
    SMTP_USERNAME: Env_1.default.schema.string(),
    SMTP_PASSWORD: Env_1.default.schema.string(),
    STORAGE_ENDPOINT: Env_1.default.schema.string(),
    STORAGE_ACCESS_KEY_ID: Env_1.default.schema.string(),
    STORAGE_ACCESS_SECRET_KEY: Env_1.default.schema.string(),
    STORAGE_BUCKET: Env_1.default.schema.string(),
    FRONTEND_URL: Env_1.default.schema.string(),
    MOBILE_URL: Env_1.default.schema.string(),
    BULL_REDIS_HOST: Env_1.default.schema.string({ format: 'host' }),
    BULL_REDIS_PORT: Env_1.default.schema.number(),
    BULL_REDIS_PASSWORD: Env_1.default.schema.string.optional(),
});
//# sourceMappingURL=env.js.map