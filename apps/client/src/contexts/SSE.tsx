import React, { createContext, useContext, useEffect, useState } from 'react'

// Step 1: Define the SSE context and types
type SSEMessageType = {
  // Define your message type
}

type SSEContextType = {
  data: SSEMessageType | null
  setData: React.Dispatch<React.SetStateAction<SSEMessageType | null>>
}

const SSEContext = createContext<SSEContextType | undefined>(undefined)

// Step 2: Create the SSE Provider Component
type SSEProviderProps = {
  url: string
  children: React.ReactNode
}

export const SSEProvider: React.FC<SSEProviderProps> = ({ url, children }) => {
  const [data, setData] = useState<SSEMessageType | null>(null)

  useEffect(() => {
    const eventSource = new EventSource(url)

    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data) as SSEMessageType
      setData(newData)
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
    }

    return () => {
      eventSource.close()
    }
  }, [url])

  return (
    <SSEContext.Provider value={{ data, setData }}>
      {children}
    </SSEContext.Provider>
  )
}

// Step 3: Create a custom hook for using the context
export const useSSE = (): SSEContextType => {
  const context = useContext(SSEContext)
  if (!context) {
    throw new Error('useSSE must be used within a SSEProvider')
  }
  return context
}
