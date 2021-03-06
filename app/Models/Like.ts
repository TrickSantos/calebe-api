import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Devocional from './Devocional'

export default class Like extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'devocionalId' })
  public devocionalId: number

  @column({ serializeAs: 'userId' })
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public usuario: BelongsTo<typeof User>

  @belongsTo(() => Devocional)
  public devocional: BelongsTo<typeof Devocional>
}
