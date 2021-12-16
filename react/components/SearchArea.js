import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import styles from './SearchArea.css'
import RefreshIcon from '../assets/components/RefreshIcon'
import { injectState } from '../modalStateContext'
import { translate } from '../utils/i18nUtils'
import { SHOW_MAP } from '../constants'

class SearchArea extends PureComponent {
  handleSearchArea = () => {
    const { lastMapCenterLatLng, address, searchPickupsInArea } = this.props

    searchPickupsInArea(lastMapCenterLatLng, address)
  }

  render() {
    const { intl, isLargeScreen, mapStatus, shouldSearchArea } = this.props

    return (
      <div
        className={`${styles.searchAreaWrapper} ${
          isLargeScreen ? styles.searchAreaWrapperDesktop : ''
        }`}
      >
        <button
          onClick={this.handleSearchArea}
          className={`pkpmodal-search-area ${
            isLargeScreen ? styles.searchAreaDesktop : styles.searchArea
          } ${
            shouldSearchArea && (isLargeScreen || mapStatus === SHOW_MAP)
              ? ''
              : styles.hide
          }`}
          type="button"
        >
          <RefreshIcon classes={styles.refreshIcon} />
          {translate(intl, 'searchArea')}
        </button>
      </div>
    )
  }
}

SearchArea.propTypes = {
  address: PropTypes.object,
  intl: intlShape.isRequired,
  isLargeScreen: PropTypes.bool.isRequired,
  lastMapCenterLatLng: PropTypes.object,
  mapStatus: PropTypes.string.isRequired,
  shouldSearchArea: PropTypes.bool,
  searchPickupsInArea: PropTypes.func.isRequired,
  shouldShow: PropTypes.bool,
}

export default injectState(injectIntl(SearchArea))
