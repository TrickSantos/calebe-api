"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const Distrito_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Distrito"));
class IgrejaSeeder extends Seeder_1.default {
    async run() {
        await Distrito_1.default.create({ nome: 'Água Boa' }).then(async (distrito) => {
            await distrito.related('igrejas').createMany([
                {
                    nome: 'Água Boa - Sede',
                },
                {
                    nome: 'Canarana',
                },
                {
                    nome: 'Cristalino',
                },
                {
                    nome: 'Gaúcha do Norte',
                },
                {
                    nome: 'Jardim União (Água Boa)',
                },
                {
                    nome: 'Vila Nova (Água Boa)',
                },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Associação Leste-Mato-Grossense' }).then(async (distrito) => {
            await distrito.related('igrejas').createMany([
                {
                    nome: 'Associação Leste Mato-grossense',
                },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Barra do Garças' }).then(async (distrito) => {
            await distrito.related('igrejas').createMany([
                {
                    nome: 'Aragarças',
                },
                {
                    nome: 'Araguaiana',
                },
                {
                    nome: 'Barra do Garças - Sede',
                },
                {
                    nome: 'Nova Barra',
                },
                {
                    nome: 'Pequena Vanessa 2',
                },
                {
                    nome: 'Pitaluga',
                },
                {
                    nome: 'Pontal do Araguaia',
                },
                {
                    nome: 'Torixoréu',
                },
                {
                    nome: 'Vila São José',
                },
                {
                    nome: 'Vila União',
                },
            ]);
        }),
            await Distrito_1.default.create({ nome: 'Bom Clima' }).then(async (distrito) => {
                await distrito.related('igrejas').createMany([
                    {
                        nome: 'Bom Clima - Sede',
                    },
                    {
                        nome: 'Dom Aquino (Bom Clima)',
                    },
                    {
                        nome: 'Jaciara',
                    },
                    {
                        nome: 'Santo Antônio da Fartura',
                    },
                    {
                        nome: 'São Pedro da Cipa',
                    },
                    {
                        nome: 'Vila Santo Antônio (bom Clima)',
                    },
                ]);
            }),
            await Distrito_1.default.create({ nome: 'Bosque da Saúde' }).then(async (distrito) => {
                await distrito
                    .related('igrejas')
                    .createMany([
                    { nome: 'Bosque da Saúde - Sede' },
                    { nome: 'Altos da Boa Vista ' },
                    { nome: 'Comunidade Haitiana ' },
                    { nome: 'Coivara ' },
                    { nome: 'Renascer ' },
                    { nome: 'Novo Colorado' },
                    { nome: 'Ubirajara ' },
                    { nome: 'Ribeirão do Lipa' },
                ]);
            });
        await Distrito_1.default.create({ nome: 'Campo Verde' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Assentamento Dom Osório Stofel ' },
                { nome: 'Campo Verde - Sede' },
                { nome: 'Nova Brasilândia ' },
                { nome: 'Planalto da Serra ' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Central Cuiabá' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([{ nome: 'Cuiabá Central - Sede' }, { nome: 'Santa Helena' }]);
        });
        await Distrito_1.default.create({ nome: 'Cidade Verde' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Cidade Verde - Sede' },
                { nome: 'Guia ' },
                { nome: 'José Pinto' },
                { nome: 'Santa Izabel' },
                { nome: 'Sucuri' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Confresa' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Canabrava do Norte ' },
                { nome: 'Confresa - Sede' },
                { nome: 'Porto Alegre do Norte' },
                { nome: 'Santa Cruz do Xingu ' },
                { nome: 'Santo Antônio do Fontoura ' },
                { nome: 'São José do Xingu ' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Cpa 2' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Acorizal' },
                { nome: 'Baús ' },
                { nome: 'Bela Vista' },
                { nome: 'Campo Limpo' },
                { nome: 'Cpa 2 - Sede' },
                { nome: 'Morada da Serra' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Cpa 3 ' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: '1° de Março' },
                { nome: 'Altos da Glória ' },
                { nome: 'Alvorada ' },
                { nome: 'Chapada dos Guimarães ' },
                { nome: 'Cpa 3 - Sede' },
                { nome: 'Jardim Vitória' },
                { nome: 'João Carro ' },
                { nome: 'Novo Paraíso' },
                { nome: 'São Sebastião' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Cpa 4 ' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Altos da Serra' },
                { nome: 'Cpa 4 - Sede' },
                { nome: 'Dr. Fábio Leite I' },
                { nome: 'Dr. Fábio Leite II ' },
                { nome: 'Planalto' },
                { nome: 'Sol Nascente ' },
                { nome: 'Três Barras' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Jardim Iguaçu ' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Grande Conquista ' },
                { nome: 'Itiquira ' },
                { nome: 'Jardim Atlântico' },
                { nome: 'Jardim Iguaçu - Sede' },
                { nome: 'Jardim Taiti' },
                { nome: 'Ouro Branco ' },
                { nome: 'Parque das Rosas ' },
                { nome: 'Vila Esperança' },
                { nome: 'Vila Operária (Jardim Iguaçu)' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Lucas do Rio Verde ' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Bandeirantes' },
                { nome: 'Itanhangá ' },
                { nome: 'Lucas do Rio Verde - Sede' },
                { nome: 'Nova Maringá' },
                { nome: 'Parque das Américas ' },
                { nome: 'Tapurah ' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Monte Líbano ' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Conjunto São José' },
                { nome: 'Irenópolis (Monte Líbano) ' },
                { nome: 'Juscimeira' },
                { nome: 'Monte Líbano - Sede' },
                { nome: 'Parque Universitário ' },
                { nome: 'Vila Olinda' },
                { nome: 'Vila Rica (monte Líbano) ' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Morada do Ouro ( Cuiabá ) ' }).then(async (distrito) => {
            await distrito.related('igrejas').createMany([{ nome: 'Morada do Ouro - Sede' }]);
        });
        await Distrito_1.default.create({ nome: 'Nobres ' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Agrovila Bojui ' },
                { nome: 'Alto Paraguai ' },
                { nome: 'Coqueiral - Roda D´Água ' },
                { nome: 'Diamantino' },
                { nome: 'Jangada' },
                { nome: 'Jardim Petrópolis ' },
                { nome: 'Nobres - Sede' },
                { nome: 'Novo Diamantino ' },
                { nome: 'Rosário Oeste ' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Nova Mutum ' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Alto da Colina' },
                { nome: 'Nova Mutum - Sede' },
                { nome: 'Nova Vida' },
                { nome: 'Ranchão ' },
                { nome: 'Santa Rita do Trivelato ' },
                { nome: 'São José do Rio Claro' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Nova Xavantina ' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Assentamento Santo Idelfonso ' },
                { nome: 'Cocalinho ' },
                { nome: 'Nova Brasília' },
                { nome: 'Nova Nazaré ' },
                { nome: 'Nova Xavantina - Sede' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Parque Cuiaba ' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Altos do Parque I ' },
                { nome: 'Barão de Melgaço ' },
                { nome: 'Parque Cuiabá - Sede' },
                { nome: 'Peixinho ' },
                { nome: 'Real Park' },
                { nome: 'Santo Antônio do Leverger ' },
                { nome: 'São Gonçalo' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Pedra 90 ' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Agrovila das Palmeiras ' },
                { nome: 'Cinturão Verde ' },
                { nome: 'Pedra 90 - 2ª Etapa' },
                { nome: 'Pedra 90 - Sede' },
                { nome: 'Serrana ' },
                { nome: 'Vistas da Chapada' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Pedra Preta ' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Alto Araguaia ' },
                { nome: 'Alto Garças ' },
                { nome: 'Alto Taquari ' },
                { nome: 'Parque Independente ' },
                { nome: 'Pedra Preta - Sede' },
                { nome: 'Verde Teto' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Porto ' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Dom Aquino (porto)' },
                { nome: 'Duque de Caxias ' },
                { nome: 'Jardim Paulista' },
                { nome: 'Porto - Sede' },
                { nome: 'Praeirinho ' },
                { nome: 'São Mateus (porto)' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Primavera do Leste ' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Paranatinga ' },
                { nome: 'Poncho Verde' },
                { nome: 'Poxoréu ' },
                { nome: 'Primavera do Leste - Sede' },
                { nome: 'Primavera III (primavera do Leste)' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Querência ' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Boa Vista (Querência) ' },
                { nome: 'Bom Jesus do Araguaia ' },
                { nome: 'Querência - Sede' },
                { nome: 'Ribeirão Cascalheira' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Residencial Coxipó ' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Jardim Passaredo' },
                { nome: 'Nova Esperança III ' },
                { nome: 'Parque Nova Esperança' },
                { nome: 'Pascoal Ramos' },
                { nome: 'Residencial Coxipó - Sede' },
                { nome: 'Santa Terezinha ' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Rondonópolis ' }).then(async (distrito) => {
            await distrito.related('igrejas').createMany([{ nome: 'Rondonópolis - Sede' }]);
        });
        await Distrito_1.default.create({ nome: 'Sorriso' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Entre Rios ' },
                { nome: 'Ipiranga do Norte ' },
                { nome: 'Jardim Novos Campos' },
                { nome: 'Nova Aliança ' },
                { nome: 'Nova Ubiratã ' },
                { nome: 'Primavera (Sorriso)' },
                { nome: 'Sorriso - Sede' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Tijucal ' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Jardim Fortaleza' },
                { nome: 'Jardim Imperial' },
                { nome: 'Jardim Liberdade' },
                { nome: 'Osmar Cabral' },
                { nome: 'Tijucal - Sede' },
            ]);
        });
        await Distrito_1.default.create({ nome: 'Vila 2000' }).then(async (distrito) => {
            await distrito
                .related('igrejas')
                .createMany([
                { nome: 'Gleba Independente' },
                { nome: 'Santa Terezinha (vila 2000) ' },
                { nome: 'Vila 2000 - Sede' },
                { nome: 'Vila Nova (vila 2000)' },
                { nome: 'Vila Rica (vila 2000)' },
            ]);
        });
    }
}
exports.default = IgrejaSeeder;
//# sourceMappingURL=Igreja.js.map