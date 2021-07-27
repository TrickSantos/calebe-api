import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Recuperar from 'App/Mailers/Recuperar'

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.all()

    try {
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '7 days',
      })
      await User.findOrFail(token.user.id).then(async (user) => {
        await user.load('equipe')

        response.status(200).send({ ...token, user })
      })
    } catch (error) {
      if (error.code === 'E_INVALID_AUTH_UID' || error.code === 'E_INVALID_AUTH_PASSWORD') {
        return response
          .status(500)
          .send({ message: 'Email ou senha invalidos, favor tentar novamente.' })
      } else {
        console.log(error)
        return response
          .status(500)
          .send({ message: 'Ocorreu um erro durante a autenticação, favor tentar novamente.' })
      }
    }
  }

  public async logout({ response, auth }: HttpContextContract) {
    try {
      return await auth.use('api').logout()
    } catch (error) {
      return response
        .status(500)
        .send({ message: 'Ocorreu um erro durante a autenticação, favor tentar novamente.' })
    }
  }

  public async recuperar({ request, response, auth }: HttpContextContract) {
    const { email } = request.all()
    try {
      const user = await User.findByOrFail('email', email)

      const token = await auth.use('api').generate(user, {
        expiresIn: '30min',
      })
      await new Recuperar(user, token.token).send()
      return response.status(200).send({ message: 'Email enviado com sucesso' })
    } catch (error) {
      console.log(error)
      return response.status(500).send({ message: 'Este email não existe, tente novamente' })
    }
  }
}
