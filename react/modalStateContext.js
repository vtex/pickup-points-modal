import React from 'react'

export const ModalStateContext = React.createContext()

export function injectState(Component) {
  return function StateInjectedComponent(props) {
    return (
      <ModalStateContext.Consumer>
        {({
          activeState,
          activeSidebarState,
          bestPickupOptions,
          externalPickupPoints,
          geolocationStatus,
          isSearching,
          lastState,
          lastSidebarState,
          lastMapCenterLatLng,
          logisticsInfo,
          pickupOptions,
          pickupPoints,
          searchedAreaNoPickups,
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
            bestPickupOptions={bestPickupOptions}
            externalPickupPoints={externalPickupPoints}
            geolocationStatus={geolocationStatus}
            isSearching={isSearching}
            lastState={lastState}
            lastSidebarState={lastSidebarState}
            lastMapCenterLatLng={lastMapCenterLatLng}
            logisticsInfo={logisticsInfo}
            selectedPickupPoint={selectedPickupPoint}
            pickupOptions={pickupOptions}
            pickupPoints={pickupPoints}
            searchedAreaNoPickups={searchedAreaNoPickups}
            setGeolocationStatus={setGeolocationStatus}
            setActiveState={setActiveState}
            setActiveSidebarState={setActiveSidebarState}
            setAskForGeolocation={setAskForGeolocation}
            setMapCenterLatLng={setMapCenterLatLng}
            setSelectedPickupPoint={setSelectedPickupPoint}
            setShouldSearchArea={setShouldSearchArea}
            shouldSearchArea={shouldSearchArea}
          />
        )}
      </ModalStateContext.Consumer>
    )
  }
}
