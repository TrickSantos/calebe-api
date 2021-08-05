import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Foto from 'App/Models/Foto'

export default class FotosController {
  public async index({ response, request }: HttpContextContract) {
    const page = request.input('page')
    try {
      await Foto.query()
        .preload('usuario', (query) => query.preload('equipe'))
        .preload('likes')
        .orderBy('createdAt', 'desc')
        .paginate(page, 8)
        .then((fotos) => {
          fotos.namingStrategy = {
            paginationMetaKeys() {
              return {
                total: 'total',
                perPage: 'perPage',
                currentPage: 'currentPage',
                lastPage: 'lastPage',
                firstPage: 'firstPage',
                firstPageUrl: 'firstPageUrl',
                lastPageUrl: 'lastPageUrl',
                nextPageUrl: 'nextPageUrl',
                previousPageUrl: 'previousPageUrl',
              }
            },
          }
          return response.send(fotos)
        })
    } catch (error) {
      console.log(error.message)
      return response.status(500).send('Erro ao carregar mural, tente novamente')
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const { foto } = request.all()
      const { user } = auth
      await Foto.create({
        foto,
        userId: user?.id,
      }).then((foto) => response.send(foto))
    } catch (error) {
      console.log(error.message)
      return response.status(500).send('Erro ao enviar imagem, tente novamente')
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const { id } = params
      await Foto.findOrFail(id).then(async (foto) => {
        await foto.delete()
        return response.status(200)
      })
    } catch (error) {
      return response.status(500).send('Erro ao apagar imagem, tente novamente')
    }
  }

  public async curtir({ params, response, auth }: HttpContextContract) {
    try {
      const { id } = params
      await Foto.findOrFail(id).then(async (foto) => {
        await foto
          .related('likes')
          .create({
            userId: auth.user?.id,
          })
          .then(async () => {
            await foto.load('likes')
            return response.status(200).send(foto)
          })
      })
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }

  public async removerCurtida({ params, response, auth }: HttpContextContract) {
    try {
      const { id } = params
      await Foto.findOrFail(id).then(async (foto) => {
        await foto.load('likes')
        const like = foto.likes.find((like) => like.userId === auth.user?.id)
        await like?.delete()
        await foto.load('likes')
        return response.status(200).send(foto)
      })
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }
}
