import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'
import markerIcon from '../assets/icons/marker.svg'
import personPin from '../assets/icons/person_pin.svg'
import searchMarkerIcon from '../assets/icons/search_marker_icon.svg'
// import searchMarkerIcon from '../assets/icons/unavailable_marker_icon.svg'

import { getPickupGeolocationString } from '../utils/GetString'
import { injectState } from '../modalStateContext'
import { LIST } from '../constants'
import { getPickupPointGeolocations } from '../utils/pickupUtils'

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
    const { googleMaps, pickupPoints, externalPickupPoints } = this.props

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
        markerObj.marker.setIcon({
          url: markerIcon,
          size: new googleMaps.Size(38, 49),
          scaledSize: new googleMaps.Size(38, 49),
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
      changeActivePickupDetails,
      googleMaps,
      setSelectedPickupPoint,
      setShouldSearchArea,
      pickupPoints,
      pickupOptions,
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

    if (!this.addressMarker && hasAddressCoords) {
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
              ? new googleMaps.Size(38, 49)
              : new googleMaps.Size(25, 31),
            scaledSize: isScaledMarker
              ? new googleMaps.Size(38, 49)
              : new googleMaps.Size(25, 31),
          },
        }

        const marker = new googleMaps.Marker(markerOptions)

        const markerClickListener = googleMaps.event.addListener(
          marker,
          'click',
          () => {
            this.recenterMap(location)
            this.resetMarkers()
            marker.setIcon({
              url: searchMarkerIcon,
              size: new googleMaps.Size(38, 49),
              scaledSize: new googleMaps.Size(38, 49),
            })
            changeActivePickupDetails({
              pickupPoint: filteredExternalPickupPoints[index],
            })
            setSelectedPickupPoint(filteredExternalPickupPoints[index])
            setShouldSearchArea(false)
          }
        )

        const markerHoverListener = googleMaps.event.addListener(
          marker,
          'mouseover',
          () => {
            marker.setIcon({
              url: searchMarkerIcon,
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
              this.props.selectedPickupPoint.id ===
                filteredExternalPickupPoints[index].id
            ) {
              return
            }
            marker.setIcon({
              url: searchMarkerIcon,
              size: new googleMaps.Size(25, 31),
              scaledSize: new googleMaps.Size(25, 31),
            })
          }
        )

        this.searchMarkers.push({
          marker,
          markerClickListener,
          markerHoverListener,
          markerHoverOutListener,
          pickupPoint: filteredExternalPickupPoints[index].id,
        })
      })

    pickupOptions &&
      pickupOptions
        .filter(pickupPoint => {
          return !this.markers.some(
            markerObj => markerObj.pickupPoint.id === pickupPoint.id
          )
        })
        .forEach(pickupPoint => {
          const location = this.getLocation(
            pickupPoint.pickupStoreInfo.address.geoCoordinates
          )
          const isScaledMarker =
            selectedPickupPoint && selectedPickupPoint.id === pickupPoint.id

          const markerOptions = {
            position: location,
            draggable: false,
            map: this.map,
            icon: {
              url: markerIcon,
              size: isScaledMarker
                ? new googleMaps.Size(38, 49)
                : new googleMaps.Size(25, 31),
              scaledSize: isScaledMarker
                ? new googleMaps.Size(38, 49)
                : new googleMaps.Size(25, 31),
            },
          }

          if (this.addressMarker && hasAddressCoords && shouldResetBounds) {
            this.bounds.extend(location)
            if (this.map.getZoom() < 14) {
              this.setZoom(14)
              this.map.panBy(-200, 0)
            }
          }

          const marker = new googleMaps.Marker(markerOptions)

          const markerClickListener = googleMaps.event.addListener(
            marker,
            'click',
            () => {
              this.recenterMap(location)
              this.resetMarkers()
              marker.setIcon({
                url: markerIcon,
                size: new googleMaps.Size(38, 49),
                scaledSize: new googleMaps.Size(38, 49),
              })
              changeActivePickupDetails({ pickupPoint: pickupPoint })
              setSelectedPickupPoint(pickupPoint)
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
                this.props.selectedPickupPoint.id === pickupPoint.id
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

          this.markers.push({
            marker,
            markerClickListener,
            markerHoverListener,
            markerHoverOutListener,
            pickupPoint: pickupPoint.id,
          })

          if (this.addressMarker && hasAddressCoords && shouldResetBounds) {
            this.map.fitBounds(this.bounds)
            this.map.panBy(-200, 0)
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
    this.searchMarkers &&
      this.searchMarkers.forEach(searchMarkerObj => {
        if (searchMarkerObj.pickupPoint) {
          searchMarkerObj.marker.setIcon({
            url: searchMarkerIcon,
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
  externalPickupPoints: PropTypes.array,
  geoCoordinates: PropTypes.array,
  googleMaps: PropTypes.object,
  isLargeScreen: PropTypes.bool,
  isLoadingGoogle: PropTypes.bool,
  isPickupDetailsActive: PropTypes.bool,
  loadingElement: PropTypes.node,
  onChangeAddress: PropTypes.func.isRequired,
  pickupOptions: PropTypes.array,
  pickupPoints: PropTypes.array,
  pickupPoint: PropTypes.object,
  rules: PropTypes.object.isRequired,
  selectedPickupPointGeolocation: PropTypes.array,
  setActiveSidebarState: PropTypes.func.isRequired,
  setMapCenterLatLng: PropTypes.func.isRequired,
  setSelectedPickupPoint: PropTypes.func.isRequired,
  setShouldSearchArea: PropTypes.func.isRequired,
}

export default injectState(Map)
