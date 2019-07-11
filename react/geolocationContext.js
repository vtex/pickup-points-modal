import React from 'react'

export const GeolocationContext = React.createContext()

export function injectGeolocation(Component) {
  return function StateInjectedComponent(props) {
    return (
      <GeolocationContext.Consumer>
        {({ permissionStatus, getCurrentPosition }) => (
          <Component
            {...props}
            permissionStatus={permissionStatus}
            getCurrentPosition={getCurrentPosition}
          />
        )}
      </GeolocationContext.Consumer>
    )
  }
}
