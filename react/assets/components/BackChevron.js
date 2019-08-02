import React, { PureComponent } from 'react'
import styles from './BackChevron.css'
class BackChevron extends PureComponent {
  render() {
    return (
      <svg
      className={styles.backChevron}
        width="10"
        height="14"
        viewBox="0 0 10 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0.75845 7.72356C0.345468 7.32958 0.345467 6.67042 0.758449 6.27644L7.33764 0L9.23999 1.81481L3.8047 7L9.23999 12.1852L7.33764 14L0.75845 7.72356Z"
          fill="#4C8EEF"
        />
      </svg>
    )
  }
}

export default BackChevron
