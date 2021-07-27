import { JobContract } from '@ioc:Rocketseat/Bull'
import Desafio from 'App/Models/Desafio'

interface Data {
  id: number
}

export default class EncerrarDesafio implements JobContract {
  public key = 'EncerrarDesafio'

  public async handle(job: { data: Data }) {
    const { data } = job

    await Desafio.findOrFail(data.id)
      .then(async (desafio) => {
        desafio.merge({ status: false })
        await desafio.save()
      })
      .catch((e) => console.log(e))
    return data
  }
}
