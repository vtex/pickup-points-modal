import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { formatCurrency, formatNumber } from '../utils/Currency'
import { formatDistance } from '../utils/Distance'
import { translate } from '../utils/i18nUtils'
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

  render() {
    const {
      isSelected,
      intl,
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
        onClick={this.handleOpenPickupDetails}>
        <div className="pkpmodal-pickup-point-main">
          <div className="pkpmodal-pickup-point-marker">
            {isSelected ? <PinIconSelected /> : <PinIcon />}
            {pickupPoint.pickupDistance && (
              <p className="pkpmodal-pickup-point-distance">
                {translate(intl, 'distance', {
                  distanceValue: formatNumber({
                    value: formatDistance(
                      pickupPoint.pickupDistance,
                      intl.locale
                    ),
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
              }`}>
              <AddressSummary
                address={pickupPoint.pickupStoreInfo.address}
                onClickMaskedInfoIcon={this.handleClickMaskedInfoIcon}
                rules={selectedRules}
              />
            </div>
            {unavailableItemsAmount > 0 && (
              <span className="pkpmodal-pickup-point-availability">
                {translate(intl, 'unavailableItemsAmount', {
                  itemsAmount: unavailableItemsAmount,
                })}
              </span>
            )}
          </div>
        </div>
        {this.props.items.length > 0 && (
          <div className="pkpmodal-pickup-point-sla-availability">
            <span className="pkpmodal-pickup-point-price">
              {translate(intl, 'price', {
                value: pickupPoint.price,
                formattedPrice: formatCurrency({
                  value: pickupPoint.price,
                  storePreferencesData,
                }),
              })}
            </span>
            <span className="pkpmodal-pickup-point-sla">
              {translate(intl, `shippingEstimatePickup-${time}`, {
                timeAmount,
              })}
            </span>
          </div>
        )}
      </div>
    )
  }
}

PickupPoint.defaultProps = {
  showAddress: true,
  isSelected: true,
}
PickupPoint.propTypes = {
  changeActivePickupPointId: PropTypes.any,
  handleChangeActivePickupDetails: PropTypes.func,
  intl: intlShape,
  isList: PropTypes.bool,
  isSelected: PropTypes.bool,
  items: PropTypes.any,
  liPackage: PropTypes.object,
  logisticsInfo: PropTypes.any,
  onChangeActivePickupPointId: PropTypes.func,
  onClickPickupModal: PropTypes.func,
  pickupPoint: PropTypes.object.isRequired,
  selectedRules: PropTypes.object.isRequired,
  sellerId: PropTypes.any,
  showAddress: PropTypes.bool,
  storePreferencesData: PropTypes.object.isRequired,
  togglePickupDetails: PropTypes.func,
}

export default injectIntl(PickupPoint)
