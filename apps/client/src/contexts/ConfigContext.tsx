import useSWR from 'swr'
import React, { ReactNode, useContext, createContext } from 'react'

interface APIConfigResponse {
  cdnUrl: string
}

interface ServerConfigProps {
  data: APIConfigResponse
  isLoading: boolean
  getThumbnailUrlBase: (assetId: string) => string
  getDirectAssetUrlBase: (assetId: string) => string
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

  function getDirectAssetUrlBase(assetId: string) {
    if (data?.cdnUrl) {
      return `${data.cdnUrl}/stream/${assetId}`
    }
    return `/stream/${assetId}`
  }

  return (
    <ConfigContext.Provider
      value={{ data, isLoading, getThumbnailUrlBase, getDirectAssetUrlBase }}
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
