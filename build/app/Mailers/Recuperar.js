"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mail_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/Mail");
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const View_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/View"));
const mjml_1 = __importDefault(require("mjml"));
class Recuperar extends Mail_1.BaseMailer {
    constructor(usuario, token) {
        super();
        this.usuario = usuario;
        this.token = token;
    }
    async prepare(message) {
        const html = mjml_1.default(await View_1.default.render('emails/recuperar', {
            nome: this.usuario.nome,
            url: `${Env_1.default.get('FRONTEND_URL')}/recuperar/${this.token}/${this.usuario.id}`,
        })).html;
        message
            .from('naoresponda@calebealm.com')
            .to(this.usuario.email)
            .subject(`Missão Calebe - Recuperação de senha`)
            .html(html);
    }
}
exports.default = Recuperar;
//# sourceMappingURL=Recuperar.js.map