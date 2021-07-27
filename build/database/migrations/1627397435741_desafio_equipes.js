"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Respostas extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'respostas';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('desafio_id').unsigned().references('desafios.id').onDelete('cascade');
            table.integer('equipe_id').unsigned().references('equipes.id').onDelete('cascade');
            table.integer('pontos');
            table.json('respostas').notNullable();
            table.boolean('aprovado').defaultTo(false);
            table.dateTime('aprovado_em');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Respostas;
//# sourceMappingURL=1627397435741_desafio_equipes.js.map