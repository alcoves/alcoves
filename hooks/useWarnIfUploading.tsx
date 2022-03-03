import { useEffect } from 'react'
import { useRouter } from 'next/router'

export const useWarnIfUploading = (unsavedChanges: boolean, callback: () => boolean) => {
  const router = useRouter()

  useEffect(() => {
    if (unsavedChanges) {
      const routeChangeStart = () => {
        const ok = callback()
        if (!ok) {
          router.events.emit('routeChangeError')
          throw 'Abort route change. Please ignore this error.'
        }
      }
      router.events.on('routeChangeStart', routeChangeStart)

      return () => {
        router.events.off('routeChangeStart', routeChangeStart)
      }
    }
  }, [unsavedChanges, callback, router.events])
}
