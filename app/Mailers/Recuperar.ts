import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import View from '@ioc:Adonis/Core/View'
import mjml from 'mjml'
import User from 'App/Models/User'

export default class Recuperar extends BaseMailer {
  constructor(private usuario: User, private token: string) {
    super()
  }

  public async prepare(message: MessageContract) {
    const html = mjml(
      await View.render('emails/recuperar', {
        nome: this.usuario.nome,
        url: `${Env.get('FRONTEND_URL')}/recuperar/${this.token}/${this.usuario.id}`,
      })
    ).html

    message
      .from('naoresponda@calebealm.com')
      .to(this.usuario.email)
      .subject(`Missão Calebe - Recuperação de senha`)
      .html(html)
  }
}
