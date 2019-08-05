import React from 'react'

export const GeolocationContext = React.createContext()

export function injectGeolocation(Component) {
  return function StateInjectedComponent(props) {
    return (
      <GeolocationContext.Consumer>
        {({ getCurrentPosition, isLoadingGeolocation, permissionStatus }) => (
          <Component
            {...props}
            getCurrentPosition={getCurrentPosition}
            isLoadingGeolocation={isLoadingGeolocation}
            permissionStatus={permissionStatus}
          />
        )}
      </GeolocationContext.Consumer>
    )
  }
}
