"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mail_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/Mail");
const View_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/View"));
const mjml_1 = __importDefault(require("mjml"));
class Aviso extends Mail_1.BaseMailer {
    constructor(lider, equipe) {
        super();
        this.lider = lider;
        this.equipe = equipe;
    }
    async prepare(message) {
        const html = mjml_1.default(await View_1.default.render('emails/aviso', { equipe: this.equipe.nome, nome: this.lider.nome })).html;
        message
            .from('naoresponda@calebealm.com')
            .to(this.lider.email)
            .subject(`Missão Calebe - Equipe ${this.equipe.nome}`)
            .html(html);
    }
}
exports.default = Aviso;
//# sourceMappingURL=Aviso.js.map