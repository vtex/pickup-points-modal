import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import './PickupTabs.css'
import { HIDE_MAP, SHOW_MAP } from '../constants'

export class PickupTabs extends Component {
  handleLocationTab = event => {
    if (event.target.value === !this.props.mapStatus) return

    this.props.updateLocationTab(event.target.value)
    this.setState({ lastMapValue: !this.props.mapStatus })
  }

  translate = id =>
    this.props.intl.formatMessage({ id: `pickupPointsModal.${id}` })

  render() {
    const { mapStatus } = this.props

    return (
      <div
        className={
          'pickup-view-mode'
        }
      >
        <button
          value={HIDE_MAP}
          type="button"
          className={`pickup-view-list btn btn-link ${
            mapStatus === HIDE_MAP
              ? 'pickup-view-option-active'
              : 'pickup-view-option-inactive'
          }`}
          onClick={this.handleLocationTab}
        >
          {this.translate('list')}
        </button>
        <button
          value={SHOW_MAP}
          type="button"
          className={`pickup-view-map btn btn-link ${
            mapStatus === SHOW_MAP
              ? 'pickup-view-option-active'
              : 'pickup-view-option-inactive'
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
