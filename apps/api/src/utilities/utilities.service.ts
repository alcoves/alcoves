import axios from 'axios'
import mime from 'mime-types'

import { PassThrough } from 'stream'
import { S3 } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { Upload } from '@aws-sdk/lib-storage'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UtilitiesService {
  private s3: S3

  constructor(private readonly config: ConfigService) {
    this.s3 = new S3({
      region: 'us-east-1',
      forcePathStyle: true,
      endpoint: this.config.get('ALCOVES_STORAGE_ENDPOINT'),
      credentials: {
        accessKeyId: this.config.get('ALCOVES_STORAGE_ACCESS_KEY_ID'),
        secretAccessKey: this.config.get('ALCOVES_STORAGE_SECRET_ACCESS_KEY'),
      },
    })
  }

  async ingestURLToStorage(
    input: string,
    storageBucket: string,
    storageKey: string
  ): Promise<any> {
    try {
      const pass = new PassThrough()
      const response = await axios.get(input, { responseType: 'stream' })
      response.data.pipe(pass)

      const contentType: string =
        mime.lookup(input) || response.headers['content-type']

      const upload = new Upload({
        client: this.s3,
        params: {
          Body: pass,
          Key: storageKey,
          Bucket: storageBucket,
          ContentType: contentType,
        },
      })

      await upload.done()
      return { status: 'Success', contentType }
    } catch (error) {
      console.error('Error in ingestURLToStorage: ', error)
      throw error
    }
  }
}
