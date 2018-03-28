import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'

import geolocationAutoCompleteAddress from '@vtex/address-form/lib/geolocation/geolocationAutoCompleteAddress'
import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'

import markerIconBlue from '../assets/icons/marker_blue.svg'
import markerIconSelected from '../assets/icons/marker_selected.svg'

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      icon: markerIconBlue,
      selectedIcon: markerIconSelected,
      isMounted: false,
    }
    this.mapMounted = this.mapMounted.bind(this)
  }

  shouldComponentUpdate(prevProps) {
    const rulesChanged = prevProps.rules.country !== this.props.rules.country
    const loadingChanged = prevProps.loadingGoogle !== this.props.loadingGoogle
    const screenSizeChanged = prevProps.largeScreen !== this.props.largeScreen
    const addressChanged =
      prevProps.address.geoCoordinates.value !==
      this.props.address.geoCoordinates.value
    const pickupGeolocationsChanged =
      prevProps.pickupOptions !== this.props.pickupOptions
    const pickupOptionsChanged =
      prevProps.pickupOptionGeolocations !== this.props.pickupOptionGeolocations
    const pickupPointChanged =
      prevProps.pickupPoint &&
      this.props.pickupPoint &&
      prevProps.pickupPoint.id !== this.props.pickupPoint.id
    return (
      rulesChanged ||
      loadingChanged ||
      screenSizeChanged ||
      addressChanged ||
      pickupOptionsChanged ||
      pickupPointChanged ||
      pickupGeolocationsChanged
    )
  }

  componentWillUnmount() {
    this.setState({ isMounted: false })
    this.markerListeners &&
      this.markerListeners.forEach(item =>
        this.props.googleMaps.event.removeListener(item.markerListener)
      )
  }

  getPickupGeolocationString = geolocations =>
    geolocations.reduce(
      (accumulatedString, currentGeolocation) =>
        currentGeolocation.length > 0
          ? accumulatedString + currentGeolocation[0]
          : '',
      ''
    )

  componentWillReceiveProps(nextProps) {
    const { googleMaps, pickupOptionGeolocations, address } = this.props

    const selectedGeolocation = nextProps.pickupOptions.find(
      item => nextProps.pickupPoint && item.id === nextProps.pickupPoint.id
    )

    if (
      address.geoCoordinates &&
      address.geoCoordinates.value[0] !==
        nextProps.address.geoCoordinates.value[0]
    ) {
      this.map.setZoom(15)
    }

    this.address = nextProps.address

    const thisPickupOptions = this.getPickupGeolocationString(
      pickupOptionGeolocations
    )
    const nextPickupOptions = this.getPickupGeolocationString(
      nextProps.pickupOptionGeolocations
    )

    if (thisPickupOptions !== nextPickupOptions) {
      this.createNewMarkers({
        pickups: nextProps.pickupOptionGeolocations,
        pickupOptions: nextProps.pickupOptions,
        pickupPoint: nextProps.pickupPoint,
        selectedPickupPointGeolocation:
          nextProps.selectedPickupPointGeolocation,
        recenter: false,
      })
    }

    const markerObj =
      this.markers &&
      this.markers.find(
        item =>
          nextProps.pickupPoint && item.pickupPoint === nextProps.pickupPoint.id
      )

    const activeMarkerObj =
      this.markers &&
      this.markers.find(
        item =>
          nextProps.activePickupPoint &&
          item.pickupPoint === nextProps.activePickupPoint.id
      )

    if (
      nextProps.isPickupDetailsActive &&
      selectedGeolocation &&
      selectedGeolocation.pickupStoreInfo.address.geoCoordinates.length > 0 &&
      googleMaps &&
      markerObj
    ) {
      this.recenterMap(
        this.getLocation(
          selectedGeolocation.pickupStoreInfo.address.geoCoordinates
        )
      )
      this.resetMarkers()
      markerObj.marker.setIcon(this.state.selectedIcon)
      return
    }

    if (
      ((nextProps.address.geoCoordinates.value.length > 0 &&
        nextProps.pickupOptions.length > 1) ||
        nextProps.address.geoCoordinates.value !==
          this.props.address.geoCoordinates.value) &&
      googleMaps
    ) {
      this.recenterMap(this.getLocation(nextProps.address.geoCoordinates.value))
      this.resetMarkers()
      activeMarkerObj && activeMarkerObj.marker.setIcon(this.state.selectedIcon)
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

    this.createNewMarkers({
      pickups: this.props.pickupOptionGeolocations,
      pickupOptions: this.props.pickupOptions,
      pickupPoint: this.props.pickupPoint,
      selectedPickupPointGeolocation: this.props.selectedPickupPointGeolocation,
      recenter: true,
      ...(this.props.address.geoCoordinates.length > 0
        ? { address: this.props.address }
        : {}),
    })
  }

  createMap = (mapElement, geoCoordinates) => {
    const { googleMaps, largeScreen } = this.props

    this._mapElement = mapElement

    const mapOptions = {
      zoom: 14,
      mapTypeControl: false,
      zoomControl: true,
      fullscreenControl: false,
      streetViewControl: false,
      color: '#00ff00',
      zoomControlOptions: {
        position: googleMaps.ControlPosition.CENTER_RIGHT,
        style: googleMaps.ZoomControlStyle.SMALL,
      },
      ...(geoCoordinates && geoCoordinates.length > 0
        ? {
          center: this.getLocation(geoCoordinates),
        }
        : {}),
    }

    this.map = new googleMaps.Map(this._mapElement, mapOptions)
  }

  createNewMarkers = ({
    pickups,
    pickupOptions,
    pickupPoint,
    selectedPickupPointGeolocation,
    recenter,
    address,
  }) => {
    const locations = pickups
      .map(pickup => (pickup.length > 0 ? this.getLocation(pickup) : undefined))
      .filter(item => item)

    const {
      changeActivePickupDetails,
      activatePickupDetails,
      googleMaps,
      activePickupPoint,
    } = this.props

    if (!this.map) return
    let bounds = null

    if (address && address.geoCoordinates.value.length === 0) {
      bounds = new googleMaps.LatLngBounds()
    }

    this.markerListeners = []
    this.markers = []

    locations &&
      locations.forEach((location, index) => {
        const markerOptions = {
          position: location,
          draggable: false,
          map: this.map,
          icon:
            (pickupPoint && pickupPoint.id === pickupOptions[index].id) ||
            (activePickupPoint &&
              activePickupPoint.id === pickupOptions[index].id)
              ? this.state.selectedIcon
              : this.state.icon,
        }

        if (address && address.geoCoordinates.value.length === 0) {
          bounds.extend(location)
        }

        const marker = new googleMaps.Marker(markerOptions)

        const positionListener = googleMaps.event.addListener(
          marker,
          'position_changed',
          debounce(() => {
            const newPosition = this.marker.getPosition()
            this.handleMarkerPositionChange(newPosition)
          }, 1500)
        )

        const markerListener = googleMaps.event.addListener(
          marker,
          'click',
          () => {
            this.resetMarkers()
            marker.setIcon(this.state.selectedIcon)
            changeActivePickupDetails({ pickupPoint: pickupOptions[index] })
            activatePickupDetails(true)
          }
        )

        this.markerListeners.push({
          markerListener,
          pickupPoint: pickupOptions[index].id,
        })

        this.markers.push({
          marker,
          pickupPoint: pickupOptions[index].id,
        })

        this.markerListeners.push(positionListener)

        if (address && address.geoCoordinates.value.length === 0) {
          this.map.fitBounds(bounds)
        }

        if (
          selectedPickupPointGeolocation &&
          selectedPickupPointGeolocation.length > 0 &&
          recenter
        ) {
          this.recenterMap(this.getLocation(selectedPickupPointGeolocation))
        }
      })
  }

  resetMarkers = () =>
    this.markers &&
    this.markers.forEach(markerObj => markerObj.marker.setIcon(this.state.icon))

  recenterMap = location => {
    if (!this.map) return

    this.map.panTo(location)

    if (!this.props.largeScreen) return

    this.map.panBy(-200, 0)
  }

  setZoom = zoom => {
    if (!this.map) return

    this.map.setZoom(zoom)
  }

  getLocation = geoCoordinates => {
    if (!this.props.googleMaps) return
    const [lng, lat] = geoCoordinates
    const location = new this.props.googleMaps.LatLng(lat, lng)
    return location
  }

  isDifferentGeoCoords(a, b) {
    return a[0] !== b[0] || a[1] !== b[1]
  }

  handleMarkerPositionChange = newPosition => {
    if (!this.geocoder) {
      this.geocoder = new this.props.googleMaps.Geocoder()
    }

    this.geocoder.geocode(
      { location: newPosition },
      this.handleNewMarkerPosition
    )
  }

  handleNewMarkerPosition = (results, status) => {
    const { googleMaps, onChangeAddress, rules } = this.props

    if (status === googleMaps.GeocoderStatus.OK) {
      if (results[0]) {
        const googleAddress = results[0]
        const autoCompletedAddress = geolocationAutoCompleteAddress(
          this.address,
          googleAddress,
          rules
        )
        onChangeAddress(autoCompletedAddress)
      }
    } else {
      console.warn(`Google Maps Error: ${status}`)
    }
  }

  render() {
    return this.props.loadingGoogle ? (
      this.props.loadingElement
    ) : (
      <div id="map-canvas" ref={this.mapMounted} {...this.props.mapProps} />
    )
  }
}

Map.defaultProps = {
  loadingElement: <div />,
}

Map.propTypes = {
  address: AddressShapeWithValidation,
  activePickupPoint: PropTypes.object,
  changeActivePickupDetails: PropTypes.func.isRequired,
  activatePickupDetails: PropTypes.func.isRequired,
  geoCoordinates: PropTypes.array,
  googleMaps: PropTypes.object,
  isPickupDetailsActive: PropTypes.bool,
  largeScreen: PropTypes.bool,
  loadingElement: PropTypes.node,
  loadingGoogle: PropTypes.bool,
  mapProps: PropTypes.object,
  onChangeAddress: PropTypes.func.isRequired,
  pickupOptionGeolocations: PropTypes.array,
  pickupOptions: PropTypes.array.isRequired,
  pickupPoint: PropTypes.object,
  rules: PropTypes.object.isRequired,
  selectedPickupPointGeolocation: PropTypes.array,
}

export default Map
