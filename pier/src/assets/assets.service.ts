import * as path from 'path'
import * as fs from 'fs-extra'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AssetsService {
  constructor(private configService: ConfigService) {}

  async findAll(subpath: string, serverUrl: string) {
    const dataDir = this.configService.get('DATA_DIR')
    const fullAssetPath = subpath ? `${dataDir}/${subpath}` : dataDir
    const requestedAsset = await fs.statSync(fullAssetPath)

    if (requestedAsset.isDirectory()) {
      const files = await fs.readdir(fullAssetPath)

      const assets = files.map((file) => {
        const fullPath = `${fullAssetPath}/${file}`
        const stats = fs.statSync(fullPath)

        return {
          fullPath,
          name: file,
          stats: stats,
          type: stats.isFile() ? 'file' : 'folder',
          streamUri: stats.isFile()
            ? `${serverUrl}/streams/${subpath}/${file}`
            : null,
        }
      })

      return assets.sort((a, b) => a.name.localeCompare(b.name))
    } else {
      return [
        {
          fullPath: fullAssetPath,
          name: path.basename(fullAssetPath),
          stats: requestedAsset,
          type: requestedAsset.isFile() ? 'file' : 'folder',
          streamUri: requestedAsset.isFile()
            ? `${serverUrl}/streams/${subpath}`
            : null,
        },
      ]
    }
  }
}
