import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { GeolocationContext } from './geolocationContext'
import { injectState } from './modalStateContext'
import { searchPickupAddressByGeolocationEvent } from './utils/metrics'
import {
  getCurrentPosition,
  handleGetAddressByGeolocation,
} from './utils/CurrentPosition'
import {
  ERROR_COULD_NOT_GETLOCATION,
  ERROR_NOT_FOUND,
  INITIAL,
  SEARCHING,
  ERROR_NOT_ALLOWED,
  SIDEBAR,
  DENIED,
  GRANTED,
} from './constants'

class Geolocation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      permissionStatus: null,
      isLoadingGeolocation: false,
      isMyLocationButtonVisible: true,
    }
  }

  componentDidMount() {
    this.getPermissionStatus()
    if (this.props.askForGeolocation) {
      this.handleGetCurrentPosition()
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.activeState !== prevProps.activeState) {
      this.getPermissionStatus()
    }
  }

  setCurrentActiveState = state => {
    const { activeState, setActiveSidebarState, setActiveState } = this.props
    if (activeState === SIDEBAR) {
      setActiveSidebarState(state)
    } else {
      setActiveState(state)
    }
  }

  getPermissionStatus = () => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(permission => {
        this.setState({
          permissionStatus: permission.state,
        })
      })
    }
  }

  handleGetCurrentPosition = () => {
    const { setGeolocationStatus } = this.props
    const { permissionStatus } = this.state
    switch (permissionStatus) {
      case DENIED:
        this.getCurrentPositionError({ code: 1 })
        break

      case GRANTED:
      default:
        setGeolocationStatus(SEARCHING)
        this.setCurrentActiveState(SEARCHING)
        this.handleCurrentPosition()
    }
  }

  handleCurrentPosition = () => {
    this.setState({ isLoadingGeolocation: true })
    this.props.googleMaps &&
      getCurrentPosition(
        this.getCurrentPositionSuccess,
        this.getCurrentPositionError
      )
  }

  getCurrentPositionSuccess = position => {
    const { address, googleMaps, onChangeAddress, rules } = this.props

    this.setState({ isLoadingGeolocation: false })
    this.setCurrentActiveState(SEARCHING)
    handleGetAddressByGeolocation({
      newPosition: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      googleMaps: googleMaps,
      onChangeAddress: onChangeAddress,
      rules: rules,
      address: address,
    })
    searchPickupAddressByGeolocationEvent({
      searchedAddressByGeolocation: true,
      confirmedGeolocation: true,
    })
  }

  getCurrentPositionError = error => {
    this.setState({ isLoadingGeolocation: false })
    const { setAskForGeolocation, setGeolocationStatus } = this.props
    switch (error.code) {
      case 0: // UNKNOWN ERROR
        setAskForGeolocation(false)
        setGeolocationStatus(ERROR_COULD_NOT_GETLOCATION)
        this.setCurrentActiveState(ERROR_COULD_NOT_GETLOCATION)
        searchPickupAddressByGeolocationEvent({
          confirmedGeolocation: true,
          browserError: true,
        })
        break
      case 1: // PERMISSION_DENIED
        setAskForGeolocation(false)
        setGeolocationStatus(ERROR_NOT_ALLOWED)
        this.setCurrentActiveState(INITIAL)
        this.setState({ permissionStatus: DENIED })
        searchPickupAddressByGeolocationEvent({
          deniedGeolocation: true,
        })
        break
      case 2: // POSITION_UNAVAILABLE
        setAskForGeolocation(false)
        setGeolocationStatus(ERROR_NOT_FOUND)
        this.setCurrentActiveState(ERROR_NOT_FOUND)
        searchPickupAddressByGeolocationEvent({
          confirmedGeolocation: true,
          positionUnavailable: true,
        })
        break
      case 3: // TIMEOUT
        // TODO#2: look into retrying timeout, refer to TODO#1
        // Might be done either over there or here.

        // TODO#3: Log in case of timeout in order to better study the ideal timeout;
        // also log the user device browser etc if possible in this case.
        setAskForGeolocation(false)
        setGeolocationStatus(ERROR_COULD_NOT_GETLOCATION)
        this.setCurrentActiveState(ERROR_COULD_NOT_GETLOCATION)
        searchPickupAddressByGeolocationEvent({ dismissedGeolocation: true })
        break
      default:
        return false
    }
  }

  render() {
    const { children } = this.props
    const { isLoadingGeolocation, permissionStatus } = this.state

    return (
      <GeolocationContext.Provider
        value={{
          getCurrentPosition: this.handleCurrentPosition,
          isLoadingGeolocation,
          permissionStatus,
        }}>
        {children}
      </GeolocationContext.Provider>
    )
  }
}

Geolocation.propTypes = {
  children: PropTypes.any.isRequired,
}

export default injectState(Geolocation)
