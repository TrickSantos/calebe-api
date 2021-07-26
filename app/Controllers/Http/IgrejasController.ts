import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Igreja from 'App/Models/Igreja'

export default class IgrejasController {
  public async index({ response }: HttpContextContract) {
    try {
      await Igreja.all().then((igrejas) => response.status(200).send(igrejas))
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }
}
