import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { formatCurrency } from '../utils/Currency'

import markerIcon from '../assets/icons/marker_blue.svg'
import markerIconSelected from '../assets/icons/marker_selected_check.svg'
import { AddressSummary } from '@vtex/address-form'
import { getUnavailableItemsAmount } from '../utils/pickupUtils'

import './PickupPoint.css'

export class PickupPoint extends Component {
  constructor(props) {
    super(props)

    this.state = {
      unavailableItemsAmount: getUnavailableItemsAmount(
        this.props.items,
        this.props.logisticsInfo,
        this.props.pickupPoint.id,
        this.props.sellerId
      ),
    }
  }
  handleOpenPickupDetails = () => {
    this.props.togglePickupDetails()
    this.props.handleChangeActivePickupDetails(this.props.pickupPoint)
    this.props.changeActivePickupPointId &&
      this.props.changeActivePickupPointId(this.props.pickupPoint)
  }

  handlePickupModal = () => this.props.onClickPickupModal(this.props.liPackage)

  translate = (id, values) =>
    this.props.intl.formatMessage({ id: `pickupPointsModal.${id}` }, values)

  render() {
    const {
      isSelected,
      pickupPoint,
      selectedRules,
      storePreferencesData,
    } = this.props

    const { unavailableItemsAmount } = this.state

    if (!pickupPoint) {
      return <div />
    }

    const time =
      pickupPoint &&
      pickupPoint.shippingEstimate &&
      pickupPoint.shippingEstimate.split(/[0-9]+/)[1]
    const timeAmount =
      pickupPoint &&
      pickupPoint.shippingEstimate &&
      pickupPoint.shippingEstimate.split(/\D+/)[0]

    return (
      <div
        className="pickup-point"
        id={pickupPoint.id
          .replace(/[^\w\s]/gi, '')
          .split(' ')
          .join('-')}
        onClick={this.handleOpenPickupDetails}
      >
        <div className="pickup-point-marker">
          <img
            className="pickup-point-marker-image"
            src={isSelected ? markerIconSelected : markerIcon}
            alt=""
          />
          <div className="pickup-point-distance hide">{pickupPoint.distance}</div>
        </div>
        <div className="pickup-point-info">
          <p className="pickup-point-name">
            {pickupPoint.pickupStoreInfo.friendlyName}
          </p>
          <div className="pickup-point-address">
            <AddressSummary
              address={pickupPoint.pickupStoreInfo.address}
              rules={selectedRules}
              onClickMaskedInfoIcon={this.handleClickMaskedInfoIcon}
            />
          </div>
          <div className="pickup-point-sla-availability">
            <span className="pickup-point-price">
              {this.translate('price', {
                value: pickupPoint.price,
                formattedPrice: formatCurrency({
                  value: pickupPoint.price,
                  storePreferencesData,
                }),
              })}
            </span>
            <span className="pickup-point-sla">
              {this.translate(`shippingEstimatePickup-${time}`, {
                timeAmount,
              })}
            </span>
            {unavailableItemsAmount > 0 && (
              <span className="pickup-point-availability">
                {this.translate('unavailableItemsAmount', {
                  itemsAmount: unavailableItemsAmount,
                })}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }
}

PickupPoint.defaultProps = {
  showAddress: true,
}
PickupPoint.propTypes = {
  handleChangeActivePickupDetails: PropTypes.func,
  onChangeActivePickupPointId: PropTypes.func,
  togglePickupDetails: PropTypes.func,
  intl: intlShape,
  isSelected: PropTypes.bool,
  liPackage: PropTypes.object,
  onClickPickupModal: PropTypes.func,
  pickupPoint: PropTypes.object.isRequired,
  selectedRules: PropTypes.object.isRequired,
  showAddress: PropTypes.bool,
  storePreferencesData: PropTypes.object.isRequired,
}

export default injectIntl(PickupPoint)
