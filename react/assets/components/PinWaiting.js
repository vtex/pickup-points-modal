import React, { PureComponent } from 'react'
import styles from './PinWaiting.css'

class PinWaiting extends PureComponent {
  render() {
    return (
      <svg
        className={`pkpmodal-locating-image-waiting-pin ${styles.waitingPin}`}
        width="141"
        height="85"
        viewBox="0 0 141 85"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M70.2429 85C31.5096 85 0 72.9809 0 58.2063C0 43.4317 31.5096 31.4126 70.2429 31.4126C108.976 31.4126 140.486 43.4317 140.486 58.2063C140.486 72.9809 108.976 85 70.2429 85Z"
          fill="#EBEBEB"
        />
        <path
          d="M92.6413 22.2337C92.6413 29.581 89.5533 33.9681 84.6124 41.3793C79.054 49.4081 75.3484 53.1137 70.4076 57.4369C65.4668 53.1137 60.1699 46.7204 57.438 43.2321C53.1148 37.7121 48.174 29.9424 48.174 22.2337C48.174 9.95435 58.1283 0 70.4076 0C82.6869 0 92.6413 9.95435 92.6413 22.2337Z"
          fill="#727273"
        />
        <circle cx="71.0252" cy="22.8513" r="8.02882" fill="white" />
      </svg>
    )
  }
}

export default PinWaiting
