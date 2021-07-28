import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import View from '@ioc:Adonis/Core/View'
import Env from '@ioc:Adonis/Core/Env'
import mjml from 'mjml'
import Equipe from 'App/Models/Equipe'
import User from 'App/Models/User'

export default class Aviso extends BaseMailer {
  constructor(private lider: User, private equipe: Equipe) {
    super()
  }

  public async prepare(message: MessageContract) {
    const html = mjml(
      await View.render('emails/aviso', {
        equipe: this.equipe.nome,
        nome: this.lider.nome,
        url: Env.get('MOBILE_URL'),
      })
    ).html

    message
      .from('naoresponda@calebealm.com')
      .to(this.lider.email)
      .subject(`Missão Calebe - Equipe ${this.equipe.nome}`)
      .html(html)
  }
}
