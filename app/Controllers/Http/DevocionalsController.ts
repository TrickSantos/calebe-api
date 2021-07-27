import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Devocional from 'App/Models/Devocional'
import Comentario from 'App/Models/Comentario'
import Like from 'App/Models/Like'
import Bull from '@ioc:Rocketseat/Bull'
import LiberarDevocional from 'App/Jobs/LiberarDevocional'

export default class DevocionalsController {
  public async index({ response }: HttpContextContract) {
    try {
      await Devocional.query()
        .preload('autor')
        .then((devocionais) => response.status(200).send(devocionais))
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      await request
        .validate({
          schema: schema.create({
            titulo: schema.string(),
            verso: schema.string.optional(),
            cover: schema.string.optional(),
            video: schema.string.optional(),
            conteudo: schema.string.optional(),
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
            titulo: schema.string.optional(),
            verso: schema.string.optional(),
            cover: schema.string.optional(),
            video: schema.string.optional(),
            conteudo: schema.string.optional(),
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
          .then(() => response.status(200))
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
          .then(() => response.status(200))
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

  public async removerCurtida({ params, response }: HttpContextContract) {
    try {
      const { id } = params
      await Like.findOrFail(id).then(async (like) => {
        await like.delete()
        return response.status(200)
      })
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }
}
