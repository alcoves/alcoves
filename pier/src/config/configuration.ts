import * as fs from 'fs-extra'

const config = () => ({
  paths: {
    tmp: '/config/tmp',
    videos: '/videos',
    thumbnails: '/config/thumbnails',
  },
})

fs.ensureDirSync(config().paths.tmp)
fs.ensureDirSync(config().paths.thumbnails)

export default config
