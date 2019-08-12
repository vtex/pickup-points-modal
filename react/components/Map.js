import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'
import markerIcon from '../assets/icons/marker.svg'
import bestMarkerIcon from '../assets/icons/best_marker.svg'
import personPin from '../assets/icons/person_pin.svg'
import searchMarkerIcon from '../assets/icons/search_marker_icon.svg'
import searchingMarkerIcon from '../assets/icons/searching_marker_icon.svg'

import { getPickupGeolocationString } from '../utils/GetString'
import { injectState } from '../modalStateContext'
import { LIST, BEST_PICKUPS_AMOUNT, HIDE_MAP } from '../constants'
import { getPickupPointGeolocations } from '../utils/pickupUtils'

const BIG_MARKER_WIDTH = 38
const BIG_MARKER_HEIGHT = 49
const MARKER_WIDTH = 25
const MARKER_HEIGHT = 31
const STANDARD_ZOOM = 14
const PAN_LEFT_LAT = -160
const PAN_LEFT_LNG = -30

class Map extends Component {
  constructor(props) {
    super(props)

    this.center = this.getLocation(props.address.geoCoordinates.value)

    this.state = {
      isMounted: false,
      mapStyles: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        zIndex: 0,
      },
    }
  }

  shouldComponentUpdate(prevProps) {
    const {
      address,
      isLargeScreen,
      isLoadingGoogle,
      externalPickupPoints,
      pickupPoints,
      pickupPoint,
      rules,
      selectedPickupPoint,
    } = this.props

    const thisPickupOptions =
      prevProps.pickupPoints &&
      getPickupGeolocationString(
        getPickupPointGeolocations(prevProps.pickupPoints)
      )
    const prevPickupOptions =
      pickupPoints &&
      getPickupGeolocationString(getPickupPointGeolocations(pickupPoints))

    const thisExternalPickupPoints =
      prevProps.externalPickupPoints &&
      getPickupGeolocationString(
        prevProps.externalPickupPoints.map(
          pickup => pickup.address.geoCoordinates
        )
      )
    const prevExternalPickupPoints =
      externalPickupPoints &&
      getPickupGeolocationString(
        externalPickupPoints.map(pickup => pickup.address.geoCoordinates)
      )

    const rulesChanged = prevProps.rules.country !== rules.country
    const loadingChanged = prevProps.isLoadingGoogle !== isLoadingGoogle
    const screenSizeChanged = prevProps.isLargeScreen !== isLargeScreen
    const addressChanged =
      prevProps.address.geoCoordinates.value !== address.geoCoordinates.value
    const pickupGeolocationsChanged = thisPickupOptions !== prevPickupOptions
    const externalPickupPointsChanged =
      thisExternalPickupPoints !== prevExternalPickupPoints
    const selectedPickupPointChanged =
      prevProps.selectedPickupPoint !== selectedPickupPoint
    const pickupPointChanged =
      prevProps.pickupPoint &&
      pickupPoint &&
      prevProps.pickupPoint.id !== pickupPoint.id

    return (
      rulesChanged ||
      loadingChanged ||
      screenSizeChanged ||
      addressChanged ||
      pickupPointChanged ||
      pickupGeolocationsChanged ||
      selectedPickupPointChanged ||
      externalPickupPointsChanged
    )
  }

  componentWillUnmount() {
    this.setState({ isMounted: false })
    this.removeListeners()
  }

  componentDidUpdate(prevProps) {
    const {
      googleMaps,
      pickupPoints,
      externalPickupPoints,
      selectedPickupPoint,
    } = this.props

    this.center = this.getLocation(this.props.address.geoCoordinates.value)

    const thisPickupOptions =
      prevProps.pickupPoints &&
      getPickupGeolocationString(
        getPickupPointGeolocations(prevProps.pickupPoints)
      )
    const prevPickupOptions =
      pickupPoints &&
      getPickupGeolocationString(getPickupPointGeolocations(pickupPoints))

    const thisExternalPickupPoints =
      prevProps.externalPickupPoints &&
      getPickupGeolocationString(
        prevProps.externalPickupPoints.map(
          pickup => pickup.address.geoCoordinates
        )
      )
    const prevExternalPickupPoints =
      externalPickupPoints &&
      getPickupGeolocationString(
        externalPickupPoints.map(pickup => pickup.address.geoCoordinates)
      )

    const nextAddressCoords =
      this.props.address &&
      this.props.address.geoCoordinates &&
      this.props.address.geoCoordinates.value
    const thisAddressCoords = prevProps.address.geoCoordinates.value
    const markerObj =
      this.markers &&
      this.markers.find(
        item =>
          this.props.selectedPickupPoint &&
          item.pickupPoint === this.props.selectedPickupPoint.id
      )

    if (
      nextAddressCoords &&
      this.isDifferentGeoCoords(nextAddressCoords, thisAddressCoords) &&
      googleMaps
    ) {
      this.recenterMap(this.getLocation(nextAddressCoords))
      this.resetMarkers(this.getLocation(nextAddressCoords))
      markerObj &&
        this.setIcon({
          marker: markerObj.marker,
          width: BIG_MARKER_WIDTH,
          height: BIG_MARKER_HEIGHT,
        })
    }

    if (
      thisPickupOptions !== prevPickupOptions ||
      thisExternalPickupPoints !== prevExternalPickupPoints
    ) {
      this.searchMarkers.forEach(markerObj => {
        markerObj.marker.setMap(null)
        googleMaps.event.removeListener(markerObj.markerClickListener)
        googleMaps.event.removeListener(markerObj.markerHoverListener)
        googleMaps.event.removeListener(markerObj.markerHoverOutListener)
      })
      this.searchMarkers = []
      this.resetMarkers()
      this.createNewMarkers(false)
    }

    const isInBounds =
      markerObj && this.map.getBounds().contains(markerObj.marker.getPosition())

    if (
      markerObj &&
      selectedPickupPoint !== prevProps.selectedPickupPoint &&
      !isInBounds
    ) {
      const geoCoordinates = selectedPickupPoint.pickupStoreInfo
        ? selectedPickupPoint.pickupStoreInfo.address.geoCoordinates
        : selectedPickupPoint.address.geoCoordinates
      this.recenterMap(this.getLocation(geoCoordinates))
      this.resetMarkers()
      this.setIcon({
        marker: markerObj.marker,
        width: BIG_MARKER_WIDTH,
        height: BIG_MARKER_HEIGHT,
      })
      return
    }
  }

  mapMounted = mapElement => {
    if (!mapElement) {
      this.map = null
      this.marker = null
      return
    }

    const geoCoordinates =
      this.props.address.geoCoordinates.value.length > 0
        ? this.props.address.geoCoordinates.value
        : this.props.activePickupPoint
          ? this.props.activePickupPoint.pickupStoreInfo.address.geoCoordinates
          : []

    this.createMap(mapElement, geoCoordinates)

    if (geoCoordinates.length > 0) {
      this.recenterMap(this.getLocation(geoCoordinates))
    }

    this.createNewMarkers()
  }

  toggleSearchArea = () => {
    const newCenter = this.map && this.map.getCenter()

    if (!newCenter || !this.center) return

    const differenceLat = (this.center.lat() - newCenter.lat()) * 1000
    const differenceLng = (this.center.lng() - newCenter.lng()) * 1000

    const DISTANCE = 50

    const outerLat = differenceLat > DISTANCE || differenceLat < -DISTANCE
    const outerLng = differenceLng > DISTANCE || differenceLng < -DISTANCE

    this.props.setShouldSearchArea(outerLat || outerLng)
    this.props.setMapCenterLatLng(newCenter)
  }

  createMap = mapElement => {
    const { googleMaps, setActiveSidebarState } = this.props

    this._mapElement = mapElement

    const mapOptions = {
      zoom: 14,
      disableDefaultUI: true,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      color: '#00ff00',
      clickableIcons: false,
      styles: [
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'transit',
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }],
        },
      ],
    }

    this.map = new googleMaps.Map(this._mapElement, mapOptions)

    this.markers = []

    this.searchMarkers = []

    /* eslint-disable new-cap */
    this.centerChanged = new googleMaps.event.addListener(
      this.map,
      'dragend',
      () => {
        this.toggleSearchArea()
      }
    )

    const zoomIn = document.querySelector('.pkpmodal-zoom-in')
    const zoomOut = document.querySelector('.pkpmodal-zoom-out')

    this.mapClickEvent = googleMaps.event.addListener(this.map, 'click', () => {
      setActiveSidebarState(LIST)
      this.resetMarkers()
    })

    zoomIn.onclick = () => this.map.setZoom(this.map.getZoom() + 1)
    zoomOut.onclick = () => this.map.setZoom(this.map.getZoom() - 1)

    this.map.controls[googleMaps.ControlPosition.RIGHT_BOTTOM].push(
      document.querySelector('.zoom-control')
    )
  }

  removeListeners = () => {
    const { googleMaps } = this.props
    googleMaps.event.removeListener(this.mapClickEvent)
    this.searchMarkers.forEach(markerObj => {
      googleMaps.event.removeListener(markerObj.markerClickListener)
      googleMaps.event.removeListener(markerObj.markerHoverListener)
      googleMaps.event.removeListener(markerObj.markerHoverOutListener)
    })
    this.markers.forEach(markerObj => {
      googleMaps.event.removeListener(markerObj.markerClickListener)
      googleMaps.event.removeListener(markerObj.markerHoverListener)
      googleMaps.event.removeListener(markerObj.markerHoverOutListener)
    })
  }

  createNewMarkers = (shouldResetBounds = true) => {
    const {
      selectedPickupPoint,
      googleMaps,
      pickupPoints,
      bestPickupOptions,
      externalPickupPoints,
      address,
    } = this.props

    const filteredExternalPickupPoints =
      externalPickupPoints &&
      externalPickupPoints.filter(
        pickup =>
          pickupPoints &&
          pickupPoints.length > 0 &&
          !pickupPoints.some(p => p.id.includes(pickup.id))
      )

    const externalLocations =
      filteredExternalPickupPoints &&
      filteredExternalPickupPoints
        .map(pickup => this.getLocation(pickup.address.geoCoordinates))
        .filter(item => item)

    const hasAddressCoords =
      address && address.geoCoordinates.value.length !== 0

    if (!this.map) return
    this.bounds = null

    if (hasAddressCoords && shouldResetBounds) {
      this.bounds = new googleMaps.LatLngBounds()
    }

    const addressLocation =
      hasAddressCoords && this.getLocation(address.geoCoordinates.value)

    if (
      !this.addressMarker &&
      hasAddressCoords &&
      bestPickupOptions.length > 0
    ) {
      const markerOptions = {
        position: addressLocation,
        draggable: false,
        map: this.map,
        icon: personPin,
      }

      if (shouldResetBounds) {
        this.bounds.extend(addressLocation)
      }

      this.addressMarker = new googleMaps.Marker(markerOptions)
    } else if (hasAddressCoords && shouldResetBounds) {
      this.bounds.extend(addressLocation)
    }

    externalLocations &&
      externalLocations.forEach((location, index) => {
        const isScaledMarker =
          selectedPickupPoint &&
          selectedPickupPoint.id === filteredExternalPickupPoints[index].id
        const markerOptions = {
          position: location,
          draggable: false,
          map: this.map,
          icon: {
            url: searchMarkerIcon,
            size: isScaledMarker
              ? new googleMaps.Size(BIG_MARKER_WIDTH, BIG_MARKER_HEIGHT)
              : new googleMaps.Size(MARKER_WIDTH, MARKER_HEIGHT),
            scaledSize: isScaledMarker
              ? new googleMaps.Size(BIG_MARKER_WIDTH, BIG_MARKER_HEIGHT)
              : new googleMaps.Size(MARKER_WIDTH, MARKER_HEIGHT),
          },
        }

        const marker = new googleMaps.Marker(markerOptions)

        this.setupListeners({
          markersList: this.searchMarkers,
          marker,
          pickupPointsList: filteredExternalPickupPoints,
          location,
          index,
        })
      })

    bestPickupOptions &&
      bestPickupOptions
        .filter(pickupPoint => {
          return !this.markers.some(
            markerObj => markerObj.pickupPoint.id === pickupPoint.id
          )
        })
        .forEach((pickupPoint, index) => {
          const location = this.getLocation(
            pickupPoint.pickupStoreInfo.address.geoCoordinates
          )
          const markerIconImage =
            index < BEST_PICKUPS_AMOUNT &&
            bestPickupOptions.length > BEST_PICKUPS_AMOUNT
              ? bestMarkerIcon
              : markerIcon
          const isScaledMarker =
            selectedPickupPoint && selectedPickupPoint.id === pickupPoint.id

          const markerOptions = {
            position: location,
            draggable: false,
            map: this.map,
            icon: {
              url: markerIconImage,
              size: isScaledMarker
                ? new googleMaps.Size(BIG_MARKER_WIDTH, BIG_MARKER_HEIGHT)
                : new googleMaps.Size(MARKER_WIDTH, MARKER_HEIGHT),
              scaledSize: isScaledMarker
                ? new googleMaps.Size(BIG_MARKER_WIDTH, BIG_MARKER_HEIGHT)
                : new googleMaps.Size(MARKER_WIDTH, MARKER_HEIGHT),
            },
          }

          if (this.addressMarker && hasAddressCoords && shouldResetBounds) {
            this.bounds.extend(location)
            if (this.map.getZoom() < STANDARD_ZOOM) {
              this.setZoom(STANDARD_ZOOM)
              this.map.panBy(PAN_LEFT_LAT, PAN_LEFT_LNG)
            }
          }

          const marker = new googleMaps.Marker(markerOptions)

          this.setupListeners({
            markersList: this.markers,
            marker,
            pickupPoint,
            location,
            index,
          })

          if (this.addressMarker && hasAddressCoords && shouldResetBounds) {
            this.map.fitBounds(this.bounds)
            this.map.panBy(PAN_LEFT_LAT, PAN_LEFT_LNG)
          }
        })
  }

  resetMarkers = location => {
    this.markers &&
      this.markers.forEach(markerObj => {
        if (markerObj.pickupPoint) {
          this.setIcon({
            marker: markerObj.marker,
            width: MARKER_WIDTH,
            height: MARKER_HEIGHT,
          })
        }
      })
    this.searchMarkers &&
      this.searchMarkers.forEach(searchMarkerObj => {
        if (searchMarkerObj.pickupPoint) {
          this.setIcon({
            marker: searchMarkerObj.marker,
            width: MARKER_WIDTH,
            height: MARKER_HEIGHT,
          })
        }
      })
    location && this.addressMarker && this.addressMarker.setPosition(location)
  }

  setIcon({ marker, width, height, isSearching }) {
    const { googleMaps } = this.props

    marker.setIcon({
      url: isSearching ? searchingMarkerIcon : marker.icon.url,
      size: new googleMaps.Size(width, height),
      scaledSize: new googleMaps.Size(width, height),
    })
  }

  setupListeners = ({
    markersList,
    marker,
    pickupPoint,
    pickupPointsList,
    index,
  }) => {
    const {
      changeActivePickupDetails,
      googleMaps,
      selectedPickupPoint,
      setSelectedPickupPoint,
      setShouldSearchArea,
      updateLocationTab,
    } = this.props

    const markerClickListener = googleMaps.event.addListener(
      marker,
      'click',
      () => {
        this.resetMarkers()
        this.setIcon({
          marker,
          width: BIG_MARKER_WIDTH,
          height: BIG_MARKER_HEIGHT,
          isSearching: !!pickupPointsList,
        })
        changeActivePickupDetails({
          pickupPoint: pickupPointsList ? pickupPointsList[index] : pickupPoint,
        })
        setSelectedPickupPoint({
          pickupPoint: pickupPointsList ? pickupPointsList[index] : pickupPoint,
          isBestPickupPoint: index < BEST_PICKUPS_AMOUNT,
        })
        updateLocationTab(HIDE_MAP)
        setShouldSearchArea(false)
      }
    )

    const markerHoverListener = googleMaps.event.addListener(
      marker,
      'mouseover',
      () => {
        this.setIcon({
          marker,
          width: BIG_MARKER_WIDTH,
          height: BIG_MARKER_HEIGHT,
        })
      }
    )

    const markerHoverOutListener = googleMaps.event.addListener(
      marker,
      'mouseout',
      () => {
        if (
          selectedPickupPoint &&
          selectedPickupPoint.id ===
            (pickupPointsList ? pickupPointsList[index].id : pickupPoint.id)
        ) {
          return
        }
        this.setIcon({ marker, width: MARKER_WIDTH, height: MARKER_HEIGHT })
      }
    )

    markersList.push({
      marker,
      markerClickListener,
      markerHoverListener,
      markerHoverOutListener,
      pickupPoint: pickupPointsList
        ? pickupPointsList[index].id
        : pickupPoint.id,
    })
  }

  recenterMap = location => {
    if (!this.map) return

    this.map.panTo(location)

    this.props.setMapCenterLatLng(this.map.getCenter())
    this.toggleSearchArea()

    if (!this.props.isLargeScreen) return

    this.map.panBy(PAN_LEFT_LAT, PAN_LEFT_LNG)
  }

  setZoom = zoom => {
    if (!this.map) return

    this.map.setZoom(zoom)
  }

  getLocation = geoCoordinates => {
    if (!this.props.googleMaps || !geoCoordinates) return
    const [lng, lat] = geoCoordinates
    const location = new this.props.googleMaps.LatLng(lat, lng)
    return location
  }

  isDifferentGeoCoords(a, b) {
    return a[0] !== b[0] || a[1] !== b[1]
  }

  render() {
    return this.props.isLoadingGoogle ? (
      this.props.loadingElement
    ) : (
      <div id="map-canvas" ref={this.mapMounted} style={this.state.mapStyles} />
    )
  }
}

Map.defaultProps = {
  loadingElement: <div />,
}

Map.propTypes = {
  activePickupPoint: PropTypes.object,
  activeState: PropTypes.string,
  activatePickupDetails: PropTypes.func.isRequired,
  address: AddressShapeWithValidation,
  bestPickupOptions: PropTypes.array,
  changeActivePickupDetails: PropTypes.func,
  externalPickupPoints: PropTypes.array,
  geoCoordinates: PropTypes.array,
  googleMaps: PropTypes.object,
  isLargeScreen: PropTypes.bool,
  isLoadingGoogle: PropTypes.bool,
  isPickupDetailsActive: PropTypes.bool,
  loadingElement: PropTypes.node,
  onChangeAddress: PropTypes.func.isRequired,
  pickupOptions: PropTypes.array,
  pickupPoint: PropTypes.object,
  pickupPoints: PropTypes.array,
  rules: PropTypes.object.isRequired,
  selectedPickupPoint: PropTypes.object,
  selectedPickupPointGeolocation: PropTypes.array,
  setActiveSidebarState: PropTypes.func.isRequired,
  setMapCenterLatLng: PropTypes.func.isRequired,
  setSelectedPickupPoint: PropTypes.func.isRequired,
  setShouldSearchArea: PropTypes.func.isRequired,
  updateLocationTab: PropTypes.func.isRequired,
}

export default injectState(Map)
