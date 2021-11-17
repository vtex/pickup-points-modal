import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'

import markerIcon from '../assets/icons/marker.svg'
import bestMarkerIcon from '../assets/icons/best_marker.svg'
import personPin from '../assets/icons/person_pin.svg'
import searchMarkerIcon from '../assets/icons/search_marker_icon.svg'
import searchingMarkerIcon from '../assets/icons/searching_marker_icon.svg'
import { injectState } from '../modalStateContext'
import { BEST_PICKUPS_AMOUNT, HIDE_MAP } from '../constants'
import {
  pickupPointSelectionEvent,
  SELECTION_METHOD_MAP,
} from '../utils/metrics'
import { isDifferentGeoCoords } from '../utils/StateUtils'
import { GoogleMap } from './GoogleMap'
import { GoogleMarker } from './GoogleMarker'

const BIG_MARKER_WIDTH = 38
const BIG_MARKER_HEIGHT = 49

const MARKER_WIDTH = 25
const MARKER_HEIGHT = 31

const THIRD_ZINDEX = 3
const FORTH_ZINDEX = 4

class Map extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hoveringIds: new Set(),
      mapCenter: props.address.geoCoordinates.value,
    }

    this.mapRef = React.createRef()
  }

  componentDidUpdate(prevProps) {
    const { selectedPickupPoint } = this.props

    const nextAddressCoords = this.props.address.geoCoordinates.value

    if (
      nextAddressCoords &&
      isDifferentGeoCoords(
        prevProps.address.geoCoordinates.value,
        nextAddressCoords
      )
    ) {
      this.setState({
        mapCenter: nextAddressCoords,
      })
    }

    const bounds = this.mapRef.current.getBounds()

    const geoCoordinates =
      selectedPickupPoint?.pickupStoreInfo?.address?.geoCoordinates ??
      selectedPickupPoint?.address?.geoCoordinates ??
      []

    const isInBounds = bounds?.contains(this.getLocation(geoCoordinates))

    if (selectedPickupPoint !== prevProps.selectedPickupPoint && !isInBounds) {
      this.setState({
        mapCenter: geoCoordinates,
      })
    }
  }

  getLocation = (geoCoordinates) => {
    if (!this.props.googleMaps || !geoCoordinates) return
    const [lng, lat] = geoCoordinates
    const location = new this.props.googleMaps.LatLng(lat, lng)

    return location
  }

  render() {
    const {
      googleMaps,
      selectedPickupPoint,
      address,
      bestPickupOptions,
      externalPickupPoints,
      isLargeScreen,
      pickupPoints,
      isLoadingGoogle,
      loadingElement,
      children,
      changeActivePickupDetails,
      setSelectedPickupPoint,
      updateLocationTab,
      setShouldSearchArea,
    } = this.props

    const { hoveringIds, mapCenter } = this.state

    const filteredExternalPickupPoints = externalPickupPoints?.filter(
      (pickup) =>
        pickupPoints &&
        pickupPoints.length > 0 &&
        !pickupPoints.some((p) => p.id.includes(pickup.id))
    )

    const externalLocations = filteredExternalPickupPoints
      ?.map((pickup) => pickup.address.geoCoordinates)
      .filter((item) => item)

    const hasAddressCoords = address?.geoCoordinates.value.length !== 0

    const bounds = hasAddressCoords ? new googleMaps.LatLngBounds() : null

    if (bounds != null) {
      bounds.extend(this.getLocation(mapCenter))

      bestPickupOptions?.forEach((pickupPoint) => {
        const location = this.getLocation(
          pickupPoint.pickupStoreInfo.address.geoCoordinates
        )

        bounds.extend(location)
      })
    }

    return (
      <GoogleMap
        isLoading={isLoadingGoogle}
        loadingElement={loadingElement}
        isLargeScreen={isLargeScreen}
        center={mapCenter}
        onClick={() => {
          this.setState({
            hoveringIds: new Set(),
          })
          setSelectedPickupPoint({})
        }}
        referenceCenter={address.geoCoordinates.value}
        bounds={bounds}
        ref={this.mapRef}
      >
        {children}
        <GoogleMarker
          icon={personPin}
          position={address.geoCoordinates.value}
          draggable={false}
          zIndex={1}
        />
        {externalLocations.map((location, index) => {
          const pickupPoint = filteredExternalPickupPoints[index]
          const pickupId = pickupPoint.id

          const isScaledMarker =
            selectedPickupPoint?.id === pickupId || hoveringIds.has(pickupId)

          return (
            <GoogleMarker
              key={pickupId}
              position={location}
              draggable={false}
              zIndex={2}
              onClick={() => {
                pickupPointSelectionEvent({
                  selectionMethod: SELECTION_METHOD_MAP,
                })
                changeActivePickupDetails({
                  pickupPoint,
                })
                setSelectedPickupPoint({
                  pickupPoint,
                  isBestPickupPoint: false,
                })
                updateLocationTab(HIDE_MAP)
                setShouldSearchArea(false)
              }}
              onMouseOver={() => {
                this.setState((prevState) => {
                  return {
                    ...prevState,
                    hoveringIds: new Set(prevState.hoveringIds.values()).add(
                      pickupId
                    ),
                  }
                })
              }}
              onMouseOut={() => {
                this.setState((prevState) => {
                  const updatedSet = new Set(prevState.hoveringIds.values())

                  updatedSet.delete(pickupId)

                  return {
                    ...prevState,
                    hoveringIds: updatedSet,
                  }
                })
              }}
              icon={{
                url:
                  selectedPickupPoint?.id === pickupId
                    ? searchingMarkerIcon
                    : searchMarkerIcon,
                size: isScaledMarker
                  ? new googleMaps.Size(BIG_MARKER_WIDTH, BIG_MARKER_HEIGHT)
                  : new googleMaps.Size(MARKER_WIDTH, MARKER_HEIGHT),
                scaledSize: isScaledMarker
                  ? new googleMaps.Size(BIG_MARKER_WIDTH, BIG_MARKER_HEIGHT)
                  : new googleMaps.Size(MARKER_WIDTH, MARKER_HEIGHT),
              }}
            />
          )
        })}
        {bestPickupOptions.map((pickupPoint, index) => {
          const pickupId = pickupPoint.id
          const location = pickupPoint.pickupStoreInfo.address.geoCoordinates

          const markerIconImage =
            index < BEST_PICKUPS_AMOUNT &&
            bestPickupOptions.length > BEST_PICKUPS_AMOUNT
              ? bestMarkerIcon
              : markerIcon

          const isScaledMarker =
            selectedPickupPoint?.id === pickupId || hoveringIds.has(pickupId)

          return (
            <GoogleMarker
              key={pickupId}
              position={location}
              draggable={false}
              zIndex={index < BEST_PICKUPS_AMOUNT ? FORTH_ZINDEX : THIRD_ZINDEX}
              onClick={() => {
                pickupPointSelectionEvent({
                  selectionMethod: SELECTION_METHOD_MAP,
                })
                changeActivePickupDetails({
                  pickupPoint,
                })
                setSelectedPickupPoint({
                  pickupPoint,
                  isBestPickupPoint: index < BEST_PICKUPS_AMOUNT,
                })
                updateLocationTab(HIDE_MAP)
                setShouldSearchArea(false)
              }}
              onMouseOver={() => {
                this.setState((prevState) => {
                  return {
                    ...prevState,
                    hoveringIds: new Set(prevState.hoveringIds.values()).add(
                      pickupId
                    ),
                  }
                })
              }}
              onMouseOut={() => {
                this.setState((prevState) => {
                  const updatedSet = new Set(prevState.hoveringIds.values())

                  updatedSet.delete(pickupId)

                  return {
                    ...prevState,
                    hoveringIds: updatedSet,
                  }
                })
              }}
              icon={{
                url: markerIconImage,
                size: isScaledMarker
                  ? new googleMaps.Size(BIG_MARKER_WIDTH, BIG_MARKER_HEIGHT)
                  : new googleMaps.Size(MARKER_WIDTH, MARKER_HEIGHT),
                scaledSize: isScaledMarker
                  ? new googleMaps.Size(BIG_MARKER_WIDTH, BIG_MARKER_HEIGHT)
                  : new googleMaps.Size(MARKER_WIDTH, MARKER_HEIGHT),
              }}
            />
          )
        })}
      </GoogleMap>
    )
  }
}

Map.defaultProps = {
  loadingElement: <div />,
}

Map.propTypes = {
  googleMaps: PropTypes.object,
  bestPickupOptions: PropTypes.array,
  selectedPickupPoint: PropTypes.object,
  address: AddressShapeWithValidation,
  externalPickupPoints: PropTypes.array,
  isLargeScreen: PropTypes.bool,
  pickupPoints: PropTypes.array,
  isLoadingGoogle: PropTypes.bool,
  loadingElement: PropTypes.node,
  changeActivePickupDetails: PropTypes.func,
  setShouldSearchArea: PropTypes.func.isRequired,
  updateLocationTab: PropTypes.func.isRequired,
  setSelectedPickupPoint: PropTypes.func.isRequired,
  children: PropTypes.node,
}

export default injectState(Map)
