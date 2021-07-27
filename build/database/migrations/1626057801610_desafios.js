"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Desafios extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'desafios';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('titulo');
            table.integer('pontos');
            table.string('cover');
            table.string('video');
            table.text('conteudo');
            table.dateTime('liberacao');
            table.dateTime('encerramento');
            table.boolean('status').defaultTo(false);
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Desafios;
//# sourceMappingURL=1626057801610_desafios.js.map