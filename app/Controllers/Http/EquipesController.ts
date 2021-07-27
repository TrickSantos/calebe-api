import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import Equipe from 'App/Models/Equipe'
import Aviso from 'App/Mailers/Aviso'

export default class EquipesController {
  public async index({ response }: HttpContextContract) {
    try {
      await Equipe.query()
        .preload('membros')
        .preload('igreja')
        .then((equipes) => response.status(200).send(equipes))
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }

  public async store({ response, request }: HttpContextContract) {
    try {
      await request
        .validate({
          schema: schema.create({
            equipe: schema.object().members({
              nome: schema.string(),
              igrejaId: schema.number([rules.exists({ column: 'id', table: 'igrejas' })]),
              instagram: schema.string(),
              avatar: schema.string.optional(),
            }),
            lider: schema.object().members({
              email: schema.string({}, [rules.email()]),
              avatar: schema.string.optional(),
              password: schema.string(),
              nome: schema.string(),
              cpf: schema.string({}, [rules.maxLength(11), rules.minLength(11)]),
            }),
          }),
          messages: {
            'equipe.nome': 'O nome da equipe precisa ser informado',
            'equipe.igrejaId': 'A igreja precisa ser informada',
            'equipe.instagram': 'O @ da equipe precisa ser informada',
            'lider.nome': 'O nome da equipe precisa ser informado',
            'lider.cpf.required': 'O CPF precisa ser informado',
            'lider.cpf.maxLength': 'CPF invalido',
            'lider.cpf.minLength': 'CPF invalido',
            'lider.email.required': 'O email do lider precisa ser informado',
            'lider.email.email': 'O email do lider precisa ser valido',
            'lider.password.required': 'A senha precisa ser informada',
          },
        })
        .then(async (data) => {
          await Database.transaction(async (trx) => {
            const equipe = new Equipe()
            equipe.merge(data.equipe)
            equipe.useTransaction(trx)
            await equipe.save()
            await equipe
              .related('membros')
              .create({ ...data.lider, perfil: 'lider' })
              .then(async (lider) => {
                await trx.commit()
                await new Aviso(lider, equipe).send()
                return response.status(200).send(equipe)
              })
              .catch(async (e) => {
                await trx.rollback()
                throw new Error(e)
              })
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
      await Equipe.findOrFail(id).then(async (equipe) => {
        await equipe.load('igreja', (query) => query.preload('distrito'))
        await equipe.load('membros')
        response.send(equipe)
      })
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }

  public async update({ request, params, response }: HttpContextContract) {
    try {
      await request
        .validate({
          schema: schema.create({
            nome: schema.string.optional(),
            igrejaId: schema.number.optional([rules.exists({ column: 'id', table: 'igrejas' })]),
            instagram: schema.string.optional(),
            avatar: schema.string.optional(),
          }),
          messages: {
            nome: 'O nome da equipe precisa ser informado',
            igrejaId: 'A igreja precisa ser informada',
            instagram: 'O @ da equipe precisa ser informada',
          },
        })
        .then(async (data) => {
          const { id } = params
          await Equipe.findOrFail(id).then(async (equipe) => {
            equipe.merge(data)
            await equipe.save()
            return response.send(equipe)
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

  public async destroy({ response, params }: HttpContextContract) {
    try {
      const { id } = params
      await Equipe.findOrFail(id).then(async (equipe) => {
        await equipe.delete()
        return response.status(200)
      })
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }
}
