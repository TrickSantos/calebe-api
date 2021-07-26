import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Igreja from 'App/Models/Igreja'

export default class Distrito extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nome: string

  @hasMany(() => Igreja)
  public igrejas: HasMany<typeof Igreja>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
