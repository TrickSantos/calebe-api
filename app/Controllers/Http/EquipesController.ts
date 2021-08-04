import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import Database from '@ioc:Adonis/Lucid/Database'
import Aviso from 'App/Mailers/Aviso'
import Equipe from 'App/Models/Equipe'
import S3 from 'App/Services/S3'
import fs from 'fs'

export default class EquipesController {
  public async index({ response, request }: HttpContextContract) {
    const { ranking } = request.all()
    try {
      await Equipe.query()
        .where((builder) => {
          if (ranking) {
            builder.whereNot({ id: 2 })
          }
        })
        .preload('membros')
        .preload('igreja')
        .withAggregate('respostas', (query) => {
          query.sum('pontos').as('pontuacao')
        })
        .orderBy('pontuacao', 'desc')
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
              avatar: schema.file.optional({ extnames: ['jpg', 'png'], size: '10mb' }),
            }),
            lider: schema.object().members({
              email: schema.string({}, [rules.email()]),
              avatar: schema.file.optional({ extnames: ['jpg', 'png'], size: '10mb' }),
              password: schema.string(),
              nome: schema.string(),
              cpf: schema.string({}, [rules.maxLength(11), rules.minLength(11)]),
            }),
          }),
          messages: {
            'equipe.nome': 'O nome da equipe precisa ser informado',
            'equipe.igrejaId': 'A igreja precisa ser informada',
            'equipe.instagram': 'O @ da equipe precisa ser informada',
            'equipe.avatar.extnames': 'A imagem precisa ser .jpg ou .png',
            'equipe.avatar.size': 'A imagem pode ter no maximo 10mb',
            'lider.nome': 'O nome da equipe precisa ser informado',
            'lider.cpf.required': 'O CPF precisa ser informado',
            'lider.cpf.maxLength': 'CPF invalido',
            'lider.cpf.minLength': 'CPF invalido',
            'lider.email.required': 'O email do lider precisa ser informado',
            'lider.email.email': 'O email do lider precisa ser valido',
            'lider.avatar.extnames': 'A imagem precisa ser .jpg ou .png',
            'lider.avatar.size': 'A imagem pode ter no maximo 10mb',
            'lider.password.required': 'A senha precisa ser informada',
          },
        })
        .then(async (data) => {
          await Database.transaction(async (trx) => {
            const equipe = new Equipe()
            equipe.merge({ ...data.equipe, avatar: '' })
            equipe.useTransaction(trx)
            await equipe.save()
            await equipe
              .related('membros')
              .create({ ...data.lider, perfil: 'lider', avatar: '' })
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

        return response.send(equipe)
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
            avatar: schema.file.optional({ extnames: ['jpg', 'png'], size: '10mb' }),
          }),
          messages: {
            'nome': 'O nome da equipe precisa ser informado',
            'igrejaId': 'A igreja precisa ser informada',
            'instagram': 'O @ da equipe precisa ser informada',
            'avatar.extnames': 'A imagem precisa ser .jpg ou .png',
            'avatar.size': 'A imagem pode ter no maximo 10mb',
          },
        })
        .then(async (data) => {
          const { id } = params
          await Equipe.findOrFail(id).then(async (equipe) => {
            let avatar = equipe.avatar
            if (data.avatar && data.avatar.type && data.avatar.tmpPath) {
              await S3.upload(
                fs.createReadStream(data.avatar.tmpPath),
                `${cuid()}.${data.avatar.extname}`,
                data.avatar.type,
                'equipe',
                'public-read'
              ).then((url) => {
                avatar = url
              })
            }
            equipe.merge({ ...data, avatar })
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
