import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Equipe from 'App/Models/Equipe'

export default class AdministracaoSeeder extends BaseSeeder {
  public async run() {
    await Equipe.create({
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
      })
    })
  }
}
