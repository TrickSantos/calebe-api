"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Equipes extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'equipes';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('igreja_id').unsigned().references('igrejas.id');
            table.string('nome').unique();
            table.string('instagram').unique();
            table.string('avatar');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Equipes;
//# sourceMappingURL=1626057251099_equipes.js.map