import { MISSIONS, type Mission } from './missions'
import { PLACES } from './places'

export const ALL_MISSIONS: Mission[] = [...MISSIONS, ...PLACES.flatMap((p) => p.missions)]
export const findMission = (id: string) => ALL_MISSIONS.find((m) => m.id === id)
export * from './missions'
export * from './places'
export * from './chapters'
