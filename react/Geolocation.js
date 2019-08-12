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
    const { activeState, setGeolocationStatus } = this.props

    if (get(navigator, 'permissions')) {
      navigator.permissions.query({ name: 'geolocation' }).then(permission => {
        switch (permission.state) {
          case DENIED:
            this.getCurrentPositionError({ code: 1 })
            break

          case 'granted':
            setGeolocationStatus(SEARCHING)
            if (activeState === SIDEBAR) {
              this.props.setActiveSidebarState(SEARCHING)
            } else {
              this.props.setActiveState(SEARCHING)
            }

            this.handleCurrentPosition()
            break

          default:
            this.handleCurrentPosition()
        }
      })
    } else {
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
    const {
      activeState,
      address,
      googleMaps,
      onChangeAddress,
      rules,
      setActiveSidebarState,
      setActiveState,
    } = this.props
    console.log('eita')
    this.setState({ isLoadingGeolocation: false })
    if (activeState === SIDEBAR) {
      setActiveSidebarState(SEARCHING)
    } else {
      setActiveState(SEARCHING)
    }
    handleGetAddressByGeolocation({
      newPosition: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      geocoder: this.geocoder,
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
    const {
      activeState,
      setActiveState,
      setActiveSidebarState,
      setAskForGeolocation,
      setGeolocationStatus,
    } = this.props
    switch (error.code) {
      case 0: // UNKNOWN ERROR
        setAskForGeolocation(false)
        setGeolocationStatus(ERROR_COULD_NOT_GETLOCATION)
        if (activeState === SIDEBAR) {
          setActiveSidebarState(ERROR_COULD_NOT_GETLOCATION)
        } else {
          setActiveState(ERROR_COULD_NOT_GETLOCATION)
        }
        searchPickupAddressByGeolocationEvent({
          confirmedGeolocation: true,
          browserError: true,
        })
        break
      case 1: // PERMISSION_DENIED
        setAskForGeolocation(false)
        setGeolocationStatus(ERROR_NOT_ALLOWED)
        if (activeState === SIDEBAR) {
          setActiveSidebarState(INITIAL)
        } else {
          setActiveState(INITIAL)
        }
        this.setState({ permissionStatus: DENIED })
        searchPickupAddressByGeolocationEvent({
          deniedGeolocation: true,
        })
        break
      case 2: // POSITION_UNAVAILABLE
        setAskForGeolocation(false)
        setGeolocationStatus(ERROR_NOT_FOUND)
        if (activeState === SIDEBAR) {
          setActiveSidebarState(ERROR_NOT_FOUND)
        } else {
          setActiveState(ERROR_NOT_FOUND)
        }
        searchPickupAddressByGeolocationEvent({
          confirmedGeolocation: true,
          positionUnavailable: true,
        })
        break
      case 3: // TIMEOUT
        setAskForGeolocation(false)
        setGeolocationStatus(ERROR_COULD_NOT_GETLOCATION)
        if (activeState === SIDEBAR) {
          setActiveSidebarState(ERROR_COULD_NOT_GETLOCATION)
        } else {
          setActiveState(ERROR_COULD_NOT_GETLOCATION)
        }
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
