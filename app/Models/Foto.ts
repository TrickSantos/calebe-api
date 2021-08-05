import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Curtir from './Curtir'

export default class Foto extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'userId' })
  public userId: number

  @column()
  public foto: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public usuario: BelongsTo<typeof User>

  @hasMany(() => Curtir)
  public likes: HasMany<typeof Curtir>
}
