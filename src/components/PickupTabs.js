import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import styles from './PickupTabs.css'
import { HIDE_MAP, SHOW_MAP } from '../constants'

export class PickupTabs extends Component {
  handleLocationTab = event => {
    if (event.target.value === !this.props.mapStatus) return

    this.props.updateLocationTab(event.target.value)
    this.setState({ lastMapValue: !this.props.mapStatus })
  }

  translate = id => this.props.intl.formatMessage({ id: `pickupPointsModal.${id}` })

  render() {
    const { mapStatus } = this.props

    return (
      <div
        className={`${
          styles.PickupViewMode
        } pickup-view-mode flex-none relative flex ph2 pb1`}
      >
        <button
          value={HIDE_MAP}
          type="button"
          className={`${
            styles.PickupViewList
          } pickup-view-list btn btn-link flex-auto ba b--blue pv2 br0 db w-100 ${
            mapStatus === HIDE_MAP
              ? `bg-blue white ${styles.PickupViewOptionActive}`
              : `bg-white blue ${styles.PickupViewOptionInactive}`
          }`}
          onClick={this.handleLocationTab}
        >
          {this.translate('list')}
        </button>
        <button
          value={SHOW_MAP}
          type="button"
          className={`${
            styles.PickupViewMap
          } pickup-view-map btn btn-link map flex-auto ba b--blue pv2 br0 db w-100 ${
            mapStatus === SHOW_MAP
              ? `bg-blue white ${styles.PickupViewOptionActive}`
              : `bg-white blue ${styles.PickupViewOptionInactive}`
          }`}
          onClick={this.handleLocationTab}
        >
          {this.translate('map')}
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
