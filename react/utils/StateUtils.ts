import {
  SIDEBAR,
  INITIAL,
  DETAILS,
  LIST,
  GEOLOCATION_SEARCHING,
} from '../constants'

export function isDifferentGeoCoords(a, b) {
  return a[0] !== b[0] || a[1] !== b[1]
}

export function isCurrentState(state, activeState) {
  return state === activeState
}

export function isCurrentStateFromAllStates(currentState, states) {
  return (
    currentState === states.activeState ||
    currentState === states.activeSidebarState
  )
}

export const getInitialActiveState = props => {
  if (props.askForGeolocation) {
    return GEOLOCATION_SEARCHING
  }

  if (props.selectedPickupPoint || props.pickupOptions.length > 0) {
    return SIDEBAR
  }

  return INITIAL
}

export const getInitialActiveSidebarState = props => {
  if (props.askForGeolocation) {
    return GEOLOCATION_SEARCHING
  }

  if (props.selectedPickupPoint) {
    return DETAILS
  }

  return LIST
}

export function getCleanId(id) {
  return (
    id &&
    id
      .replace(/[^\w\s]/gi, '')
      .split(' ')
      .join('-')
  )
}
