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
const User_1 = __importDefault(require("./User"));
const Igreja_1 = __importDefault(require("./Igreja"));
const Resposta_1 = __importDefault(require("./Resposta"));
const Foto_1 = __importDefault(require("./Foto"));
class Equipe extends Orm_1.BaseModel {
    constructor() {
        super(...arguments);
        this.serializeExtras = true;
    }
    get pontos() {
        let pontuacao = this.$extras.pontuacao;
        return pontuacao;
    }
    static pontuacao(equipes) {
        equipes.forEach((equipe) => {
            equipe.$extras.pontuacao = equipe.$extras.pontuacao ? equipe.$extras.pontuacao : 0;
        });
    }
    static withPontuacao(query) {
        query.withAggregate('respostas', (builder) => {
            builder.sum('pontos').as('pontuacao');
        });
    }
}
__decorate([
    Orm_1.column({ isPrimary: true }),
    __metadata("design:type", Number)
], Equipe.prototype, "id", void 0);
__decorate([
    Orm_1.column({ serializeAs: 'igrejaId' }),
    __metadata("design:type", Number)
], Equipe.prototype, "igrejaId", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Equipe.prototype, "nome", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Equipe.prototype, "instagram", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Equipe.prototype, "avatar", void 0);
__decorate([
    Orm_1.hasMany(() => User_1.default),
    __metadata("design:type", Object)
], Equipe.prototype, "membros", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Equipe.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Equipe.prototype, "updatedAt", void 0);
__decorate([
    Orm_1.belongsTo(() => Igreja_1.default),
    __metadata("design:type", Object)
], Equipe.prototype, "igreja", void 0);
__decorate([
    Orm_1.hasMany(() => Resposta_1.default),
    __metadata("design:type", Object)
], Equipe.prototype, "respostas", void 0);
__decorate([
    Orm_1.hasManyThrough([() => Foto_1.default, () => User_1.default]),
    __metadata("design:type", Object)
], Equipe.prototype, "fotos", void 0);
__decorate([
    Orm_1.computed(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Equipe.prototype, "pontos", null);
__decorate([
    Orm_1.afterFetch(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], Equipe, "pontuacao", null);
__decorate([
    Orm_1.beforeFind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Equipe, "withPontuacao", null);
exports.default = Equipe;
//# sourceMappingURL=Equipe.js.map