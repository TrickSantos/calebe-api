import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Like from './Like'
import Comentario from './Comentario'

export default class Devocional extends BaseModel {
  public static table = 'devocionais'

  public serializeExtras = true

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

  @column.date()
  public liberacao: DateTime

  @column()
  public status: boolean

  @belongsTo(() => User, {
    foreignKey: 'autorId',
  })
  public autor: BelongsTo<typeof User>

  @hasMany(() => Like)
  public likes: HasMany<typeof Like>

  @hasMany(() => Comentario)
  public comentarios: HasMany<typeof Comentario>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public serializeExtra() {
    return {
      totalLikes: this.$extras.likes_count,
      totalComentarios: this.$extras.comentarios_count,
    }
  }
}
