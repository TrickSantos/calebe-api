import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Distrito from './Distrito'

export default class Igreja extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nome: string

  @column({ serializeAs: 'distritoId' })
  public distritoId: number

  @belongsTo(() => Distrito)
  public distrito: BelongsTo<typeof Distrito>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
