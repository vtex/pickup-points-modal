import React, { PureComponent } from 'react'

class PinBlocked extends PureComponent {
  render() {
    return (
      <svg height="115" width="83" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
          <path
            d="M33.333 8C14.93 8 0 22.983 0 41.454c0 25.09 33.333 62.128 33.333 62.128s33.334-37.038 33.334-62.128C66.667 22.983 51.738 8 33.333 8zm0 45.402c-6.571 0-11.904-5.353-11.904-11.948 0-6.595 5.333-11.948 11.904-11.948 6.572 0 11.905 5.353 11.905 11.948 0 6.595-5.333 11.948-11.905 11.948z"
            fill="#FF4C4B"
            fillRule="nonzero"
            opacity=".5"
          />
          <ellipse
            cx="33"
            cy="111.5"
            fill="#D8D8D8"
            opacity=".5"
            rx="30"
            ry="3.5"
          />
          <circle cx="63" cy="20" fill="#FF4C4B" r="20" />
          <path d="M49 17h28v7H49z" fill="#FFF" />
        </g>
      </svg>
    )
  }
}

export default PinBlocked
