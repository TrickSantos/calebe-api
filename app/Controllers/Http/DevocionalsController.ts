import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Devocional from 'App/Models/Devocional'
import Comentario from 'App/Models/Comentario'
import Bull from '@ioc:Rocketseat/Bull'
import LiberarDevocional from 'App/Jobs/LiberarDevocional'

export default class DevocionalsController {
  public async index({ response, request }: HttpContextContract) {
    try {
      const { status } = request.all()
      const page = request.input('page')
      if (status) {
        await Devocional.query()
          .where({ status })
          .preload('autor')
          .preload('comentarios', (query) => query.preload('usuario'))
          .preload('likes')
          .orderBy('id', 'desc')
          .paginate(page, 4)
          .then((devocionais) => {
            devocionais.namingStrategy = {
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
            return response.status(200).send(devocionais)
          })
      } else {
        await Devocional.query()
          .preload('autor')
          .preload('comentarios')
          .preload('likes')
          .orderBy('id', 'desc')
          .then((devocionais) => response.status(200).send(devocionais))
      }
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      await request
        .validate({
          schema: schema.create({
            titulo: schema.string({ trim: true }),
            verso: schema.string.optional({ trim: true }),
            cover: schema.string.optional(),
            video: schema.string.optional(),
            conteudo: schema.string.optional({ trim: true }),
            liberacao: schema.date(),
          }),
          messages: {
            'titulo.required': 'O titulo precisa ser informado',
            'liberacao.required': 'A liberação precisa ser informada',
          },
        })
        .then(async (data) => {
          await Devocional.create({ ...data, autorId: auth.user?.id }).then((devocional) => {
            Bull.schedule(new LiberarDevocional().key, devocional, devocional.liberacao.toJSDate())

            return response.status(200).send(devocional)
          })
        })
    } catch (error) {
      if (error.messages) {
        return response.status(500).send(error.messages)
      } else {
        return response.status(500).send(error.message)
      }
    }
  }

  public async update({ request, response, params, auth }: HttpContextContract) {
    try {
      await request
        .validate({
          schema: schema.create({
            titulo: schema.string.optional({ trim: true }),
            verso: schema.string.optional({ trim: true }),
            cover: schema.string.optional(),
            video: schema.string.optional(),
            conteudo: schema.string.optional({ trim: true }),
            liberacao: schema.date.optional(),
          }),
          messages: {
            'cover.extnames': 'A imagem precisa ser .jpg ou .png',
            'cover.size': 'A imagem pode ter no maximo 10mb',
          },
        })
        .then(async (data) => {
          const { id } = params
          await Devocional.findOrFail(id).then(async (devocional) => {
            devocional.merge({ ...data, autorId: auth.user?.id })
            await devocional.save()
            return response.status(200).send(devocional)
          })
        })
    } catch (error) {
      if (error.messages) {
        return response.status(500).send(error.messages)
      } else {
        return response.status(500).send(error.message)
      }
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const { id } = params
      await Devocional.findOrFail(id).then(async (devocional) => {
        await devocional.delete()
        return response.status(200)
      })
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }

  public async comentar({ params, response, request, auth }: HttpContextContract) {
    try {
      const { comentario } = request.all()
      const { id } = params
      await Devocional.findOrFail(id).then(async (devocional) => {
        await devocional
          .related('comentarios')
          .create({
            comentario,
            userId: auth.user?.id,
          })
          .then(async () => {
            await devocional.load('comentarios', (query) => query.preload('usuario'))
            await devocional.load('likes')
            return response.status(200).send(devocional)
          })
      })
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }

  public async curtir({ params, response, auth }: HttpContextContract) {
    try {
      const { id } = params
      await Devocional.findOrFail(id).then(async (devocional) => {
        await devocional
          .related('likes')
          .create({
            userId: auth.user?.id,
          })
          .then(async () => {
            await devocional.load('likes')
            await devocional.load('comentarios')
            return response.status(200).send(devocional)
          })
      })
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }

  public async removerComentario({ params, response }: HttpContextContract) {
    try {
      const { id } = params
      await Comentario.findOrFail(id).then(async (comentario) => {
        await comentario.delete()
        return response.status(200)
      })
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }

  public async removerCurtida({ params, response, auth }: HttpContextContract) {
    try {
      const { id } = params
      await Devocional.findOrFail(id).then(async (devocional) => {
        await devocional.load('likes')
        const like = devocional.likes.find((like) => like.userId === auth.user?.id)
        await like?.delete()
        await devocional.load('likes')
        await devocional.load('comentarios')
        return response.status(200).send(devocional)
      })
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }
}
