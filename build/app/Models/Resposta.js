"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const Desafio_1 = __importDefault(require("./Desafio"));
const Equipe_1 = __importDefault(require("./Equipe"));
class Resposta extends Orm_1.BaseModel {
}
__decorate([
    Orm_1.column({ isPrimary: true }),
    __metadata("design:type", Number)
], Resposta.prototype, "id", void 0);
__decorate([
    Orm_1.column({ serializeAs: 'desafioId' }),
    __metadata("design:type", Number)
], Resposta.prototype, "desafioId", void 0);
__decorate([
    Orm_1.column({ serializeAs: 'equipeId' }),
    __metadata("design:type", Number)
], Resposta.prototype, "equipeId", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Number)
], Resposta.prototype, "pontos", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Array)
], Resposta.prototype, "respostas", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Boolean)
], Resposta.prototype, "aprovado", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Resposta.prototype, "aprovado_em", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Resposta.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Resposta.prototype, "updatedAt", void 0);
__decorate([
    Orm_1.belongsTo(() => Desafio_1.default),
    __metadata("design:type", Object)
], Resposta.prototype, "desafio", void 0);
__decorate([
    Orm_1.belongsTo(() => Equipe_1.default),
    __metadata("design:type", Object)
], Resposta.prototype, "equipe", void 0);
exports.default = Resposta;
//# sourceMappingURL=Resposta.js.map