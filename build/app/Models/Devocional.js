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
const Like_1 = __importDefault(require("./Like"));
const Comentario_1 = __importDefault(require("./Comentario"));
class Devocional extends Orm_1.BaseModel {
    constructor() {
        super(...arguments);
        this.serializeExtras = true;
    }
    serializeExtra() {
        return {
            totalLikes: this.$extras.likes_count,
            totalComentarios: this.$extras.comentarios_count,
        };
    }
}
Devocional.table = 'devocionais';
__decorate([
    Orm_1.column({ isPrimary: true }),
    __metadata("design:type", Number)
], Devocional.prototype, "id", void 0);
__decorate([
    Orm_1.column({ columnName: 'autor_id', serializeAs: 'autorId' }),
    __metadata("design:type", Number)
], Devocional.prototype, "autorId", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Devocional.prototype, "titulo", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Devocional.prototype, "verso", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Devocional.prototype, "cover", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Devocional.prototype, "video", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", String)
], Devocional.prototype, "conteudo", void 0);
__decorate([
    Orm_1.column.date(),
    __metadata("design:type", luxon_1.DateTime)
], Devocional.prototype, "liberacao", void 0);
__decorate([
    Orm_1.column(),
    __metadata("design:type", Boolean)
], Devocional.prototype, "status", void 0);
__decorate([
    Orm_1.belongsTo(() => User_1.default, {
        foreignKey: 'autorId',
    }),
    __metadata("design:type", Object)
], Devocional.prototype, "autor", void 0);
__decorate([
    Orm_1.hasMany(() => Like_1.default),
    __metadata("design:type", Object)
], Devocional.prototype, "likes", void 0);
__decorate([
    Orm_1.hasMany(() => Comentario_1.default),
    __metadata("design:type", Object)
], Devocional.prototype, "comentarios", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Devocional.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Devocional.prototype, "updatedAt", void 0);
exports.default = Devocional;
//# sourceMappingURL=Devocional.js.map