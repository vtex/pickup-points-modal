import React, { Component } from 'react'
import PropTypes from 'prop-types'
import geolocationAutoCompleteAddress from '@vtex/address-form/lib/geolocation/geolocationAutoCompleteAddress'
import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'

import markerIconBlue from '../assets/icons/marker_blue.svg'
import markerIconSelected from '../assets/icons/marker_selected.svg'
import personPin from '../assets/icons/person_pin.svg'

import { getPickupGeolocationString } from '../utils/GetString'

class Map extends Component {
  constructor() {
    super()
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
      rules,
      isLoadingGoogle,
      isLargeScreen,
      address,
      pickupOptions,
      pickupOptionGeolocations,
      pickupPoint,
    } = this.props

    const rulesChanged = prevProps.rules.country !== rules.country
    const loadingChanged = prevProps.isLoadingGoogle !== isLoadingGoogle
    const screenSizeChanged = prevProps.isLargeScreen !== isLargeScreen
    const addressChanged =
      prevProps.address.geoCoordinates.value !== address.geoCoordinates.value
    const pickupGeolocationsChanged = prevProps.pickupOptions !== pickupOptions
    const pickupOptionsChanged =
      prevProps.pickupOptionGeolocations !== pickupOptionGeolocations
    const pickupPointChanged =
      prevProps.pickupPoint &&
      pickupPoint &&
      prevProps.pickupPoint.id !== pickupPoint.id

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
  }

  componentWillReceiveProps(nextProps) {
    const { googleMaps, pickupOptionGeolocations } = this.props

    const selectedGeolocation = nextProps.pickupOptions.find(
      item => nextProps.pickupPoint && item.id === nextProps.pickupPoint.id
    )

    this.address = nextProps.address

    const thisPickupOptions = getPickupGeolocationString(
      pickupOptionGeolocations
    )
    const nextPickupOptions = getPickupGeolocationString(
      nextProps.pickupOptionGeolocations
    )

    const nextAddressCoords = nextProps.address.geoCoordinates.value
    const thisAddressCoords = this.props.address.geoCoordinates.value

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
      ((nextAddressCoords.length > 0 && nextProps.pickupOptions.length > 1) ||
        nextAddressCoords !== thisAddressCoords) &&
      googleMaps
    ) {
      this.recenterMap(this.getLocation(nextAddressCoords))
      this.resetMarkers(this.getLocation(nextAddressCoords))
      activeMarkerObj && activeMarkerObj.marker.setIcon(markerIconSelected)
    }

    if (thisPickupOptions !== nextPickupOptions) {
      this.markers.map(markerObj => markerObj.marker.setMap(null))
      this.createNewMarkers({
        pickups: nextProps.pickupOptionGeolocations,
        address: nextProps.address,
        pickupOptions: nextProps.pickupOptions,
        pickupPoint: nextProps.pickupPoint,
        selectedPickupPointGeolocation:
          nextProps.selectedPickupPointGeolocation,
        recenter: false,
      })
    }

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
      markerObj.marker.setIcon(markerIconSelected)
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

    this.createNewMarkers({
      pickups: this.props.pickupOptionGeolocations,
      pickupOptions: this.props.pickupOptions,
      pickupPoint: this.props.pickupPoint,
      selectedPickupPointGeolocation: this.props.selectedPickupPointGeolocation,
      recenter: true,
      ...(this.props.address.geoCoordinates.value.length > 0
        ? { address: this.props.address }
        : {}),
    })
  }

  createMap = (mapElement, geoCoordinates) => {
    const { googleMaps } = this.props

    this._mapElement = mapElement

    const mapOptions = {
      zoom: 14,
      mapTypeControl: false,
      zoomControl: true,
      fullscreenControl: false,
      streetViewControl: false,
      color: '#00ff00',
      clickableIcons: false,
      zoomControlOptions: {
        position: googleMaps.ControlPosition.CENTER_RIGHT,
        style: googleMaps.ZoomControlStyle.SMALL,
      },
      styles: [
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }],
        },
      ],
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
      googleMaps,
      activePickupPoint,
      changeActivePickupDetails,
      activatePickupDetails,
    } = this.props

    const hasAddressCoords =
      address && address.geoCoordinates.value.length !== 0

    if (!this.map) return
    this.bounds = null

    this.markers = []

    if (hasAddressCoords) {
      this.bounds = new googleMaps.LatLngBounds()
    }

    if (!this.addressMarker && hasAddressCoords) {
      const addressLocation = this.getLocation(address.geoCoordinates.value)

      const markerOptions = {
        position: addressLocation,
        draggable: false,
        map: this.map,
        icon: personPin,
      }

      this.bounds.extend(addressLocation)

      this.addressMarker = new googleMaps.Marker(markerOptions)
    }

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
              ? markerIconSelected
              : markerIconBlue,
        }

        if (index < 2 && this.addressMarker && hasAddressCoords) {
          this.bounds.extend(location)
        }

        const marker = new googleMaps.Marker(markerOptions)

        const markerListener = googleMaps.event.addListener(
          marker,
          'click',
          () => {
            this.resetMarkers()
            marker.setIcon(markerIconSelected)
            changeActivePickupDetails({ pickupPoint: pickupOptions[index] })
            activatePickupDetails(true)
          }
        )

        this.markers.push({
          marker,
          markerListener,
          pickupPoint: pickupOptions[index].id,
        })

        if (index < 2 && this.addressMarker && hasAddressCoords) {
          this.map.fitBounds(this.bounds)
          this.map.panBy(-200, 0)
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

  resetMarkers = location => {
    this.markers &&
      this.markers.forEach(
        (markerObj, index) =>
          markerObj.pickupPoint
            ? markerObj.marker.setIcon(markerIconBlue)
            : markerObj
      )
    location && this.addressMarker && this.addressMarker.setPosition(location)
  }

  recenterMap = location => {
    if (!this.map) return

    this.map.panTo(location)

    if (!this.props.isLargeScreen) return

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
  activatePickupDetails: PropTypes.func.isRequired,
  activePickupPoint: PropTypes.object,
  address: AddressShapeWithValidation,
  changeActivePickupDetails: PropTypes.func.isRequired,
  geoCoordinates: PropTypes.array,
  googleMaps: PropTypes.object,
  isLargeScreen: PropTypes.bool,
  isLoadingGoogle: PropTypes.bool,
  isPickupDetailsActive: PropTypes.bool,
  loadingElement: PropTypes.node,
  onChangeAddress: PropTypes.func.isRequired,
  pickupOptionGeolocations: PropTypes.array,
  pickupOptions: PropTypes.array.isRequired,
  pickupPoint: PropTypes.object,
  rules: PropTypes.object.isRequired,
  selectedPickupPointGeolocation: PropTypes.array,
}

export default Map
