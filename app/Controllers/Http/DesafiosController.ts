import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Bull from '@ioc:Rocketseat/Bull'
import Desafio from 'App/Models/Desafio'
import LiberarDesafio from 'App/Jobs/LiberarDesafio'
import EncerrarDesafio from 'App/Jobs/EncerrarDesafio'
import { DateTime } from 'luxon'

export default class DesafiosController {
  public async index({ response, request }: HttpContextContract) {
    try {
      const { equipeId } = request.all()
      await Desafio.query()
        .where((builder) => {
          if (equipeId) {
            builder.where('status', '=', true)
            builder.whereDoesntHave('respostas', (query) => {
              query.where({ equipeId })
            })
          }
        })
        .orderBy('liberacao', 'asc')
        .then((desafios) => response.status(200).send(desafios))
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      await request
        .validate({
          schema: schema.create({
            titulo: schema.string({ trim: true }),
            pontos: schema.number(),
            cover: schema.string.optional(),
            video: schema.string.optional(),
            conteudo: schema.string({ trim: true }),
            liberacao: schema.date(),
            encerramento: schema.date(),
          }),
          messages: {
            'titulo.required': 'titulo precisa ser informado',
            'pontos.required': 'pontos precisa ser informado',
            'conteudo.required': 'conteudo precisa ser informado',
            'liberacao.required': 'liberacao precisa ser informado',
            'encerramento.required': 'encerramento precisa ser informado',
          },
        })
        .then(async (data) => {
          await Desafio.create(data).then((desafio) => {
            if (desafio.liberacao > DateTime.utc()) {
              Bull.schedule(new LiberarDesafio().key, desafio, desafio.liberacao.toJSDate())
            } else {
              Bull.add(new LiberarDesafio().key, desafio)
            }

            Bull.schedule(
              new EncerrarDesafio().key,
              desafio,
              desafio.encerramento.startOf('day').toJSDate()
            )

            return response.send(desafio)
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

  public async show({ params, response }: HttpContextContract) {
    try {
      const { id } = params
      await Desafio.findOrFail(id).then((desafio) => response.send(desafio))
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }

  public async update({ params, response, request }: HttpContextContract) {
    try {
      await request
        .validate({
          schema: schema.create({
            titulo: schema.string.optional({ trim: true }),
            pontos: schema.number.optional(),
            cover: schema.string.optional(),
            video: schema.string.optional(),
            conteudo: schema.string.optional({ trim: true }),
            liberacao: schema.date.optional(),
            encerramento: schema.date.optional(),
          }),
          messages: {
            'titulo.required': 'titulo precisa ser informado',
            'pontos.required': 'pontos precisa ser informado',
            'conteudo.required': 'conteudo precisa ser informado',
            'liberacao.required': 'liberacao precisa ser informado',
            'encerramento.required': 'encerramento precisa ser informado',
          },
        })
        .then(async (data) => {
          const { id } = params
          await Desafio.findOrFail(id).then(async (desafio) => {
            desafio.merge(data)
            await desafio.save()

            if (data.liberacao) {
              Bull.schedule(
                new LiberarDesafio().key,
                desafio,
                desafio.liberacao.startOf('day').toJSDate()
              )
            }
            if (data.encerramento) {
              Bull.schedule(
                new EncerrarDesafio().key,
                desafio,
                desafio.encerramento.startOf('day').toJSDate()
              )
            }

            return response.send(desafio)
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
      await Desafio.findOrFail(id).then(async (desafio) => {
        await desafio.delete()
        return response.status(200)
      })
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }
}
