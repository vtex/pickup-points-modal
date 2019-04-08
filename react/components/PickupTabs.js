import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils/i18nUtils'
import { HIDE_MAP, SHOW_MAP } from '../constants'
import styles from './PickupTabs.css'

class PickupTabs extends Component {
  handleLocationTab = event => {
    if (event.target.value === !this.props.mapStatus) return

    this.props.updateLocationTab(event.target.value)
    this.setState({ lastMapValue: !this.props.mapStatus })
  }

  render() {
    const { intl, mapStatus } = this.props

    return (
      <div className={`${styles.pickupViewMode} pkpmodal-pickup-view-mode`}>
        <button
          className={`${
            styles.pickupViewList
          } pkpmodal-pickup-view-list btn btn-link ${
            mapStatus === HIDE_MAP
              ? `${
                styles.pickupViewOptionActive
              } pkpmodal-pickup-view-option-active`
              : `${
                styles.pickupViewOptionInctive
              } pkpmodal-pickup-view-option-inactive`
          }`}
          onClick={this.handleLocationTab}
          type="button"
          value={HIDE_MAP}>
          {translate(intl, 'list')}
        </button>
        <button
          className={`${
            styles.pickupViewMap
          } pkpmodal-pickup-view-map btn btn-link ${
            mapStatus === SHOW_MAP
              ? `${
                styles.pickupViewOptionActive
              } pkpmodal-pickup-view-option-active`
              : `${
                styles.pickupViewOptionInctive
              } pkpmodal-pickup-view-option-inactive`
          }`}
          onClick={this.handleLocationTab}
          type="button"
          value={SHOW_MAP}>
          {translate(intl, 'map')}
        </button>
      </div>
    )
  }
}

PickupTabs.propTypes = {
  intl: intlShape,
  mapStatus: PropTypes.string.isRequired,
  updateLocationTab: PropTypes.func.isRequired,
}

export default injectIntl(PickupTabs)
