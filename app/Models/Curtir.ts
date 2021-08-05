import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Foto from './Foto'
import User from './User'

export default class Curtir extends BaseModel {
  public static table = 'curtidas'

  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'userId' })
  public userId: number

  @column({ serializeAs: 'fotoId' })
  public fotoId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public usuario: BelongsTo<typeof User>

  @belongsTo(() => Foto)
  public foto: BelongsTo<typeof Foto>
}
