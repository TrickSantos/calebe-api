import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Distrito from 'App/Models/Distrito'

export default class DistritosController {
  public async index({ response }: HttpContextContract) {
    try {
      await Distrito.query()
        .preload('igrejas')
        .then((distritos) => response.status(200).send(distritos))
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }
}
