"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.resource('/equipe', 'EquipesController').apiOnly();
Route_1.default.resource('/usuario', 'UsuariosController').apiOnly().middleware({ '*': 'auth' });
Route_1.default.resource('/desafio', 'DesafiosController').apiOnly().middleware({ '*': 'auth' });
Route_1.default.resource('/resposta', 'RespostasController').apiOnly().middleware({ '*': 'auth' });
Route_1.default.resource('/devocional', 'DevocionalsController').apiOnly().middleware({ '*': 'auth' });
Route_1.default.put('/comentar/:id', 'DevocionalsController.comentar').middleware('auth');
Route_1.default.put('/curtir/:id', 'DevocionalsController.curtir').middleware('auth');
Route_1.default.delete('/comentario/:id', 'DevocionalsController.removerComentario').middleware('auth');
Route_1.default.delete('/curtida/:id', 'DevocionalsController.removerCurtida').middleware('auth');
Route_1.default.get('/distritos', 'DistritosController.index');
Route_1.default.post('/login', 'AuthController.login');
Route_1.default.post('/logout', 'AuthController.logout');
Route_1.default.post('/recuperar', 'AuthController.recuperar');
Route_1.default.post('/upload', 'UsuariosController.upload');
Route_1.default.get('/', async () => {
    return { hello: 'world' };
});
//# sourceMappingURL=routes.js.map