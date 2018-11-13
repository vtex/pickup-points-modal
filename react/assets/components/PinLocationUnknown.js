import React, { PureComponent } from 'react'

class PinLocationUnknown extends PureComponent {
  render() {
    return (
      <svg height="98" width="73" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" opacity=".5">
          <path d="M3.784 5.15h64.039V67.4H3.784z" fill="#FFF" />
          <path
            d="M64.111 1H8.89C4.53 1 1 4.537 1 8.905v55.333c0 4.367 3.53 7.905 7.889 7.905h15.778L36.5 84l11.833-11.857h15.778c4.359 0 7.889-3.538 7.889-7.905V8.905C72 4.537 68.47 1 64.111 1zM36.5 14.043c5.877 0 10.65 4.782 10.65 10.671 0 5.89-4.773 10.672-10.65 10.672-5.877 0-10.65-4.783-10.65-10.672s4.773-10.671 10.65-10.671zm23.667 42.29H12.833v-3.557c0-7.905 15.778-12.252 23.667-12.252 7.889 0 23.667 4.347 23.667 12.252v3.557z"
            stroke="#979797"
          />
          <ellipse
            cx="34"
            cy="5"
            fill="#D8D8D8"
            rx="34"
            ry="5"
            transform="translate(2 88)"
          />
        </g>
      </svg>
    )
  }
}

export default PinLocationUnknown
