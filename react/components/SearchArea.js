import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './SearchArea.css'
import RefreshIcon from '../assets/components/RefreshIcon'
import { injectState } from '../modalStateContext'
import { handleGetAddressByGeolocation } from '../utils/CurrentPosition'

class SearchArea extends PureComponent {
  handleSearchArea = () => {
    const {
      lastMapCenterLatLng,
      googleMaps,
      onChangeAddress,
      rules,
      address,
    } = this.props

    handleGetAddressByGeolocation({
      newPosition: {
        lat: lastMapCenterLatLng.lat(),
        lng: lastMapCenterLatLng.lng(),
      },
      googleMaps,
      onChangeAddress,
      rules,
      address,
    })
  }

  render() {
    const { shouldSearchArea } = this.props

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
          Buscar nessa área
        </button>
      </div>
    )
  }
}

SearchArea.propTypes = {
  shouldShow: PropTypes.bool,
  lastMapCenterLatLng: PropTypes.object,
  googleMaps: PropTypes.object,
  onChangeAddress: PropTypes.func.isRequired,
  rules: PropTypes.object,
  address: PropTypes.object,
  shouldSearchArea: PropTypes.bool,
}

export default injectState(SearchArea)
