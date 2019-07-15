import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ModalStateContext } from './modalStateContext'
import {
  PROMPT,
  SIDEBAR,
  INITIAL,
  DETAILS,
  LIST,
  ERROR_NOT_FOUND,
  SEARCHING,
  GEOLOCATION_SEARCHING,
} from './constants'

class ModalState extends Component {
  constructor(props) {
    super(props)

    this.state = {
      askForGeolocation: props.askForGeolocation,
      activeState: props.pickupPoints.length > 0 ? SIDEBAR : INITIAL,
      activeSidebarState: this.getInitialActiveState(props),
      geolocationStatus: PROMPT,
      lastState: '',
      lastSidebarState: '',
      lastMapCenterLatLng: null,
      selectedPickupPoint: props.selectedPickupPoint,
      shouldSearchArea: false,
    }
  }

  getInitialActiveState = props => {
    return props.askForGeolocation
      ? GEOLOCATION_SEARCHING
      : props.selectedPickupPoint
        ? DETAILS
        : props.pickupPoints.length > 0
          ? LIST
          : ERROR_NOT_FOUND
  }

  componentDidUpdate() {
    const { isSearching, pickupPoints } = this.props
    const { activeState, activeSidebarState, askForGeolocation } = this.state

    const hasPickups = pickupPoints.length > 0

    const isSidebarState =
      !isSearching &&
      hasPickups &&
      this.isCurrentState(SEARCHING, activeState) &&
      !this.isCurrentState(SIDEBAR, activeState)

    const isListState =
      !isSearching &&
      hasPickups &&
      this.isCurrentState(SEARCHING, activeSidebarState) &&
      this.isCurrentState(SIDEBAR, activeState)

    const isSearchingState =
      isSearching &&
      !this.isCurrentState(SEARCHING, activeState) &&
      !this.isCurrentState(SIDEBAR, activeSidebarState) &&
      !this.isCurrentState(SEARCHING, activeSidebarState)

    const isGeolocationSearchingState =
      askForGeolocation &&
      !this.isCurrentState(SIDEBAR, activeState) &&
      !this.isCurrentState(GEOLOCATION_SEARCHING, activeState)

    const isErrorNopickupsState =
      !isSearching &&
      !hasPickups &&
      this.isCurrentState(SEARCHING, activeState) &&
      !this.isCurrentState(ERROR_NOT_FOUND, activeState)

    switch (true) {
      case isSearchingState:
        if (this.isCurrentState(SIDEBAR, activeState)) {
          this.setActiveSidebarState(SEARCHING)
        } else {
          this.setActiveState(SEARCHING)
        }
        return

      case isListState:
        this.setActiveSidebarState(LIST)
        return

      case isGeolocationSearchingState:
        this.setActiveState(GEOLOCATION_SEARCHING)
        this.setActiveSidebarState(LIST)
        return

      case isSidebarState:
        this.setActiveState(SIDEBAR)
        this.setActiveSidebarState(LIST)
        return

      case isErrorNopickupsState:
        this.setActiveState(ERROR_NOT_FOUND)
        return

      default:
        return
    }
  }

  isCurrentState(state, activeState) {
    return state === activeState
  }

  setMapCenterLatLng = lastMapCenterLatLng =>
    this.setState({ lastMapCenterLatLng })

  setAskForGeolocation = askForGeolocation =>
    this.setState({ askForGeolocation })

  setShouldSearchArea = shouldSearchArea => this.setState({ shouldSearchArea })

  setGeolocationStatus = status => this.setState({ geolocationStatus: status })

  setActiveState = state =>
    this.setState({ lastState: this.state.activeState, activeState: state })

  setActiveSidebarState = state => {
    this.setState({
      lastSidebarState: this.state.activeSidebarState,
      activeSidebarState: state,
    })
  }

  setSelectedPickupPoint = pickupPoint =>
    this.setState({ selectedPickupPoint: pickupPoint })

  render() {
    const { children } = this.props
    const {
      activeState,
      activeSidebarState,
      geolocationStatus,
      lastState,
      lastSidebarState,
      lastMapCenterLatLng,
      selectedPickupPoint,
      shouldSearchArea,
    } = this.state

    return (
      <ModalStateContext.Provider
        value={{
          geolocationStatus,
          activeState,
          activeSidebarState,
          lastState,
          lastSidebarState,
          lastMapCenterLatLng,
          selectedPickupPoint,
          setActiveState: this.setActiveState,
          setAskForGeolocation: this.setAskForGeolocation,
          setActiveSidebarState: this.setActiveSidebarState,
          setGeolocationStatus: this.setGeolocationStatus,
          setMapCenterLatLng: this.setMapCenterLatLng,
          setSelectedPickupPoint: this.setSelectedPickupPoint,
          shouldSearchArea,
          setShouldSearchArea: this.setShouldSearchArea,
        }}>
        {children}
      </ModalStateContext.Provider>
    )
  }
}

ModalState.propTypes = {
  children: PropTypes.any.isRequired,
}

export default ModalState
