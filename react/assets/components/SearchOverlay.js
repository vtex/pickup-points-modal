import React, { PureComponent } from 'react'

import styles from './SearchOverlay.css'
import { injectState } from '../../modalStateContext'

class SearchOverlay extends PureComponent {
  render() {
    const { searchedAreaNoPickups } = this.props

    return (
      <svg
        className={`${styles.searchOverlay} ${
          searchedAreaNoPickups ? '' : styles.hide
        }`}
        width="899"
        height="560"
        viewBox="0 0 899 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M899 0H0V560H899V0ZM609.5 509C735.697 509 838 406.697 838 280.5C838 154.303 735.697 52 609.5 52C483.303 52 381 154.303 381 280.5C381 406.697 483.303 509 609.5 509Z"
          fill="#C4C4C4"
          fillOpacity="0.5"
        />
        <circle cx="610" cy="280" r="228" stroke="#C4C4C4" strokeWidth="2" />
      </svg>
    )
  }
}

export default injectState(SearchOverlay)
