import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { formatCurrency, formatNumber } from '../utils/Currency'
import { formatDistance } from '../utils/Distance'
import { translate } from '../utils/i18nUtils'
import PinIcon from '../assets/components/PinIcon'
import PinIconSelected from '../assets/components/PinIconSelected'
import TranslateEstimate from 'vtex.shipping-estimate-translator/TranslateEstimate'
import { AddressSummary } from '@vtex/address-form'
import { getUnavailableItemsAmount } from '../utils/pickupUtils'

import styles from './PickupPoint.css'

class PickupPoint extends Component {
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

  getCleanId = () =>
    this.props.pickupPoint.id
      .replace(/[^\w\s]/gi, '')
      .split(' ')
      .join('-')

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

    const pickupId = this.getCleanId()

    if (!pickupPoint) {
      return <div />
    }

    return (
      <div
        className={`${styles.pickupPoint} pkpmodal-pickup-point`}
        id={pickupId}
        onClick={this.handleOpenPickupDetails}>
        <div className={`${styles.pickupPointMain} pkpmodal-pickup-point-main`}>
          <div
            className={`${
              styles.pickupPointMarker
            } pkpmodal-pickup-point-marker`}>
            {isSelected ? <PinIconSelected /> : <PinIcon />}
            {pickupPoint.pickupDistance && (
              <p
                className={`${
                  styles.pickupPointDistance
                } pkpmodal-pickup-point-distance`}>
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
          <div
            className={`${styles.pickupPointInfo} pkpmodal-pickup-point-info`}>
            <p
              className={`${
                styles.pickupPointName
              } pkpmodal-pickup-point-name`}>
              {pickupPoint.pickupStoreInfo.friendlyName}
            </p>
            <div
              className={`pkpmodal${
                styles.pickupPointAddress
              } -pickup-point-address ${isList ? 'list' : ''}`}>
              <AddressSummary
                address={pickupPoint.pickupStoreInfo.address}
                onClickMaskedInfoIcon={this.handleClickMaskedInfoIcon}
                rules={selectedRules}
              />
            </div>
            {unavailableItemsAmount > 0 && (
              <span
                className={`${
                  styles.pickupPointAvailability
                } pkpmodal-pickup-point-availability`}>
                {translate(intl, 'unavailableItemsAmount', {
                  itemsAmount: unavailableItemsAmount,
                })}
              </span>
            )}
          </div>
        </div>
        <div
          className={`${
            styles.pickupPointSlaAvailability
          } pkpmodal-pickup-point-sla-availability`}>
          <span
            className={`${
              styles.pickupPointPrice
            } pkpmodal-pickup-point-price`}>
            {translate(intl, 'price', {
              value: pickupPoint.price,
              formattedPrice: formatCurrency({
                value: pickupPoint.price,
                storePreferencesData,
              }),
            })}
          </span>
          <span
            className={`${styles.pickupPointSla} pkpmodal-pickup-point-sla`}>
            <TranslateEstimate
              shippingEstimate={pickupPoint && pickupPoint.shippingEstimate}
              isPickup
            />
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
