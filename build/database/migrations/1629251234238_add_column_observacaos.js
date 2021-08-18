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
        this.schema.table(this.tableName, (table) => {
            table.text('observacao');
        });
    }
    async down() {
        this.schema.table(this.tableName, (table) => {
            table.dropColumn('observacao');
        });
    }
}
exports.default = Respostas;
//# sourceMappingURL=1629251234238_add_column_observacaos.js.map