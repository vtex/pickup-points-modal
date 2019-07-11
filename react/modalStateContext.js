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
          selectedPickupPoint,
          setGeolocationStatus,
          setActiveState,
          setActiveSidebarState,
          setAskForGeolocation,
          setSelectedPickupPoint,
        }) => (
          <Component
            {...props}
            activeState={activeState}
            activeSidebarState={activeSidebarState}
            geolocationStatus={geolocationStatus}
            lastState={lastState}
            lastSidebarState={lastSidebarState}
            selectedPickupPoint={selectedPickupPoint}
            setGeolocationStatus={setGeolocationStatus}
            setActiveState={setActiveState}
            setActiveSidebarState={setActiveSidebarState}
            setAskForGeolocation={setAskForGeolocation}
            setSelectedPickupPoint={setSelectedPickupPoint}
          />
        )}
      </ModalStateContext.Consumer>
    )
  }
}
