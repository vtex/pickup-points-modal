import React, { Component } from 'react'
import PropTypes from 'prop-types'

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
  unsubscribeGetCurrentPosition = null
  unsubscribeGetAddressByGeolocation = null
  startTime = null

  constructor(props) {
    super(props)

    this.state = {
      permissionStatus: null,
      isLoadingGeolocation: false,
      isMyLocationButtonVisible: true,
    }
  }

  componentDidMount() {
    this.startTime = Date.now()
    this.getPermissionStatus()
    if (this.props.askForGeolocation) {
      this.handleGetCurrentPosition()
    }
  }

  unsubscribeAsyncTasks = () => {
    this.unsubscribeGetCurrentPosition?.()
    this.unsubscribeGetCurrentPosition = null
    this.unsubscribeGetAddressByGeolocation?.()
    this.unsubscribeGetAddressByGeolocation = null
  }

  componentWillUnmount() {
    this.unsubscribeAsyncTasks()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.activeState !== prevProps.activeState) {
      this.getPermissionStatus()
    }

    const { isLoadingGeolocation } = this.state

    if (isLoadingGeolocation !== prevState.isLoadingGeolocation) {
      this.props.onChangeGeolocationState?.({ loading: isLoadingGeolocation })
    }
  }

  setCurrentActiveState = (state) => {
    const { activeState, setActiveSidebarState, setActiveState } = this.props

    if (activeState === SIDEBAR) {
      setActiveSidebarState(state)
    } else {
      setActiveState(state)
    }
  }

  getPermissionStatus = () => {
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((permission) => {
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

      // eslint-disable-next-line no-fallthrough
      default:
        setGeolocationStatus(SEARCHING)
        this.setCurrentActiveState(SEARCHING)
        this.handleCurrentPosition()
    }
  }

  handleCurrentPosition = () => {
    this.setState({ isLoadingGeolocation: true })
    if (this.props.googleMaps) {
      this.unsubscribeGetCurrentPosition = getCurrentPosition(
        this.getCurrentPositionSuccess,
        this.getCurrentPositionError
      )
    }
  }

  getCurrentPositionSuccess = (position) => {
    const {
      address,
      googleMaps,
      onChangeAddress,
      rules,
      setAskForGeolocation,
    } = this.props

    this.setState({ isLoadingGeolocation: false })
    this.setCurrentActiveState(SEARCHING)
    setAskForGeolocation(false)

    const elapsedTime = Date.now() - this.startTime

    this.unsubscribeGetAddressByGeolocation = handleGetAddressByGeolocation({
      newPosition: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      googleMaps,
      onChangeAddress,
      rules,
      address,
    })

    searchPickupAddressByGeolocationEvent({
      searchedAddressByGeolocation: true,
      confirmedGeolocation: true,
      elapsedTime,
    })
  }

  getCurrentPositionError = (error) => {
    const { setAskForGeolocation, setGeolocationStatus } = this.props

    this.setState({ isLoadingGeolocation: false })

    const elapsedTime = Date.now() - this.startTime

    switch (error.code) {
      case 0: // UNKNOWN ERROR
        setAskForGeolocation(false)
        setGeolocationStatus(ERROR_COULD_NOT_GETLOCATION)
        this.setCurrentActiveState(INITIAL)
        searchPickupAddressByGeolocationEvent({
          confirmedGeolocation: true,
          browserError: true,
          elapsedTime,
        })
        break

      case 1: // PERMISSION_DENIED
        setAskForGeolocation(false)
        setGeolocationStatus(ERROR_NOT_ALLOWED)
        this.setCurrentActiveState(INITIAL)
        this.setState({ permissionStatus: DENIED })
        searchPickupAddressByGeolocationEvent({
          deniedGeolocation: true,
          elapsedTime,
        })
        break

      case 2: // POSITION_UNAVAILABLE
        setAskForGeolocation(false)
        setGeolocationStatus(ERROR_NOT_FOUND)
        this.setCurrentActiveState(INITIAL)
        searchPickupAddressByGeolocationEvent({
          confirmedGeolocation: true,
          positionUnavailable: true,
          elapsedTime,
        })
        break

      case 3: // TIMEOUT
        setAskForGeolocation(false)
        setGeolocationStatus(ERROR_COULD_NOT_GETLOCATION)
        this.setCurrentActiveState(INITIAL)
        // The event below ("dismissedGeolocation") is likely erroneously named;
        // error code 3 happens when the geolocation function takes too long
        // to respond, for a number of reasons. Keeping the name though to
        // avoid breaking things.
        searchPickupAddressByGeolocationEvent({
          dismissedGeolocation: true,
          elapsedTime,
        })
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
        }}
      >
        {children}
      </GeolocationContext.Provider>
    )
  }
}

Geolocation.propTypes = {
  children: PropTypes.any.isRequired,
  onChangeGeolocationState: PropTypes.func,
  askForGeolocation: PropTypes.bool,
  activeState: PropTypes.string,
  setAskForGeolocation: PropTypes.func,
  setGeolocationStatus: PropTypes.func,
  address: PropTypes.object,
  googleMaps: PropTypes.object,
  onChangeAddress: PropTypes.func,
  rules: PropTypes.object,
  setActiveSidebarState: PropTypes.func,
  setActiveState: PropTypes.func,
}

export default injectState(Geolocation)
