import React from 'react'
import { UploadsState } from '../types/types'

const obj: UploadsState = {
  uploads: [],
  addUpload: async () => {
    return
  },
}
const UploadsContext = React.createContext(obj)

export { UploadsContext }
