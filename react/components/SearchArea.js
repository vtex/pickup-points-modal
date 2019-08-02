import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './SearchArea.css'
import RefreshIcon from '../assets/components/RefreshIcon'
import { injectState } from '../modalStateContext'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils/i18nUtils'

class SearchArea extends PureComponent {
  handleSearchArea = () => {
    const { lastMapCenterLatLng, address, searchPickupsInArea } = this.props

    searchPickupsInArea(lastMapCenterLatLng, address)
  }

  render() {
    const { shouldSearchArea, intl } = this.props

    return (
      <div
        className={`${styles.zoomWrapper} ${
          shouldSearchArea ? '' : styles.hide
        }`}>
        <button
          onClick={this.handleSearchArea}
          className={`pkpmodal-search-area ${styles.searchArea}`}
          type="button">
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
  lastMapCenterLatLng: PropTypes.object,
  shouldSearchArea: PropTypes.bool,
  searchPickupsInArea: PropTypes.func.isRequired,
  shouldShow: PropTypes.bool,
}

export default injectState(injectIntl(SearchArea))
