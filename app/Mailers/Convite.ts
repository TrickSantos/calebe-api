import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import View from '@ioc:Adonis/Core/View'
import mjml from 'mjml'
import Equipe from 'App/Models/Equipe'
import User from 'App/Models/User'

export default class Convite extends BaseMailer {
  constructor(private user: User, private equipe: Equipe) {
    super()
  }

  public async prepare(message: MessageContract) {
    const html = mjml(
      await View.render('emails/convite', {
        equipe: this.equipe.nome,
        nome: this.user.nome,
        url: Env.get('MOBILE_URL'),
      })
    ).html

    message
      .from('naoresponda@calebealm.com')
      .to(this.user.email)
      .subject(`Missão Calebe - Equipe ${this.equipe.nome}`)
      .html(html)
  }
}
