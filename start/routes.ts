import Route from '@ioc:Adonis/Core/Route'

Route.resource('/equipe', 'EquipesController').apiOnly()
Route.resource('/usuario', 'UsuariosController').apiOnly().middleware({ '*': 'auth' })
Route.resource('/desafio', 'DesafiosController').apiOnly().middleware({ '*': 'auth' })
Route.resource('/devocional', 'DevocionalsController').apiOnly().middleware({ '*': 'auth' })
Route.get('/distritos', 'DistritosController.index')
Route.post('/login', 'AuthController.login')
Route.post('/logout', 'AuthController.logout')
Route.post('/recuperar', 'AuthController.recuperar')

Route.get('/', async () => {
  return { hello: 'world' }
})
