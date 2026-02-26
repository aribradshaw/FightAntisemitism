import { createContext, useContext } from 'react'

export const TransitionContext = createContext('idle')

export function useTransitionState() {
  return useContext(TransitionContext)
}
