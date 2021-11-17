import type { ComponentType } from 'react'
import React, { useContext } from 'react'

import type {
  ActiveState,
  SidebarActiveState,
  GeolocationStatus,
} from './utils/StateUtils'

// TODO: we should replace the remaining `any` types with the actual types for
// the properties
/* eslint-disable @typescript-eslint/no-explicit-any */
interface ModalState {
  activeState: ActiveState
  activeSidebarState: SidebarActiveState
  bestPickupOptions: any[]
  externalPickupPoints: any[]
  geolocationStatus: GeolocationStatus
  hoverPickupPoint: any
  isSearching: boolean
  isSelectedBestPickupPoint: boolean
  searchPickupsInArea: (geoCoordinates: any, address: any) => void
  lastState: ActiveState
  lastSidebarState: SidebarActiveState
  lastMapCenterLatLng: google.maps.LatLng | null
  logisticsInfo: any[] | undefined
  pickupOptions: any[] | undefined
  pickupPoints: any[] | undefined
  residentialAddress: any
  searchedAreaNoPickups: boolean
  selectNextPickupPoint: () => void
  selectPreviousPickupPoint: () => void
  selectedPickupPoint: any
  setGeolocationStatus: GeolocationStatus
  setHoverPickupPoint: (pickupPoint: any) => void
  setActiveState: (state: ActiveState) => void
  setActiveSidebarState: (sidebarState: SidebarActiveState) => void
  setAskForGeolocation: (askForGeolocation: boolean) => void
  setSelectedPickupPoint: (value: {
    pickupPoint: any
    isBestPickupPoint: boolean
  }) => void
  setMapCenterLatLng: (center: google.maps.LatLng) => void
  setShouldSearchArea: (shouldSearch: boolean) => void
  setShowOtherPickupPoints: (showOtherPickupPoints: boolean) => void
  shouldSearchArea: boolean
  showOtherPickupPoints: boolean
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const ModalStateContext = React.createContext<ModalState | undefined>(
  undefined
)

export const useModalState = () => {
  const context = useContext(ModalStateContext)

  if (context === undefined) {
    throw new Error('useModalState must be used inside <ModalState />')
  }

  return context
}

export function injectState<T>(Component: ComponentType<T & ModalState>) {
  const StateInjectedComponent: React.FC<T> = (props) => {
    let context

    try {
      context = useModalState()
    } catch (e) {
      throw new Error(`injectState(${Component.displayName}): ${e.message}`)
    }

    return <Component {...props} {...context} />
  }

  StateInjectedComponent.displayName = `withModalState(${Component.displayName})`

  return StateInjectedComponent
}
