import React, { Component } from 'react'
import PropTypes from 'prop-types'
import sortBy from 'lodash/sortBy'

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
  BEST_PICKUPS_AMOUNT,
} from './constants'
import { fetchExternalPickupPoints, getAvailablePickups } from './fetchers'
import { getPickupOptions, getUniquePickupPoints } from './utils/pickupUtils'
import { getPickupSlaString } from './utils/GetString'
import { getBestPickupPoints } from './utils/bestPickups'
import {
  isCurrentState,
  isDifferentGeoCoords,
  getInitialActiveState,
  getInitialActiveSidebarState,
  isCurrentStateFromAllStates,
} from './utils/StateUtils'
import { findSla } from './utils/SlasUtils'
import { newAddress } from './utils/newAddress'

class ModalState extends Component {
  constructor(props) {
    super(props)

    this.state = {
      askForGeolocation: props.askForGeolocation,
      activeSidebarState: getInitialActiveSidebarState(props),
      activeState: getInitialActiveState(props),
      bestPickupOptions: getBestPickupPoints(
        props.pickupOptions,
        props.items,
        props.logisticsInfo
      ),
      externalPickupPoints: [],
      geolocationStatus: PROMPT,
      isSelectedBestPickupPoint: false,
      isSearching: props.isSearching,
      lastState: '',
      lastSidebarState: '',
      lastMapCenterLatLng: null,
      localSearching: false,
      logisticsInfo: props.logisticsInfo,
      pickupOptions: props.pickupOptions,
      pickupPoints: props.pickupPoints,
      residentialAddress: props.residentialAddress,
      searchedAreaNoPickups: false,
      hoverPickupPoint: null,
      selectedPickupPoint: props.selectedPickupPoint || props.activePickupPoint,
      shouldSearchArea: false,
      showOtherPickupPoints: false,
    }
  }

  componentDidMount() {
    const thisAddressCoords =
      this.props.address &&
      this.props.address.geoCoordinates &&
      this.props.address.geoCoordinates.value

    if (thisAddressCoords && thisAddressCoords.length > 0) {
      this.getExternalPickupOptions(thisAddressCoords)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      address,
      items,
      isSearching,
      mapStatus,
      logisticsInfo,
      pickupOptions,
      pickupPoints,
    } = this.props

    const {
      activeSidebarState,
      activeState,
      askForGeolocation,
      selectedPickupPoint,
    } = this.state

    const thisAddressCoords =
      address && address.geoCoordinates && address.geoCoordinates.value

    const prevAddressCoords = prevProps.address.geoCoordinates.value

    const thisPickupOptions = getPickupSlaString(pickupOptions)
    const prevPickupOptions = getPickupSlaString(prevProps.pickupOptions)

    const prevIsSearching = prevProps.isSearching
    const prevActiveSidebarState = prevState.activeSidebarState

    if (mapStatus !== prevProps.mapStatus) {
      this.setShouldSearchArea(false)
    }

    if (
      prevActiveSidebarState !== activeSidebarState &&
      activeSidebarState === ERROR_NOT_FOUND
    ) {
      this.setState({ searchedAreaNoPickups: true })

      return
    }

    if (isSearching !== prevIsSearching) {
      this.setState({ isSearching })

      const isSearchingState =
        isSearching &&
        !isCurrentState(SEARCHING, activeState) &&
        !isCurrentState(SEARCHING, activeSidebarState)

      if (isSearchingState) {
        if (isCurrentState(SIDEBAR, activeState)) {
          this.setActiveSidebarState(SEARCHING)
        } else {
          this.setActiveState(SEARCHING)
        }
      }
    }

    if (isDifferentGeoCoords(thisAddressCoords, prevAddressCoords)) {
      this.getExternalPickupOptions(thisAddressCoords)
    }

    if (thisPickupOptions !== prevPickupOptions) {
      this.setState({
        pickupOptions,
        pickupPoints,
        logisticsInfo,
        searchedAreaNoPickups: thisPickupOptions.length === 0,
        bestPickupOptions: getBestPickupPoints(
          pickupOptions,
          items,
          logisticsInfo
        ),
      })

      if (thisPickupOptions.length > 0) {
        this.setActiveSidebarState(LIST)
      }
    }

    const hasPickups = pickupOptions.length > 0
    const previousHasPickups = prevProps.pickupOptions.length > 0

    const isDetailsNoSelectedPickupPoint =
      isCurrentState(DETAILS, activeSidebarState) && !selectedPickupPoint

    const isSidebarState =
      !isSearching &&
      hasPickups &&
      (isCurrentState(SEARCHING, activeState) ||
        isCurrentState(GEOLOCATION_SEARCHING, activeState))

    const isListState =
      !isSearching &&
      hasPickups &&
      isCurrentState(SEARCHING, activeSidebarState)

    const isGeolocationSearchingState =
      askForGeolocation && !isCurrentState(SIDEBAR, activeState)

    const isErrorNopickupsState =
      !isSearching &&
      !hasPickups &&
      !previousHasPickups &&
      !isCurrentState(INITIAL, activeState) &&
      !isCurrentState(GEOLOCATION_SEARCHING, activeState)

    switch (true) {
      case isListState:
        if (activeSidebarState === LIST) return
        this.setActiveSidebarState(LIST)

      // TODO: is this fallthrough intentional?
      // eslint-disable-next-line no-fallthrough
      case isDetailsNoSelectedPickupPoint:

      // eslint-disable-next-line no-fallthrough
      case isSidebarState:
        if (activeState === SIDEBAR) return
        this.setActiveState(SIDEBAR)
        this.setActiveSidebarState(LIST)

        return

      case isGeolocationSearchingState:
        if (activeState === GEOLOCATION_SEARCHING) return
        this.setActiveState(GEOLOCATION_SEARCHING)
        this.setActiveSidebarState(LIST)

        return

      case isErrorNopickupsState:
        if (isCurrentStateFromAllStates(ERROR_NOT_FOUND, this.state)) {
          return
        }

        if (activeState === SIDEBAR) {
          this.setActiveSidebarState(ERROR_NOT_FOUND)
        } else {
          this.setActiveState(ERROR_NOT_FOUND)
        }

        break

      default:
    }
  }

  setMapCenterLatLng = (lastMapCenterLatLng) =>
    this.setState({ lastMapCenterLatLng })

  setShowOtherPickupPoints = (showOtherPickupPoints) =>
    this.setState({ showOtherPickupPoints })

  setAskForGeolocation = (askForGeolocation) =>
    this.setState({ askForGeolocation })

  setShouldSearchArea = (shouldSearchArea) =>
    this.setState((prevState) => ({
      shouldSearchArea,
      searchedAreaNoPickups:
        shouldSearchArea && prevState.searchedAreaNoPickups
          ? false
          : prevState.searchedAreaNoPickups,
    }))

  setGeolocationStatus = (status) =>
    this.setState({ geolocationStatus: status })

  setActiveState = (state) =>
    this.setState((prevState) => ({
      lastState: prevState.activeState,
      activeState: state,
      searchedAreaNoPickups: false,
    }))

  setActiveSidebarState = (state) => {
    this.setState((prevState) => ({
      lastSidebarState: prevState.activeSidebarState,
      activeSidebarState: state,
      searchedAreaNoPickups: false,
    }))
  }

  selectPreviousPickupPoint = () => {
    const { bestPickupOptions, selectedPickupPoint } = this.state
    const previousIndex =
      bestPickupOptions
        .map((pickupPoint) => pickupPoint.id)
        .indexOf(selectedPickupPoint.id) - 1

    if (previousIndex < 0) return

    this.setSelectedPickupPoint({
      pickupPoint: bestPickupOptions[previousIndex],
      isBestPickupPoint: previousIndex < BEST_PICKUPS_AMOUNT,
    })
  }

  selectNextPickupPoint = () => {
    const { bestPickupOptions, selectedPickupPoint } = this.state
    const nextIndex =
      bestPickupOptions
        .map((pickupPoint) => pickupPoint.id)
        .indexOf(selectedPickupPoint.id) + 1

    if (nextIndex > bestPickupOptions.length - 1) return

    this.setSelectedPickupPoint({
      pickupPoint: bestPickupOptions[nextIndex],
      isBestPickupPoint: nextIndex < BEST_PICKUPS_AMOUNT,
    })
  }

  setHoverPickupPoint = (pickupPoint) => {
    this.setState({ hoverPickupPoint: pickupPoint })
  }

  setSelectedPickupPoint = ({ pickupPoint, isBestPickupPoint }) => {
    const { orderFormId, salesChannel } = this.props
    const { logisticsInfo } = this.state

    if (!pickupPoint) {
      this.setState({
        selectedPickupPoint: null,
        activeSidebarState: LIST,
        isSelectedBestPickupPoint: false,
      })

      return
    }

    const pickupAddress = pickupPoint.pickupStoreInfo
      ? pickupPoint.pickupStoreInfo.address
      : pickupPoint.address

    if (pickupPoint.pickupStoreInfo) {
      this.setState({
        selectedPickupPoint: pickupPoint,
        activeSidebarState: DETAILS,
        isSelectedBestPickupPoint: isBestPickupPoint,
      })

      return
    }

    this.setActiveSidebarState(SEARCHING)
    this.setState({ localSearching: true })

    getAvailablePickups({
      logisticsInfo,
      salesChannel,
      orderFormId,
      pickupAddress,
    })
      .then((response) =>
        this.updatePickupPoints({
          data: response.data,
          pickupPoint,
          isBestPickupPoint,
        })
      )
      .catch(() => {
        this.setState(
          {
            selectedPickupPoint: pickupPoint,
            isSelectedBestPickupPoint: isBestPickupPoint,
            localSearching: false,
          },
          () => this.setActiveSidebarState(DETAILS)
        )
      })
  }

  searchPickupsInArea = (geoCoordinates, address) => {
    const { orderFormId, salesChannel } = this.props
    const { logisticsInfo } = this.state

    this.setShouldSearchArea(false)
    this.setActiveSidebarState(LIST)
    this.setActiveSidebarState(SEARCHING)

    const newAreaAddress = newAddress({
      geoCoordinates: [geoCoordinates.lng(), geoCoordinates.lat()],
      country: address.country.value,
    })

    getAvailablePickups({
      logisticsInfo,
      salesChannel,
      orderFormId,
      pickupAddress: newAreaAddress,
    })
      .then((response) => this.updatePickupPoints({ data: response.data }))
      .catch(() => {
        this.setActiveSidebarState(LIST)
        this.setState({ localSearching: false })
      })
  }

  updatePickupPoints = ({ data, pickupPoint, isBestPickupPoint }) => {
    const {
      bestPickupOptions,
      externalPickupPoints,
      logisticsInfo,
      pickupOptions,
      pickupPoints,
    } = this.state

    const availablePickupOptions =
      data.logisticsInfo && getPickupOptions(data.logisticsInfo)

    const availablePickupPoints = data.pickupPoints

    const newPickupOptions = getUniquePickupPoints(
      pickupOptions,
      availablePickupOptions
    )

    const newBestPickupOptions = getUniquePickupPoints(
      bestPickupOptions,
      availablePickupOptions
    )

    const newPickupPoints = getUniquePickupPoints(
      pickupPoints,
      availablePickupPoints
    )

    const newExternalPickupPoints = externalPickupPoints.filter(
      (externalPickup) =>
        !newBestPickupOptions.some(
          (option) => option.pickupPointId === externalPickup.id
        )
    )

    const newLogisticsInfo = logisticsInfo.map((li, index) => ({
      ...li,
      slas: [
        ...li.slas,
        ...(data.logisticsInfo ? [...data.logisticsInfo[index].slas] : []),
      ],
    }))

    if (pickupPoint) {
      const availablePickupLI =
        data.logisticsInfo &&
        data.logisticsInfo.find((li) => findSla(li, pickupPoint))

      const availablePickupSLA =
        availablePickupLI && findSla(availablePickupLI, pickupPoint)

      this.setState(
        {
          selectedPickupPoint: availablePickupSLA || pickupPoint,
          isSelectedBestPickupPoint: isBestPickupPoint,
          pickupPoints: this.removePickupDistance(
            sortBy(newPickupPoints, 'distance')
          ),
          pickupOptions: this.removePickupDistance(
            sortBy(newPickupOptions, 'pickupDistance')
          ),
          bestPickupOptions: this.removePickupDistance(newBestPickupOptions),
          externalPickupPoints: newExternalPickupPoints,
          logisticsInfo: newLogisticsInfo,
        },
        () => this.setActiveSidebarState(DETAILS)
      )
    } else {
      this.setState(
        {
          pickupPoints: this.removePickupDistance(
            sortBy(newPickupPoints, 'distance')
          ),
          pickupOptions: this.removePickupDistance(
            sortBy(newPickupOptions, 'pickupDistance')
          ),
          bestPickupOptions: this.removePickupDistance(newBestPickupOptions),
          externalPickupPoints: newExternalPickupPoints,
          logisticsInfo: newLogisticsInfo,
        },
        () =>
          this.setActiveSidebarState(
            newPickupPoints.length > 0 ? LIST : ERROR_NOT_FOUND
          )
      )
    }
  }

  removePickupDistance = (pickupPoints) => {
    return pickupPoints.map((pickup) => ({
      ...pickup,
      distance: null,
      pickupDistance: null,
    }))
  }

  getExternalPickupOptions = (geoCoordinates) => {
    const { bestPickupOptions, externalPickupPoints } = this.state

    fetchExternalPickupPoints(geoCoordinates)
      .then((data) =>
        this.setState({
          externalPickupPoints: data.items
            .filter(
              (item) =>
                !bestPickupOptions.some(
                  (option) => option.pickupPointId === item.pickupPoint.id
                )
            )
            .map((item) => ({
              ...item.pickupPoint,
              distance: null,
            })),
        })
      )
      .catch(() => this.setState({ externalPickupPoints }))
  }

  render() {
    const { children } = this.props
    const {
      activeState,
      activeSidebarState,
      bestPickupOptions,
      externalPickupPoints,
      geolocationStatus,
      hoverPickupPoint,
      isSearching,
      isSelectedBestPickupPoint,
      lastState,
      lastSidebarState,
      lastMapCenterLatLng,
      logisticsInfo,
      pickupOptions,
      pickupPoints,
      residentialAddress,
      searchedAreaNoPickups,
      selectedPickupPoint,
      shouldSearchArea,
      showOtherPickupPoints,
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
          isSelectedBestPickupPoint,
          hoverPickupPoint,
          lastState,
          lastSidebarState,
          lastMapCenterLatLng,
          logisticsInfo,
          pickupOptions,
          pickupPoints,
          residentialAddress,
          searchedAreaNoPickups,
          searchPickupsInArea: this.searchPickupsInArea,
          selectNextPickupPoint: this.selectNextPickupPoint,
          selectPreviousPickupPoint: this.selectPreviousPickupPoint,
          selectedPickupPoint,
          setActiveState: this.setActiveState,
          setAskForGeolocation: this.setAskForGeolocation,
          setActiveSidebarState: this.setActiveSidebarState,
          setGeolocationStatus: this.setGeolocationStatus,
          setHoverPickupPoint: this.setHoverPickupPoint,
          setMapCenterLatLng: this.setMapCenterLatLng,
          setSelectedPickupPoint: this.setSelectedPickupPoint,
          shouldSearchArea,
          setShouldSearchArea: this.setShouldSearchArea,
          setShowOtherPickupPoints: this.setShowOtherPickupPoints,
          showOtherPickupPoints,
        }}
      >
        {children}
      </ModalStateContext.Provider>
    )
  }
}

ModalState.propTypes = {
  children: PropTypes.any.isRequired,
  askForGeolocation: PropTypes.bool,
  items: PropTypes.array,
  pickupOptions: PropTypes.array,
  logisticsInfo: PropTypes.array,
  isSearching: PropTypes.bool,
  pickupPoints: PropTypes.array,
  residentialAddress: PropTypes.object,
  selectedPickupPoint: PropTypes.object,
  activePickupPoint: PropTypes.object,
  address: PropTypes.object,
  mapStatus: PropTypes.string,
  orderFormId: PropTypes.string,
  salesChannel: PropTypes.string,
}

export default ModalState
