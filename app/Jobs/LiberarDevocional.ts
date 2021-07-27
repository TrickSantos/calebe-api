import { JobContract } from '@ioc:Rocketseat/Bull'
import Devocional from 'App/Models/Devocional'

interface Data {
  id: number
}

export default class LiberarDevocional implements JobContract {
  public key = 'LiberarDevocional'

  public async handle(job: { data: Data }) {
    const { data } = job

    await Devocional.findOrFail(data.id)
      .then(async (devocional) => {
        devocional.merge({ status: true })
        await devocional.save()
      })
      .catch((e) => console.log(e))
    return data
  }
}
