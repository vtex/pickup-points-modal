import React, { Component } from 'react'
import PropTypes from 'prop-types'
import geolocationAutoCompleteAddress from '@vtex/address-form/lib/geolocation/geolocationAutoCompleteAddress'
import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'
import isEqual from 'lodash/isEqual'
import markerIcon from '../assets/icons/marker.svg'
import personPin from '../assets/icons/person_pin.svg'

import { getPickupGeolocationString } from '../utils/GetString'
import { injectState } from '../modalStateContext'
import { DETAILS, LIST, SIDEBAR } from '../constants'

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
      rules,
      isLoadingGoogle,
      isLargeScreen,
      address,
      pickupOptions,
      pickupOptionGeolocations,
      pickupPoint,
      selectedPickupPoint,
    } = this.props

    const rulesChanged = prevProps.rules.country !== rules.country
    const loadingChanged = prevProps.isLoadingGoogle !== isLoadingGoogle
    const screenSizeChanged = prevProps.isLargeScreen !== isLargeScreen
    const addressChanged =
      prevProps.address.geoCoordinates.value !== address.geoCoordinates.value
    const pickupGeolocationsChanged = prevProps.pickupOptions !== pickupOptions
    const selectedPickupPointChanged =
      prevProps.selectedPickupPoint !== selectedPickupPoint
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
      pickupGeolocationsChanged ||
      selectedPickupPointChanged
    )
  }

  componentWillUnmount() {
    this.setState({ isMounted: false })
  }

  componentDidUpdate(prevProps) {
    const { googleMaps, pickupOptionGeolocations } = this.props

    this.center = this.getLocation(this.props.address.geoCoordinates.value)

    const selectedGeolocation = this.props.pickupOptions.find(
      item =>
        this.props.selectedPickupPoint &&
        item.id === this.props.selectedPickupPoint.id
    )

    this.address = this.props.address

    const thisPickupOptions = getPickupGeolocationString(
      prevProps.pickupOptionGeolocations
    )
    const prevPickupOptions = getPickupGeolocationString(
      pickupOptionGeolocations
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

    const activeMarkerObj =
      this.markers &&
      this.markers.find(
        item =>
          this.props.activePickupPoint &&
          item.pickupPoint === this.props.activePickupPoint.id
      )

    if (
      ((nextAddressCoords &&
        nextAddressCoords.length > 0 &&
        this.props.pickupOptions.length > 1) ||
        (nextAddressCoords &&
          this.isDifferentGeoCoords(nextAddressCoords, thisAddressCoords))) &&
      googleMaps
    ) {
      this.recenterMap(this.getLocation(nextAddressCoords))
      this.resetMarkers(this.getLocation(nextAddressCoords))
      activeMarkerObj &&
        activeMarkerObj.marker.setIcon({
          url: markerIcon,
          size: new googleMaps.Size(38, 49),
          scaledSize: new googleMaps.Size(38, 49),
        })
    }

    if (
      thisPickupOptions !== prevPickupOptions ||
      this.isDifferentGeoCoords(nextAddressCoords, thisAddressCoords)
    ) {
      this.markers.map(markerObj => markerObj.marker.setMap(null))
      this.createNewMarkers({
        pickups: this.props.pickupOptionGeolocations,
        address: this.props.address,
        pickupOptions: this.props.pickupOptions,
        pickupPoint: this.props.selectedPickupPoint,
        selectedPickupPointGeolocation: this.props
          .selectedPickupPointGeolocation,
        recenter: false,
      })
    }

    if (
      this.props.activeState === SIDEBAR &&
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
      markerObj.marker.setIcon({
        url: markerIcon,
        size: new googleMaps.Size(38, 49),
        scaledSize: new googleMaps.Size(38, 49),
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

    this.createNewMarkers({
      pickups: this.props.pickupOptionGeolocations,
      pickupOptions: this.props.pickupOptions,
      pickupPoint: this.props.selectedPickupPoint,
      selectedPickupPointGeolocation: this.props.selectedPickupPoint,
      recenter: true,
      ...(this.props.address.geoCoordinates.value.length > 0
        ? { address: this.props.address }
        : {}),
    })
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
    const { googleMaps } = this.props

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
      ],
    }

    this.map = new googleMaps.Map(this._mapElement, mapOptions)

    const centerChanged = new googleMaps.event.addListener(
      this.map,
      'dragend',
      () => {
        this.toggleSearchArea()
      }
    )

    const zoomIn = document.querySelector('.pkpmodal-zoom-in')
    const zoomOut = document.querySelector('.pkpmodal-zoom-out')

    zoomIn.onclick = () => this.map.setZoom(this.map.getZoom() + 1)
    zoomOut.onclick = () => this.map.setZoom(this.map.getZoom() - 1)

    this.map.controls[googleMaps.ControlPosition.RIGHT_BOTTOM].push(
      document.querySelector('.zoom-control')
    )
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
      selectedPickupPoint,
      changeActivePickupDetails,
      googleMaps,
      setActiveSidebarState,
      setSelectedPickupPoint,
      setShouldSearchArea,
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
    const icon = {
      url: markerIcon,
      size: new googleMaps.Size(25, 31),
      scaledSize: new googleMaps.Size(25, 31),
    }
    const selectedIcon = {
      url: markerIcon,
      size: new googleMaps.Size(38, 49),
      scaledSize: new googleMaps.Size(38, 49),
    }

    locations &&
      locations.forEach((location, index) => {
        const markerOptions = {
          position: location,
          draggable: false,
          map: this.map,
          icon:
            (pickupPoint && pickupPoint.id === pickupOptions[index].id) ||
            (selectedPickupPoint &&
              selectedPickupPoint.id === pickupOptions[index].id)
              ? selectedIcon
              : icon,
        }

        if (index <= 2 && this.addressMarker && hasAddressCoords) {
          this.bounds.extend(location)
          this.map.panBy(-200, 0)
        }

        const marker = new googleMaps.Marker(markerOptions)

        const markerClickListener = googleMaps.event.addListener(
          marker,
          'click',
          () => {
            this.resetMarkers()
            marker.setIcon({
              url: markerIcon,
              size: new googleMaps.Size(38, 49),
              scaledSize: new googleMaps.Size(38, 49),
            })
            changeActivePickupDetails({ pickupPoint: pickupOptions[index] })
            setSelectedPickupPoint(pickupOptions[index])
            setActiveSidebarState(DETAILS)
            setShouldSearchArea(false)
          }
        )

        const markerHoverListener = googleMaps.event.addListener(
          marker,
          'mouseover',
          () => {
            marker.setIcon({
              url: markerIcon,
              size: new googleMaps.Size(38, 49),
              scaledSize: new googleMaps.Size(38, 49),
            })
          }
        )

        const markerHoverOutListener = googleMaps.event.addListener(
          marker,
          'mouseout',
          () => {
            if (
              this.props.selectedPickupPoint &&
              this.props.selectedPickupPoint.id === pickupOptions[index].id
            ) {
              return
            }
            marker.setIcon({
              url: markerIcon,
              size: new googleMaps.Size(25, 31),
              scaledSize: new googleMaps.Size(25, 31),
            })
          }
        )

        googleMaps.event.addListener(this.map, 'click', () => {
          setActiveSidebarState(LIST)
          this.resetMarkers()
        })

        this.markers.push({
          marker,
          markerClickListener,
          markerHoverListener,
          markerHoverOutListener,
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
      this.markers.forEach(markerObj => {
        if (markerObj.pickupPoint) {
          markerObj.marker.setIcon({
            url: markerIcon,
            size: new this.props.googleMaps.Size(25, 31),
            scaledSize: new this.props.googleMaps.Size(25, 31),
          })
        }
      })
    location && this.addressMarker && this.addressMarker.setPosition(location)
  }

  recenterMap = location => {
    if (!this.map) return

    this.map.panTo(location)

    this.props.setMapCenterLatLng(this.map.getCenter())
    this.toggleSearchArea()

    if (!this.props.isLargeScreen) return

    this.map.panBy(-200, 0)
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
  activePickupPoint: PropTypes.object,
  activeState: PropTypes.string,
  activatePickupDetails: PropTypes.func.isRequired,
  selectedPickupPoint: PropTypes.object,
  address: AddressShapeWithValidation,
  changeActivePickupDetails: PropTypes.func,
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
  setActiveSidebarState: PropTypes.func.isRequired,
  setSelectedPickupPoint: PropTypes.func.isRequired,
}

export default injectState(Map)
