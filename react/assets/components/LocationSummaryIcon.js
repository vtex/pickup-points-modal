import React, { PureComponent } from 'react'

import styles from './LocationSummaryIcon.css'

class LocationSummaryIcon extends PureComponent {
  render() {
    return (
      <svg
        className={`${styles.locationSummaryIcon} pkpmodal-location-summary-icon`}
        height="16"
        version="1.1"
        viewBox="0 0 48 48"
        width="16"
        x="0px"
        xmlns="http://www.w3.org/2000/svg"
        y="0px"
      >
        <path
          d="M24,1.11224c-9.38879,0-17,7.61115-17,17 c0,10.1424,12.87262,23.22955,16.2149,26.4566c0.44031,0.42517,1.12988,0.42517,1.57025,0C28.12744,41.3418,41,28.25464,41,18.11224 C41,8.72339,33.38879,1.11224,24,1.11224z"
          fill="#999"
          stroke="#ffffff"
        />
        <circle cx="24" cy="18" fill="#FFFFFF" r="6" />
      </svg>
    )
  }
}

export default LocationSummaryIcon
