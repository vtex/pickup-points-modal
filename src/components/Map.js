import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import geolocationAutoCompleteAddress from '@vtex/address-form/lib/geolocation/geolocationAutoCompleteAddress'
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

  componentWillReceiveProps(nextProps) {
    const { googleMaps, pickupOptionGeolocations } = this.props

    const selectedGeolocation = nextProps.pickupOptions.find(
      item => item.id === nextProps.pickupPoint.id
    )

    this.address = nextProps.address

    if (nextProps.pickupOptionGeolocations !== pickupOptionGeolocations) {
      this.createNewMarkers({
        pickups: nextProps.pickupOptionGeolocations,
        pickupOptions: nextProps.pickupOptions,
        pickupPoint: nextProps.pickupPoint.id,
        selectedPickupPointGeolocation:
          nextProps.selectedPickupPointGeolocation,
        recenter: false,
      })
    }

    const markerObj =
      this.markers &&
      this.markers.find(
        item => item.pickupPoint.id === nextProps.pickupPoint.id
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
    }
  }

  mapMounted = mapElement => {
    if (!mapElement) {
      this.map = null
      this.marker = null
      return
    }

    this.createMap(mapElement)
    this.createNewMarkers({
      pickups: this.props.pickupOptionGeolocations,
      pickupOptions: this.props.pickupOptions,
      pickupPoint: this.props.pickupPoint.id,
      selectedPickupPointGeolocation: this.props.selectedPickupPointGeolocation,
      recenter: true,
    })
  }

  createMap = mapElement => {
    const { googleMaps, largeScreen } = this.props

    this._mapElement = mapElement

    const mapOptions = {
      zoom: largeScreen ? 12 : 10,
      minZoom: 12,
      maxZoom: 20,
      mapTypeControl: false,
      zoomControl: true,
      fullscreenControl: false,
      streetViewControl: false,
      color: '#00ff00',
      zoomControlOptions: {
        position: googleMaps.ControlPosition.CENTER_RIGHT,
        style: googleMaps.ZoomControlStyle.SMALL,
      },
    }

    this.map = new googleMaps.Map(this._mapElement, mapOptions)
  }

  createNewMarkers = ({
    pickups,
    pickupOptions,
    pickupPoint,
    selectedPickupPointGeolocation,
    recenter,
  }) => {
    const locations = pickups
      .map(pickup => (pickup.length > 0 ? this.getLocation(pickup) : undefined))
      .filter(item => item)

    const { changeActivePickupDetails, googleMaps } = this.props

    if (!this.map) return

    const bounds = new googleMaps.LatLngBounds()

    this.markerListeners = []
    this.markers = []

    locations &&
      locations.forEach((location, index) => {
        const markerOptions = {
          position: location,
          draggable: false,
          map: this.map,
          icon:
            pickupPoint === pickupOptions[index].id
              ? this.state.selectedIcon
              : this.state.icon,
        }

        bounds.extend(location)

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
            changeActivePickupDetails(pickupOptions[index].id)
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

        if (recenter) {
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
  address: PropTypes.object,
  changeActivePickupDetails: PropTypes.func.isRequired,
  geoCoordinates: PropTypes.array,
  googleMaps: PropTypes.object,
  isPickupDetailsActive: PropTypes.bool.isRequired,
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
