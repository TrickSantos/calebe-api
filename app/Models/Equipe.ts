import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Igreja from './Igreja'
import Resposta from './Resposta'

export default class Equipe extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'igrejaId' })
  public igrejaId: number

  @column()
  public nome: string

  @column()
  public instagram: string

  @column()
  public avatar: string

  @hasMany(() => User)
  public membros: HasMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Igreja)
  public igreja: BelongsTo<typeof Igreja>

  @hasMany(() => Resposta)
  public respostas: HasMany<typeof Resposta>
}
