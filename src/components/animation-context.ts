import { createContext, useContext } from 'react'

export const PreferenceContext = createContext({ animated: true, paused: false, systemReduced: false, toggle: () => {} })
export const useAnimation = () => useContext(PreferenceContext)
