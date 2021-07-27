"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const Equipe_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Equipe"));
class AdministracaoSeeder extends Seeder_1.default {
    async run() {
        await Equipe_1.default.create({
            nome: 'Administracao - ALM',
            avatar: '',
            igrejaId: 7,
            instagram: 'jovensadventistaslestemt',
        }).then(async (equipe) => {
            await equipe.related('membros').create({
                cpf: '04786299154',
                nome: 'Patrick Adan',
                avatar: '',
                email: 'patrick.tafa@gmail.com',
                password: 'secret',
                perfil: 'admin',
            });
        });
    }
}
exports.default = AdministracaoSeeder;
//# sourceMappingURL=Administracao.js.map