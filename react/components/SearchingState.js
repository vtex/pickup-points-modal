import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import styles from '../index.css'
import searchingStyles from './SearchingState.css'
import Spinner from '../assets/components/Spinner'
import { translate } from '../utils/i18nUtils'
import { GEOLOCATION_SEARCHING, SEARCHING } from '../constants'

class SearchingState extends PureComponent {
  render() {
    const { activeSidebarState, activeState, intl, isFullPage } = this.props

    return (
      <div
        className={`${
          isFullPage ? styles.modalfullPage : styles.modalSidebar
        } pkpmodal-full-page`}>
        <div
          className={`${styles.searchAlone} ${
            searchingStyles.searchingWrapper
          } pkpmodal-search-alone`}>
          <Spinner size={24} />
          <p className={searchingStyles.searching}>
            {(activeState === SEARCHING || activeSidebarState === SEARCHING) &&
              translate(intl, 'geolocationSearching')}
            {activeState === GEOLOCATION_SEARCHING &&
              translate(intl, 'geolocationWaiting')}
          </p>
        </div>
      </div>
    )
  }
}

SearchingState.defaultProps = {
  isFullPage: true,
}

SearchingState.propTypes = {
  isFullPage: PropTypes.bool.isRequired,
  activeState: PropTypes.string,
  activeSidebarState: PropTypes.string,
  intl: intlShape.isRequired,
}

export default injectIntl(SearchingState)
