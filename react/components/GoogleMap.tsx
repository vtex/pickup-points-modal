import type { ReactNode, CSSProperties } from 'react'
import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  useMemo,
  useCallback,
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react'

import { useModalState } from '../modalStateContext'
import { LIST } from '../constants'

interface Context {
  map: google.maps.Map | null
  onZoomIn: () => void
  onZoomOut: () => void
}

const ctx = createContext<Context | null>(null)

const isGeoCoordinate = (
  maybeGeocoordinate: number[]
): maybeGeocoordinate is [number, number] => maybeGeocoordinate.length === 2

export const useMaps = () => {
  const contextValue = useContext(ctx)

  if (contextValue == null) {
    throw new Error('useMaps must be used inside GoogleMaps component')
  }

  return contextValue
}

interface Props {
  /**
   * Center of the map in the format of [longitude, latitude]
   */
  center?: [number, number]
  /**
   * Wheter or not we are in a large screen (desktop). This is useful for the
   * recentering logic to accomodate for the extra UI displayed on top of the map
   */
  isLargeScreen?: boolean
  /**
   *
   * Whether or not we are still waiting for the Google Maps SDK to load
   */
  isLoading: boolean
  /**
   * Element to display while loading the Google Maps SDK
   */
  loadingElement: ReactNode
  /**
   * Click handler for when the map itself is clicked
   */
  onClick?: () => void
  /**
   * Reference point in map to use for when prompting to search another area
   * besides the surroundings of the address geo coordinates
   */
  referenceCenter?: [number, number]
  /**
   * Bounds of the map
   * @see {@type google.maps.Map['fitBounds']}
   */
  bounds?: google.maps.LatLngBounds | null
}

/**
 * Distance of map center to start prompting to search area
 */
const DISTANCE = 50

const STANDARD_ZOOM = 14

/**
 * Horizontal panning to accomodate the extra UI in large screns
 */
const PAN_LEFT_LAT = -160
/**
 * Vertical panning to accomodate the extra UI in large screns
 */
const PAN_LEFT_LNG = -30

const MAP_STYLES: CSSProperties = {
  height: '100%',
  width: '100%',
  position: 'absolute',
  top: 0,
  zIndex: 0,
}

/**
 * Transforms the geoCoordinates of the API to a LatLng object from Google Maps
 * SDK
 *
 * @param {[number, number]} geoCoordinates - Geocoordinates in [longitude, latitude] format
 * @returns {google.maps.LatLng} LatLng object with the same position as `geoCoordinates`
 */
const geoCoordinatesToLatLng = (geoCoordinates: [number, number]) => {
  const [lng, lat] = geoCoordinates
  const location = new google.maps.LatLng(lat, lng)

  return location
}

const isGeoCoordinatesEqual = (
  geoA: Array<number | undefined>,
  geoB: number[]
) => {
  if (geoA.length !== geoB.length) {
    return false
  }

  const [lngA, latA] = geoA
  const [lngB, latB] = geoB

  return lngA === lngB && latA === latB
}

const useMapEvent = (
  map: google.maps.Map | null,
  eventName: string,
  handler: () => void
) => {
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  })

  useEffect(() => {
    if (map == null) {
      return
    }

    const event = google.maps.event.addListener(map, eventName, () => {
      handlerRef.current()
    })

    return () => {
      google.maps.event.removeListener(event)
    }
  }, [eventName, map])
}

interface GoogleMapRefObject {
  getBounds(): google.maps.LatLngBounds | undefined
}

export const GoogleMap = forwardRef<GoogleMapRefObject, Props>(
  function GoogleMap(
    {
      children,
      center = [],
      isLargeScreen = false,
      isLoading,
      loadingElement,
      onClick,
      referenceCenter,
      bounds,
    },
    ref
  ) {
    const {
      setMapCenterLatLng,
      setShouldSearchArea,
      setActiveState,
      setActiveSidebarState,
      activeState,
    } = useModalState()

    const [map, setMap] = useState<google.maps.Map | null>(null)

    const referenceCenterRef = useRef(referenceCenter)

    useEffect(() => {
      if (referenceCenter === referenceCenterRef.current) {
        return
      }

      referenceCenterRef.current = referenceCenter
    }, [referenceCenter])

    const toggleSearchArea = useCallback(() => {
      const currentCenter = map?.getCenter()

      if (currentCenter == null || referenceCenterRef.current == null) {
        return
      }

      const [referenceCenterLng, referenceCenterLat] =
        referenceCenterRef.current

      const differenceLat =
        Math.abs(referenceCenterLat - currentCenter.lat()) * 1000

      const differenceLng =
        Math.abs(referenceCenterLng - currentCenter.lng()) * 1000

      setShouldSearchArea(differenceLat > DISTANCE || differenceLng > DISTANCE)
      setMapCenterLatLng(currentCenter)
    }, [map, setMapCenterLatLng, setShouldSearchArea])

    const mapMounted = (node: HTMLDivElement | null) => {
      if (node == null || map !== null) {
        return
      }

      const googleMap = new google.maps.Map(node, {
        zoom: STANDARD_ZOOM,
        disableDefaultUI: true,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
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
        center: isGeoCoordinate(center)
          ? geoCoordinatesToLatLng(center)
          : undefined,
      })

      if (bounds) {
        googleMap.fitBounds(bounds)
      }

      if (isGeoCoordinate(center)) {
        toggleSearchArea()

        if (isLargeScreen) {
          googleMap.panBy(PAN_LEFT_LAT, PAN_LEFT_LNG)
        }
      }

      setMap(googleMap)
    }

    const prevBoundsRef = useRef<google.maps.LatLngBounds | undefined>(
      undefined
    )

    useEffect(() => {
      if (
        map == null ||
        isGeoCoordinatesEqual(
          [map.getCenter()?.lng(), map.getCenter()?.lat()],
          center
        )
      ) {
        return
      }

      if (!isGeoCoordinate(center)) {
        return
      }

      map.setCenter(geoCoordinatesToLatLng(center))

      if (map.getZoom() !== STANDARD_ZOOM) {
        map.setZoom(STANDARD_ZOOM)
      }

      if (isLargeScreen) {
        map.panBy(PAN_LEFT_LAT, PAN_LEFT_LNG)
      }
    }, [map, center, isLargeScreen])

    useEffect(() => {
      if (
        map == null ||
        !bounds ||
        bounds.equals(prevBoundsRef.current ?? null)
      ) {
        return
      }

      map.fitBounds(bounds)

      if ((map.getZoom() ?? STANDARD_ZOOM) > STANDARD_ZOOM) {
        map.setZoom(STANDARD_ZOOM)
      }

      if (isLargeScreen) {
        map.panBy(PAN_LEFT_LAT, PAN_LEFT_LNG)
      }

      prevBoundsRef.current = bounds
    }, [map, bounds, isLargeScreen])

    useMapEvent(map, 'dragend', () => {
      toggleSearchArea()
    })

    useMapEvent(map, 'click', () => {
      setActiveSidebarState(LIST)
      onClick?.()
    })

    useMapEvent(map, 'zoom_changed', () => {
      setActiveState(activeState)
    })

    useMapEvent(map, 'dragstart', () => {
      setActiveState(activeState)
    })

    useEffect(() => {
      if (map == null) {
        return
      }

      // TODO: can we move this `querySelector` call to use React refs instead?
      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
        document.querySelector('.zoom-control')
      )
    }, [map])

    const handleZoomIn = useCallback(() => {
      if (map == null) {
        return
      }

      const currentZoom = map.getZoom() ?? STANDARD_ZOOM

      map.setZoom(currentZoom + 1)
    }, [map])

    const handleZoomOut = useCallback(() => {
      if (map == null) {
        return
      }

      const currentZoom = map.getZoom() ?? STANDARD_ZOOM

      map.setZoom(currentZoom - 1)
    }, [map])

    useImperativeHandle(
      ref,
      () => ({
        getBounds: () => map?.getBounds(),
      }),
      [map]
    )

    const contextValue = useMemo(
      () => ({
        map,
        onZoomIn: handleZoomIn,
        onZoomOut: handleZoomOut,
      }),
      [handleZoomIn, handleZoomOut, map]
    )

    if (isLoading) {
      return <>{loadingElement}</>
    }

    return (
      <ctx.Provider value={contextValue}>
        <div id="map-canvas" ref={mapMounted} style={MAP_STYLES} />
        {children}
      </ctx.Provider>
    )
  }
)
