import Route from '@ioc:Adonis/Core/Route'

Route.resource('/equipe', 'EquipesController').apiOnly()
Route.resource('/usuario', 'UsuariosController').apiOnly().middleware({ '*': 'auth' })
Route.resource('/desafio', 'DesafiosController').apiOnly().middleware({ '*': 'auth' })
Route.resource('/resposta', 'RespostasController').apiOnly().middleware({ '*': 'auth' })
Route.resource('/devocional', 'DevocionalsController').apiOnly().middleware({ '*': 'auth' })
Route.resource('/foto', 'FotosController').apiOnly().middleware({ '*': 'auth' })
Route.put('/comentar/:id', 'DevocionalsController.comentar').middleware('auth')
Route.put('/curtir/:id', 'DevocionalsController.curtir').middleware('auth')

Route.put('/curtir_foto/:id', 'FotosController.curtir').middleware('auth')
Route.delete('/curtida_foto/:id', 'FotosController.removerCurtida').middleware('auth')

Route.delete('/comentario/:id', 'DevocionalsController.removerComentario').middleware('auth')
Route.delete('/curtida/:id', 'DevocionalsController.removerCurtida').middleware('auth')

Route.get('/distritos', 'DistritosController.index')
Route.post('/login', 'AuthController.login')
Route.post('/logout', 'AuthController.logout')
Route.post('/recuperar', 'AuthController.recuperar')
Route.post('/upload', 'UsuariosController.upload')

Route.get('/', async () => {
  return { hello: 'world' }
})
