import imageWorker from './tasks/images'

async function main() {
    console.log('Booting up worker...')
    imageWorker()
}

main()
