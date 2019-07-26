import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils/i18nUtils'
import { HIDE_MAP, SHOW_MAP, LIST } from '../constants'
import styles from './PickupTabs.css'
import { injectState } from '../modalStateContext'

class PickupTabs extends Component {
  handleLocationTab = event => {
    if (event.target.value === !this.props.mapStatus) return

    this.props.updateLocationTab(event.target.value)
    this.props.setActiveSidebarState(
      event.target.value === HIDE_MAP ? LIST : ''
    )
    this.setState({ lastMapValue: !this.props.mapStatus })
  }

  render() {
    const { intl, mapStatus } = this.props

    const buttonActive = `${
      styles.pickupViewOptionActive
    } pkpmodal-pickup-view-option-active`

    const buttonInactive = `${
      styles.pickupViewOptionInctive
    } pkpmodal-pickup-view-option-inactive`

    return (
      <div className={`${styles.pickupViewMode} pkpmodal-pickup-view-mode`}>
        <button
          className={`${
            styles.pickupViewList
          } pkpmodal-pickup-view-list btn btn-link ${
            mapStatus === HIDE_MAP ? buttonActive : buttonInactive
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
            mapStatus === SHOW_MAP ? buttonActive : buttonInactive
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
  intl: intlShape.isRequired,
  mapStatus: PropTypes.string.isRequired,
  updateLocationTab: PropTypes.func.isRequired,
  setActiveSidebarState: PropTypes.func.isRequired,
}

export default injectState(injectIntl(PickupTabs))
