import React from 'react'

export const ModalStateContext = React.createContext()

export function injectState(Component) {
  return function StateInjectedComponent(props) {
    return (
      <ModalStateContext.Consumer>
        {({
          activeState,
          activeSidebarState,
          geolocationStatus,
          lastState,
          lastSidebarState,
          lastMapCenterLatLng,
          selectedPickupPoint,
          setGeolocationStatus,
          setActiveState,
          setActiveSidebarState,
          setAskForGeolocation,
          setSelectedPickupPoint,
          setMapCenterLatLng,
          shouldSearchArea,
          setShouldSearchArea,
        }) => (
          <Component
            {...props}
            activeState={activeState}
            activeSidebarState={activeSidebarState}
            geolocationStatus={geolocationStatus}
            lastState={lastState}
            lastSidebarState={lastSidebarState}
            lastMapCenterLatLng={lastMapCenterLatLng}
            selectedPickupPoint={selectedPickupPoint}
            setGeolocationStatus={setGeolocationStatus}
            setActiveState={setActiveState}
            setActiveSidebarState={setActiveSidebarState}
            setAskForGeolocation={setAskForGeolocation}
            setMapCenterLatLng={setMapCenterLatLng}
            setSelectedPickupPoint={setSelectedPickupPoint}
            shouldSearchArea={shouldSearchArea}
            setShouldSearchArea={setShouldSearchArea}
          />
        )}
      </ModalStateContext.Consumer>
    )
  }
}
