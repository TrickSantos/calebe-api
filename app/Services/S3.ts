import Env from '@ioc:Adonis/Core/Env'
import aws from 'aws-sdk'
import fs from 'fs'

const endpoint = new aws.Endpoint(`${Env.get('STORAGE_ENDPOINT')}`)

const s3 = new aws.S3({
  endpoint: endpoint,
  credentials: new aws.Credentials(
    `${Env.get('STORAGE_ACCESS_KEY_ID')}`,
    `${Env.get('STORAGE_ACCESS_SECRET_KEY')}`
  ),
})
class S3Service {
  public async upload(
    file: fs.ReadStream,
    filename: string,
    ContentType: string,
    folder: string,
    privacidade: aws.S3.ObjectCannedACL
  ): Promise<string> {
    return await new Promise((resolve: (value: string) => void, reject) => {
      s3.upload(
        {
          Bucket: `${Env.get('STORAGE_BUCKET')}/${folder}`,
          ContentType,
          Body: file,
          ACL: privacidade,
          Key: filename,
        },
        (err: Error, data: aws.S3.ManagedUpload.SendData) => {
          if (err) {
            console.log(err)
            reject(err)
          }

          resolve(`https://calebe.nyc3.cdn.digitaloceanspaces.com/${data.Key}`)
        }
      )
    })
  }
}
export default new S3Service()
