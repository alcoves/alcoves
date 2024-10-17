import pc from 'picocolors'

import imageWorker from './tasks/images'

export async function startWorkers() {
  console.info(`${pc.blue('Starting workers')}`)

  console.info(`${pc.blue('Starting image worker')}`)
  imageWorker()
}
