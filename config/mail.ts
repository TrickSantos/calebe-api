/**
 * Config source: https://git.io/JvgAf
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import { MailConfig } from '@ioc:Adonis/Addons/Mail'

const mailConfig: MailConfig = {
  mailer: 'smtp',

  mailers: {
    smtp: {
      driver: 'smtp',
      host: Env.get('SMTP_HOST'),
      port: Env.get('SMTP_PORT'),
      auth: {
        user: Env.get('SMTP_USERNAME'),
        pass: Env.get('SMTP_PASSWORD'),
        type: 'login',
      },
    },
    ses: {
      driver: 'ses',
      apiVersion: '2010-12-01',
      key: Env.get('SES_ACCESS_KEY'),
      secret: Env.get('SES_ACCESS_SECRET'),
      region: Env.get('SES_REGION'),
      sslEnabled: true,
      sendingRate: 10,
      maxConnections: 5,
    },
    mailgun: {
      driver: 'mailgun',
      baseUrl: 'https://api.mailgun.net/v3',
      key: Env.get('MAILGUN_API_KEY'),
      domain: Env.get('MAILGUN_DOMAIN'),
    },
  },
}

export default mailConfig
