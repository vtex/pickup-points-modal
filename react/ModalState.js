import React, { Component } from 'react'
import PropTypes from 'prop-types'
import sortBy from 'lodash/sortBy'
import uniqBy from 'lodash/uniqBy'
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
import { getExternalPickupPoints, getAvailablePickup } from './fetchers'
import { getPickupOptions } from './utils/pickupUtils'
import { getPickupSlaString } from './utils/GetString'
import { getBestPickupPoints } from './utils/bestPickups'

class ModalState extends Component {
  constructor(props) {
    super(props)

    this.state = {
      askForGeolocation: props.askForGeolocation,
      activeState: props.pickupPoints.length > 0 ? SIDEBAR : INITIAL,
      bestPickupOptions: getBestPickupPoints(
        props.pickupOptions,
        props.items,
        props.logisticsInfo
      ),
      activeSidebarState: this.getInitialActiveState(props),
      geolocationStatus: PROMPT,
      lastState: '',
      lastSidebarState: '',
      lastMapCenterLatLng: null,
      isSearching: props.isSearching,
      logisticsInfo: props.logisticsInfo,
      pickupPoints: props.pickupPoints,
      pickupOptions: props.pickupOptions,
      selectedPickupPoint: props.selectedPickupPoint,
      shouldSearchArea: false,
      externalPickupPoints: [],
    }
  }

  componentDidMount() {
    const thisAddressCoords =
      this.props.address &&
      this.props.address.geoCoordinates &&
      this.props.address.geoCoordinates.value

    getExternalPickupPoints(thisAddressCoords).then(data =>
      this.setState({
        externalPickupPoints: data.items,
      })
    )
  }

  componentDidUpdate(prevProps) {
    const {
      address,
      pickupPoints,
      items,
      logisticsInfo,
      pickupOptions,
      isSearching,
    } = this.props
    const {
      activeState,
      activeSidebarState,
      askForGeolocation,
      selectedPickupPoint,
    } = this.state

    const thisAddressCoords =
      address && address.geoCoordinates && address.geoCoordinates.value
    const prevAddressCoords = prevProps.address.geoCoordinates.value

    const thisPickupOptions = getPickupSlaString(pickupOptions)
    const prevPickupOptions = getPickupSlaString(prevProps.pickupOptions)

    const prevIsSearching = prevProps.isSearching

    if (isSearching !== prevIsSearching) {
      this.setState({ isSearching })
    }

    if (thisPickupOptions !== prevPickupOptions) {
      this.setState({
        pickupOptions: pickupOptions,
        pickupPoints: pickupPoints,
        bestPickupOptions: getBestPickupPoints(
          pickupOptions,
          items,
          logisticsInfo
        ),
      })
    }

    if (this.isDifferentGeoCoords(thisAddressCoords, prevAddressCoords)) {
      getExternalPickupPoints(thisAddressCoords).then(data =>
        this.setState({ externalPickupPoints: data.items })
      )
    }

    const hasPickups = pickupPoints.length > 0

    const isDetailsNoSelectedPickupPoint =
      this.isCurrentState(DETAILS, activeSidebarState) && !selectedPickupPoint

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
      this.state.isSearching &&
      !this.isCurrentState(SEARCHING, activeState) &&
      !this.isCurrentState(SIDEBAR, activeState) &&
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

      case isDetailsNoSelectedPickupPoint:
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

  getInitialActiveState = props => {
    return props.askForGeolocation
      ? GEOLOCATION_SEARCHING
      : props.selectedPickupPoint
        ? DETAILS
        : props.pickupPoints.length > 0
          ? LIST
          : ERROR_NOT_FOUND
  }

  isDifferentGeoCoords(a, b) {
    return a[0] !== b[0] || a[1] !== b[1]
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

  findSla = (li, pickupPoint) => {
    return li.slas.find(simulationPickupPoint =>
      simulationPickupPoint.id.includes(
        pickupPoint && (pickupPoint.id || pickupPoint.pickupPointId)
      )
    )
  }

  setSelectedPickupPoint = pickupPoint => {
    const { orderFormId, salesChannel } = this.props
    const {
      bestPickupOptions,
      pickupPoints,
      pickupOptions,
      logisticsInfo,
    } = this.state

    const pickupAddress = pickupPoint.pickupStoreInfo
      ? pickupPoint.pickupStoreInfo.address
      : pickupPoint.address

    if (pickupPoint.pickupStoreInfo) {
      this.setState({
        selectedPickupPoint: pickupPoint,
        activeSidebarState: DETAILS,
      })
      return
    }

    this.setActiveSidebarState(SEARCHING)
    this.setState({ isSearching: true })

    getAvailablePickup({
      logisticsInfo,
      salesChannel,
      orderFormId,
      pickupAddress,
    }).then(data => {
      const availablePickupOptions =
        data.logisticsInfo && getPickupOptions(data.logisticsInfo)
      const availablePickupPoints = data.pickupPoints
      const availablePickupLI =
        data.logisticsInfo &&
        data.logisticsInfo.find(li => this.findSla(li, pickupPoint))
      const availablePickupSLA =
        availablePickupLI && this.findSla(availablePickupLI, pickupPoint)

      const availablePickupOptionsWithoutDistance = availablePickupOptions.map(
        option => ({
          ...option,
          pickupDistance: null,
        })
      )
      const availablePickupPointsWithoutDistance = availablePickupPoints.map(
        option => ({
          ...option,
          distance: null,
        })
      )

      const newPickupOptions = uniqBy(
        [...pickupOptions, ...availablePickupOptionsWithoutDistance],
        'id'
      )

      const newBestPickupOptions = uniqBy(
        [...bestPickupOptions, ...availablePickupOptionsWithoutDistance],
        'id'
      )

      const newPickupPoints = uniqBy(
        [...pickupPoints, ...availablePickupPointsWithoutDistance],
        'id'
      )

      const newLogisticsInfo = logisticsInfo.map((li, index) => ({
        ...li,
        slas: [
          ...li.slas,
          ...(data.logisticsInfo ? [...data.logisticsInfo[index].slas] : []),
        ],
      }))

      this.setState(
        {
          selectedPickupPoint: availablePickupSLA || pickupPoint,
          pickupPoints: sortBy(newPickupPoints, 'distance'),
          pickupOptions: sortBy(newPickupOptions, 'pickupDistance'),
          bestPickupOptions: newBestPickupOptions,
          logisticsInfo: newLogisticsInfo,
          isSearching: false,
        },
        () => this.setActiveSidebarState(DETAILS)
      )
    })
  }

  render() {
    const { children } = this.props
    const {
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
      selectedPickupPoint,
      shouldSearchArea,
    } = this.state

    return (
      <ModalStateContext.Provider
        value={{
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
