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

    const requestedAssetDirectory = await fs.lstat(fullAssetPath)

    if (!requestedAssetDirectory.isDirectory()) {
      const fullPath = fullAssetPath
      return [
        {
          name: path.basename(fullPath),
          stats: fs.statSync(fullPath),
          fullPath: fullPath,
          type: 'file',
          streamUri: `${serverUrl}/streams/${subpath}`,
        },
      ]
    }

    const files = await fs.readdir(fullAssetPath)

    const assets = files.map((file) => {
      const fullPath = `${fullAssetPath}/${file}`
      const stats = fs.statSync(fullPath)
      const stat = fs.lstatSync(fullPath)

      return {
        name: file,
        stats: stats,
        fullPath: fullPath,
        type: stat.isFile() ? 'file' : 'folder',
        streamUri: null,
      }
    })

    return assets
  }
}
