import {
  SIDEBAR,
  INITIAL,
  DETAILS,
  LIST,
  GEOLOCATION_SEARCHING,
} from '../constants'

export type GeolocationStatus =
  | 'prompt'
  | 'searching'
  | 'errorNotAllowed'
  | 'errorNotFound'
  | 'errorCouldNotGetLocation'

export function isDifferentGeoCoords(a: [number, number], b: [number, number]) {
  return a[0] !== b[0] || a[1] !== b[1]
}

export function isCurrentState(state: ActiveState, activeState: ActiveState) {
  return state === activeState
}

export function isCurrentStateFromAllStates(
  currentState: ActiveState | SidebarActiveState,
  states: { activeState: ActiveState; activeSidebarState: SidebarActiveState }
) {
  return (
    currentState === states.activeState ||
    currentState === states.activeSidebarState
  )
}

export type ActiveState = 'sidebar' | 'geolocation_searching' | 'initial'

export const getInitialActiveState = (props: any): ActiveState => {
  if (props.askForGeolocation) {
    return GEOLOCATION_SEARCHING
  }

  if (props.selectedPickupPoint || props.pickupOptions.length > 0) {
    return SIDEBAR
  }

  return INITIAL
}

export type SidebarActiveState = 'geolocation_searching' | 'details' | 'list'

export const getInitialActiveSidebarState = (
  props: any
): SidebarActiveState => {
  if (props.askForGeolocation) {
    return GEOLOCATION_SEARCHING
  }

  if (props.selectedPickupPoint) {
    return DETAILS
  }

  return LIST
}

export function getCleanId(id?: string) {
  return id
    ?.replace(/[^\w\s]/gi, '')
    .split(' ')
    .join('-')
}
