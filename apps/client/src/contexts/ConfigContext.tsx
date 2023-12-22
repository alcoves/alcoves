import useSWR from 'swr'
import React, { ReactNode, useContext, createContext } from 'react'

interface APIConfigResponse {
  cdnUrl: string
}

interface ServerConfigProps {
  data: APIConfigResponse
  isLoading: boolean
  getThumbnailUrlBase: (assetId: string) => string
  getHLSManifestUrl: (assetId: string) => string
}

interface ServerConfigProviderProps {
  children: ReactNode
}

const ConfigContext = createContext<ServerConfigProps | null>(null)

export const ConfigProvider: React.FC<ServerConfigProviderProps> = ({
  children,
}) => {
  const { data, isLoading } = useSWR(`/api/config`)

  function getThumbnailUrlBase(assetId: string) {
    if (data?.cdnUrl) {
      return `${data.cdnUrl}/stream/${assetId}/thumbnail`
    }
    return `/stream/${assetId}/thumbnail`
  }

  function getHLSManifestUrl(assetId: string) {
    if (data?.cdnUrl) {
      return `${data.cdnUrl}/stream/${assetId}.m3u8`
    }
    return `/stream/${assetId}.m3u8`
  }

  return (
    <ConfigContext.Provider
      value={{ data, isLoading, getThumbnailUrlBase, getHLSManifestUrl }}
    >
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfig = (): ServerConfigProps => {
  const context = useContext(ConfigContext)

  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }

  return context
}
