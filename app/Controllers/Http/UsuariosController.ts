import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

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
            email: schema.string({}, [rules.email()]),
            nome: schema.string(),
            cpf: schema.string(),
            avatar: schema.file.optional({ extnames: ['jpg', 'gif', 'png'], size: '2mb' }),
            equipeId: schema.number([rules.exists({ column: 'id', table: 'equipes' })]),
            perfil: schema.enum(['pastor', 'lider', 'membro'] as const),
          }),
          messages: {
            'email.required': 'O email precisa ser informado',
            'email.email': 'O email precisa estar em um formato válido',
            'nome': 'O nome precisa ser informado',
            'cpf': 'O CPF precisa ser informado',
            'avatar.extnames': 'A imagem precisa ser .jpg ou .png',
            'avatar.size': 'A imagem pode ter no maximo 10mb',
            'equipeId': 'A equipe precisa ser informada',
            'perfil.enum': 'O perfil precisa ser do tipo: lider ou membro',
          },
        })
        .then(async (data) => {
          await User.create({ ...data, avatar: '', password: data.cpf }).then((user) =>
            response.status(200).send(user)
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
      await request
        .validate({
          schema: schema.create({
            email: schema.string.optional({}, [rules.email()]),
            nome: schema.string.optional(),
            cpf: schema.string.optional(),
            password: schema.string.optional(),
            avatar: schema.file.optional({ extnames: ['jpg', 'gif', 'png'], size: '2mb' }),
            equipeId: schema.number.optional([rules.exists({ column: 'id', table: 'equipes' })]),
            perfil: schema.enum.optional(['pastor', 'lider', 'membro'] as const),
          }),
          messages: {
            'email.email': 'O email precisa estar em um formato válido',
            'nome': 'O nome precisa ser informado',
            'cpf': 'O CPF precisa ser informado',
            'avatar.extnames': 'A imagem precisa ser .jpg ou .png',
            'avatar.size': 'A imagem pode ter no maximo 10mb',
            'equipeId': 'A equipe precisa ser informada',
            'perfil.enum': 'O perfil precisa ser do tipo: lider ou membro',
          },
        })
        .then(async (data) => {
          const { id } = params
          await User.findOrFail(id).then(async (user) => {
            user.merge({ ...data, avatar: '' })
            await user.save()
            return response.status(200).send(user)
          })
        })
    } catch (error) {
      try {
        const { id } = params
        await User.findOrFail(id).then(async (user) => response.status(200).send(user))
      } catch (error) {
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
}
