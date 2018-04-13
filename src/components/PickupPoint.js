import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { formatCurrency, formatNumber } from '../utils/Currency'

import PinIcon from '../assets/components/PinIcon'
import PinIconSelected from '../assets/components/PinIconSelected'

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
    this.props.togglePickupDetails && this.props.togglePickupDetails()
    this.props.handleChangeActivePickupDetails &&
      this.props.handleChangeActivePickupDetails({
        pickupPoint: this.props.pickupPoint,
      })
    this.props.changeActivePickupPointId &&
      this.props.changeActivePickupPointId(this.props.pickupPoint)
  }

  handlePickupModal = () =>
    this.props.onClickPickupModal &&
    this.props.onClickPickupModal(this.props.liPackage)

  translate = (id, values) =>
    this.props.intl.formatMessage({ id: `pickupPointsModal.${id}` }, values)

  render() {
    const {
      isSelected,
      pickupPoint,
      selectedRules,
      storePreferencesData,
      isList,
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
        className="pkpmodal-pickup-point"
        id={pickupPoint.id
          .replace(/[^\w\s]/gi, '')
          .split(' ')
          .join('-')}
        onClick={this.handleOpenPickupDetails}
      >
        <div className="pkpmodal-pickup-point-main">
          <div className="pkpmodal-pickup-point-marker">
            {isSelected ? <PinIconSelected /> : <PinIcon />}
            {pickupPoint.pickupStoreInfo.distance && (
              <p className="pkpmodal-pickup-point-distance">
                {this.translate('distance', {
                  distanceValue: formatNumber({
                    value: pickupPoint.pickupStoreInfo.distance,
                    storePreferencesData,
                  }),
                })}
              </p>
            )}
          </div>
          <div className="pkpmodal-pickup-point-info">
            <p className="pkpmodal-pickup-point-name">
              {pickupPoint.pickupStoreInfo.friendlyName}
            </p>
            <div
              className={`pkpmodal-pickup-point-address ${
                isList ? 'list' : ''
              }`}
            >
              <AddressSummary
                address={pickupPoint.pickupStoreInfo.address}
                rules={selectedRules}
                onClickMaskedInfoIcon={this.handleClickMaskedInfoIcon}
              />
            </div>
            {unavailableItemsAmount > 0 && (
              <span className="pkpmodal-pickup-point-availability">
                {this.translate('unavailableItemsAmount', {
                  itemsAmount: unavailableItemsAmount,
                })}
              </span>
            )}
          </div>
        </div>
        <div className="pkpmodal-pickup-point-sla-availability">
          <span className="pkpmodal-pickup-point-price">
            {this.translate('price', {
              value: pickupPoint.price,
              formattedPrice: formatCurrency({
                value: pickupPoint.price,
                storePreferencesData,
              }),
            })}
          </span>
          <span className="pkpmodal-pickup-point-sla">
            {this.translate(`shippingEstimatePickup-${time}`, {
              timeAmount,
            })}
          </span>
        </div>
      </div>
    )
  }
}

PickupPoint.defaultProps = {
  showAddress: true,
  isSelected: true,
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
