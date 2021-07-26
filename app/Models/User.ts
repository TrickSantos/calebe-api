import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  belongsTo,
  BelongsTo,
} from '@ioc:Adonis/Lucid/Orm'
import Devocional from './Devocional'
import Equipe from './Equipe'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'equipeId' })
  public equipeId: number

  @column()
  public email: string

  @column()
  public avatar: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public nome: string

  @column()
  public cpf: string

  @column()
  public perfil: 'admin' | 'pastor' | 'lider' | 'membro'

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Devocional, {
    foreignKey: 'autorId',
  })
  public devocionais: HasMany<typeof Devocional>

  @belongsTo(() => Equipe)
  public equipe: BelongsTo<typeof Equipe>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
