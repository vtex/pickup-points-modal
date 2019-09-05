import React, { PureComponent } from 'react'

class UnavailableMarker extends PureComponent {
  render() {
    return (
      <svg
        width="25"
        height="31"
        viewBox="0 0 25 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M19.4917 21.8169L19.4918 21.8169L19.4967 21.8096C19.5843 21.6782 19.6709 21.5485 19.7564 21.4204C22.0478 17.9883 23.5645 15.7165 23.5645 12.0323C23.5645 5.66317 18.4013 0.5 12.0323 0.5C5.66317 0.5 0.5 5.66317 0.5 12.0323C0.5 16.0417 3.05396 20.0158 5.20313 22.7599C6.56216 24.4952 9.21424 27.6986 11.703 29.8763L12.0323 30.1644L12.3615 29.8763C14.8402 27.7075 16.7075 25.8386 19.4917 21.8169Z"
          fill="#D2D2D3"
          stroke="white"
        />
        <circle cx="12.3387" cy="12.3389" r="3.98387" fill="white" />
      </svg>
    )
  }
}

export default UnavailableMarker
