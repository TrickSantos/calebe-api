"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mail_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/Mail");
const View_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/View"));
const mjml_1 = __importDefault(require("mjml"));
class Convite extends Mail_1.BaseMailer {
    constructor(user, equipe) {
        super();
        this.user = user;
        this.equipe = equipe;
    }
    async prepare(message) {
        const html = mjml_1.default(await View_1.default.render('emails/convite', { equipe: this.equipe.nome, nome: this.user.nome })).html;
        message
            .from('naoresponda@calebealm.com')
            .to(this.user.email)
            .subject(`Missão Calebe - Equipe ${this.equipe.nome}`)
            .html(html);
    }
}
exports.default = Convite;
//# sourceMappingURL=Convite.js.map