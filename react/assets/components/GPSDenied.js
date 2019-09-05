import React, { PureComponent } from 'react'

class GPSDenied extends PureComponent {
  render() {
    return (
      <svg
        className="pkpmodal-use-geolocation-icon"
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="9" r="3" fill="#C4C4C4" />
        <circle cx="8" cy="9" r="5.75" stroke="#C4C4C4" strokeWidth="1.5" />
        <rect x="7" y="1" width="2" height="3" fill="#C4C4C4" />
        <rect x="7" y="14" width="2" height="3" fill="#C4C4C4" />
        <rect
          x="13"
          y="10"
          width="2"
          height="3"
          transform="rotate(-90 13 10)"
          fill="#C4C4C4"
        />
        <rect
          y="10"
          width="2"
          height="3"
          transform="rotate(-90 0 10)"
          fill="#C4C4C4"
        />
        <line
          x1="0.707107"
          y1="1.29289"
          x2="15.7071"
          y2="16.2929"
          stroke="#C4C4C4"
          strokeWidth="2"
        />
      </svg>
    )
  }
}

export default GPSDenied
