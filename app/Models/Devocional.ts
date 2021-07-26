import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Devocional extends BaseModel {
  public static table = 'devocionais'

  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'autor_id', serializeAs: 'autorId' })
  public autorId: number

  @column()
  public titulo: string

  @column()
  public verso: string

  @column()
  public cover: string

  @column()
  public video: string

  @column()
  public conteudo: string

  @column.dateTime()
  public liberacao: DateTime

  @belongsTo(() => User, {
    foreignKey: 'autorId',
  })
  public autor: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
