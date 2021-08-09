import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Resposta from 'App/Models/Resposta'
import Equipe from 'App/Models/Equipe'
import { DateTime } from 'luxon'

export default class RespostasController {
  public async index({ response, request }: HttpContextContract) {
    const { desafioId } = request.all()
    try {
      await Equipe.query()
        .whereHas('resposta', (builder) => builder.where({ desafioId }))
        .preload('resposta', (builder) => builder.where({ desafioId }))
        .then((equipes) => response.send(equipes))
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }

  public async store({ response, request }: HttpContextContract) {
    try {
      await request
        .validate({
          schema: schema.create({
            desafioId: schema.number([
              rules.exists({
                column: 'id',
                table: 'desafios',
              }),
            ]),
            equipeId: schema.number([
              rules.exists({
                column: 'id',
                table: 'equipes',
              }),
            ]),
            respostas: schema.array().members(
              schema.object().members({
                resposta: schema.string(),
              })
            ),
          }),
          messages: {
            'desafioId.exists': 'Desafio não encontrado',
            'desafioId.required': 'O desafio precisa ser informado',
            'equipeId.exists': 'Equipe não encontrada',
            'equipeId.required': 'A equipe precisa ser informada',
            'respostas.required': 'As respostas precisam ser informadas',
          },
        })
        .then(async (data) => {
          await Resposta.create({ ...data, respostas: JSON.stringify(data.respostas) }).then(
            (resposta) => response.send(resposta)
          )
        })
    } catch (error) {
      if (error.messages) {
        return response.status(500).send(error.messages)
      } else {
        return response.status(500).send(error.message)
      }
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const { id } = params
      await Resposta.findOrFail(id).then((resposta) => response.send(resposta))
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      await request
        .validate({
          schema: schema.create({
            desafioId: schema.number.optional([
              rules.exists({
                column: 'id',
                table: 'equipes',
              }),
            ]),
            equipeId: schema.number.optional([
              rules.exists({
                column: 'id',
                table: 'equipes',
              }),
            ]),
            respostas: schema.array.optional().members(
              schema.object().members({
                resposta: schema.string(),
              })
            ),
            pontos: schema.number(),
          }),
          messages: {
            'desafioId.exists': 'Desafio não encontrado',
            'desafioId.required': 'O desafio precisa ser informado',
            'equipeId.exists': 'Equipe não encontrada',
            'equipeId.required': 'A equipe precisa ser informada',
            'respostas.required': 'As respostas precisam ser informadas',
            'pontos.required': 'Os pontos precisam ser informados',
            'aprovado.required': 'A avaliação precisa ser informado',
          },
        })
        .then(async (data) => {
          const { id } = params
          await Resposta.findOrFail(id).then(async (resposta) => {
            resposta.merge({ ...data, aprovado: true, aprovadoEm: DateTime.utc() })
            await resposta.save()
            return response.send(resposta)
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
      await Resposta.findOrFail(id).then(async (resposta) => {
        await resposta.delete()
        return response.status(200)
      })
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }
}
