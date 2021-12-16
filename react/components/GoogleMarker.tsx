import type React from 'react'
import { useRef, useEffect, useState } from 'react'

import { useMaps } from './GoogleMap'

type MarkerIcon = undefined | null | string | google.maps.Icon

interface Props {
  /**
   * Position of the marker in the map in the format of [longitude, latitude]
   */
  position?: [number, number]
  /**
   * Whether or not the marker is draggable
   */
  draggable?: boolean
  /**
   * Relative position of the marker based on other markers in the map
   * @see {@type google.maps.MarkerOptions['zIndex']}
   */
  zIndex?: number
  /**
   * Icon of the marker
   * @see {@type google.maps.MarkerOptions['icon']}
   */
  icon?: string | google.maps.Icon
  onClick?: () => void
  onMouseOver?: () => void
  onMouseOut?: () => void
}

const isSameIcon = (iconA: MarkerIcon, iconB: MarkerIcon) => {
  if (iconA == null) {
    if (iconB == null) {
      return true
    }

    return false
  }

  if (iconB == null) {
    return false
  }

  if (typeof iconA === 'string') {
    if (typeof iconB !== 'string') {
      return false
    }

    return iconA === iconB
  }

  if (typeof iconB === 'string') {
    return false
  }

  if (iconA.url !== iconB.url) {
    return false
  }

  if (!iconA.size?.equals(iconB.size ?? null)) {
    return false
  }

  if (!iconA.scaledSize?.equals(iconB.scaledSize ?? null)) {
    return false
  }

  return true
}

const useMarkerEvent = (
  marker: google.maps.Marker,
  eventName: string,
  handler?: () => void
) => {
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const eventListener = google.maps.event.addListener(
      marker,
      eventName,
      () => {
        handlerRef.current?.()
      }
    )

    return () => {
      google.maps.event.removeListener(eventListener)
    }
  }, [marker, eventName])
}

export const GoogleMarker: React.VFC<Props> = ({
  position,
  draggable,
  zIndex,
  icon,
  onClick,
  onMouseOver,
  onMouseOut,
}) => {
  const [lng, lat] = position ?? [0, 0]
  const { map } = useMaps()
  const [marker] = useState(
    () =>
      new google.maps.Marker({
        icon,
        zIndex,
        draggable,
        position: new google.maps.LatLng(lat, lng),
      })
  )

  useEffect(() => {
    if (map == null) {
      return
    }

    marker.setMap(map)

    return () => {
      marker.setMap(null)
    }
  }, [map, marker])

  useEffect(() => {
    const currentPosition = marker.getPosition()

    if (
      currentPosition == null ||
      currentPosition.lat() !== lat ||
      currentPosition.lng() !== lng
    ) {
      marker.setPosition(new google.maps.LatLng(lat, lng))
    }
  }, [marker, lat, lng])

  useEffect(() => {
    if (icon != null && !isSameIcon(icon, marker.getIcon() as MarkerIcon)) {
      marker.setIcon(icon)
    }

    if (zIndex != null && zIndex !== marker.getZIndex()) {
      marker.setZIndex(zIndex)
    }
  }, [marker, icon, zIndex])

  useMarkerEvent(marker, 'click', onClick)
  useMarkerEvent(marker, 'mouseover', onMouseOver)
  useMarkerEvent(marker, 'mouseout', onMouseOut)

  return null
}
