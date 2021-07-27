"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Likes extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'likes';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('devocional_id').unsigned().references('devocionais.id').onDelete('cascade');
            table.integer('user_id').unsigned().references('users.id').onDelete('cascade');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Likes;
//# sourceMappingURL=1627317973667_likes.js.map