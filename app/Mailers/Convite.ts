import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import View from '@ioc:Adonis/Core/View'
import mjml from 'mjml'
import Equipe from 'App/Models/Equipe'
import User from 'App/Models/User'

export default class Convite extends BaseMailer {
  constructor(private lider: User, private equipe: Equipe) {
    super()
  }

  public async prepare(message: MessageContract) {
    const html = mjml(await View.render('emails/convite')).html

    message
      .from('naoresponda@calebealm.com')
      .to(this.lider.email)
      .subject(`Missão Calebe - Equipe ${this.equipe.nome}`)
      .html(html)
  }
}
