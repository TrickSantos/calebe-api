import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import fs from 'fs'
import User from 'App/Models/User'
import S3 from 'App/Services/S3'
import Convite from 'App/Mailers/Convite'

export default class UsuariosController {
  public async index({ response }: HttpContextContract) {
    try {
      await User.all().then((users) => response.status(200).send(users))
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }

  public async store({ response, request }: HttpContextContract) {
    try {
      await request
        .validate({
          schema: schema.create({
            email: schema.string({ trim: true }, [
              rules.email(),
              rules.unique({ column: 'email', table: 'users' }),
            ]),
            nome: schema.string({ trim: true }),
            cpf: schema.string({}, [
              rules.maxLength(11),
              rules.minLength(11),
              rules.unique({ column: 'cpf', table: 'users' }),
            ]),
            equipeId: schema.number([rules.exists({ column: 'id', table: 'equipes' })]),
            perfil: schema.enum(['pastor', 'lider', 'membro'] as const),
          }),
          messages: {
            'email.required': 'O email precisa ser informado',
            'email.email': 'O email precisa estar em um formato válido',
            'email.unique': 'Este já está sendo usado',
            'nome.required': 'O nome precisa ser informado',
            'cpf.required': 'O CPF precisa ser informado',
            'cpf.unique': 'O CPF já está em uso',
            'cpf.maxLength': 'CPF inválido',
            'cpf.minLength': 'CPF inválido',
            'equipeId': 'A equipe precisa ser informada',
            'perfil.enum': 'O perfil precisa ser do tipo: lider ou membro',
          },
        })
        .then(async (data) => {
          await User.create({ ...data, password: data.cpf }).then(async (usuario) => {
            await usuario.load('equipe')
            await new Convite(usuario, usuario.equipe).send()

            return response.status(200).send(usuario)
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
      await User.findOrFail(id).then(async (user) => response.status(200).send(user))
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const { id } = params
      await request
        .validate({
          schema: schema.create({
            email: schema.string.optional({ trim: true }, [
              rules.email(),
              rules.unique({ column: 'email', table: 'users', whereNot: { id: id } }),
            ]),
            nome: schema.string.optional({ trim: true }),
            cpf: schema.string.optional({}, [
              rules.maxLength(11),
              rules.minLength(11),
              rules.unique({ column: 'cpf', table: 'users', whereNot: { id: id } }),
            ]),
            password: schema.string.optional(),
            avatar: schema.file.optional({ extnames: ['jpg', 'gif', 'png'], size: '2mb' }),
            equipeId: schema.number.optional([rules.exists({ column: 'id', table: 'equipes' })]),
            perfil: schema.enum.optional(['pastor', 'lider', 'membro'] as const),
          }),
          messages: {
            'email.email': 'O email precisa estar em um formato válido',
            'email.unique': 'O email já está em uso',
            'nome': 'O nome precisa ser informado',
            'cpf.unique': 'O CPF já está em uso',
            'cpf.maxLength': 'CPF inválido',
            'cpf.minLength': 'CPF inválido',
            'avatar.extnames': 'A imagem precisa ser .jpg ou .png',
            'avatar.size': 'A imagem pode ter no maximo 10mb',
            'equipeId': 'A equipe precisa ser informada',
            'perfil.enum': 'O perfil precisa ser do tipo: lider ou membro',
          },
        })
        .then(async (data) => {
          await User.findOrFail(id).then(async (user) => {
            let avatar = user.avatar
            if (data.avatar && data.avatar.type && data.avatar.tmpPath) {
              await S3.upload(
                fs.createReadStream(data.avatar.tmpPath),
                `${cuid()}.${data.avatar.extname}`,
                data.avatar.type,
                'user',
                'public-read'
              ).then((url) => {
                avatar = url
              })
            }
            user.merge({ ...data, avatar })
            await user.save()
            await user.load('equipe')
            return response.status(200).send(user)
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
      await User.findOrFail(id).then(async (user) => {
        await user.delete()
        return response.status(200)
      })
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }

  public async upload({ request, response }: HttpContextContract) {
    try {
      await request
        .validate({
          schema: schema.create({
            file: schema.file(),
            pasta: schema.string(),
          }),
        })
        .then(async ({ file, pasta }) => {
          let link = ''
          if (file && file.type && file.tmpPath) {
            await S3.upload(
              fs.createReadStream(file.tmpPath),
              `${cuid()}.${file.extname}`,
              file.type,
              pasta,
              'public-read'
            ).then((url) => {
              link = url
            })
            return response.status(200).send({ url: link })
          }
        })
    } catch (error) {
      console.log(error)
      if (error.messages) {
        return response.status(500).send(error.messages)
      } else {
        return response.status(500).send(error.message)
      }
    }
  }
}
