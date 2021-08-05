"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Foto_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Foto"));
class FotosController {
    async index({ response, request }) {
        const page = request.input('page');
        try {
            await Foto_1.default.query()
                .preload('usuario', (query) => query.preload('equipe'))
                .preload('likes')
                .orderBy('createdAt', 'desc')
                .paginate(page, 8)
                .then((fotos) => {
                fotos.namingStrategy = {
                    paginationMetaKeys() {
                        return {
                            total: 'total',
                            perPage: 'perPage',
                            currentPage: 'currentPage',
                            lastPage: 'lastPage',
                            firstPage: 'firstPage',
                            firstPageUrl: 'firstPageUrl',
                            lastPageUrl: 'lastPageUrl',
                            nextPageUrl: 'nextPageUrl',
                            previousPageUrl: 'previousPageUrl',
                        };
                    },
                };
                return response.send(fotos);
            });
        }
        catch (error) {
            console.log(error.message);
            return response.status(500).send('Erro ao carregar mural, tente novamente');
        }
    }
    async store({ request, response, auth }) {
        try {
            const { foto } = request.all();
            const { user } = auth;
            await Foto_1.default.create({
                foto,
                userId: user?.id,
            }).then((foto) => response.send(foto));
        }
        catch (error) {
            console.log(error.message);
            return response.status(500).send('Erro ao enviar imagem, tente novamente');
        }
    }
    async destroy({ params, response }) {
        try {
            const { id } = params;
            await Foto_1.default.findOrFail(id).then(async (foto) => {
                await foto.delete();
                return response.status(200);
            });
        }
        catch (error) {
            return response.status(500).send('Erro ao apagar imagem, tente novamente');
        }
    }
    async curtir({ params, response, auth }) {
        try {
            const { id } = params;
            await Foto_1.default.findOrFail(id).then(async (foto) => {
                await foto
                    .related('likes')
                    .create({
                    userId: auth.user?.id,
                })
                    .then(async () => {
                    await foto.load('likes');
                    return response.status(200).send(foto);
                });
            });
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
    async removerCurtida({ params, response, auth }) {
        try {
            const { id } = params;
            await Foto_1.default.findOrFail(id).then(async (foto) => {
                await foto.load('likes');
                const like = foto.likes.find((like) => like.userId === auth.user?.id);
                await like?.delete();
                await foto.load('likes');
                return response.status(200).send(foto);
            });
        }
        catch (error) {
            return response.status(500).send(error.message);
        }
    }
}
exports.default = FotosController;
//# sourceMappingURL=FotosController.js.map