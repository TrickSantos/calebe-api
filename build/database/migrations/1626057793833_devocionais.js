"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Devocionais extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'devocionais';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('autor_id').unsigned().references('users.id');
            table.string('titulo');
            table.string('verso');
            table.string('cover');
            table.string('video');
            table.text('conteudo');
            table.dateTime('liberacao');
            table.boolean('status').defaultTo(false);
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Devocionais;
//# sourceMappingURL=1626057793833_devocionais.js.map