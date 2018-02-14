import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { formatCurrency } from '../utils/Currency'

import markerIcon from '../assets/icons/marker_blue.svg'
import markerIconSelected from '../assets/icons/marker_selected_check.svg'
import { AddressSummary } from '@vtex/address-form'
import { getUnavailableItemsAmount } from '../utils/pickupUtils'

import styles from './PickupPoint.css'

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
    if (!this.props.isModal) return
    this.props.togglePickupDetails()
    this.props.changeActivePickupDetails(this.props.pickupPoint)
    this.props.changeActivePickupPointId &&
      this.props.changeActivePickupPointId(this.props.pickupPoint)
  }

  handlePickupModal = () => this.props.onClickPickupModal(this.props.liPackage)

  translate = (id, values) =>
    this.props.intl.formatMessage({ id: `pickupPointsModal.${id}` }, values)

  render() {
    const {
      isModal,
      isSelected,
      pickupPoint,
      selectedRules,
      showAddress,
      storePreferencesData,
    } = this.props

    const { unavailableItemsAmount } = this.state

    if (!pickupPoint) {
      return <div />
    }

    const days =
      pickupPoint &&
      pickupPoint.shippingEstimate &&
      pickupPoint.shippingEstimate.split(/[0-9]+/)[1]
    const daysAmount =
      pickupPoint &&
      pickupPoint.shippingEstimate &&
      pickupPoint.shippingEstimate.split(/\D+/)[0]

    return (
      <div
        className={`${
          styles.PickupPoint
        } pickup-point bg-white bb b--light-gray pv3`}
        id={pickupPoint.id
          .replace(/[^\w\s]/gi, '')
          .split(' ')
          .join('-')}
        onClick={this.handleOpenPickupDetails}
      >
        <div className="flex lh-copy">
          {isModal && (
            <div
              className={`${
                styles.PickupPointMarker
              } pickup-point-market flex-none w3 tc pb1 f7 gray`}
            >
              <img
                className="pt1"
                src={isSelected ? markerIconSelected : markerIcon}
                alt=""
              />
              <div>{pickupPoint.distance}</div>
            </div>
          )}
          <div
            className={`${
              styles.PickupPointInfo
            } pickup-point-info flex-auto relative mr2`}
          >
            <p
              className={`${
                styles.PickupPointName
              } pickup-point-name fw5 f6 pb1y`}
            >
              {!isModal && (
                <img
                  className={styles.markerIcon}
                  src={markerIcon}
                  alt={pickupPoint.pickupStoreInfo.friendlyName}
                />
              )}
              {pickupPoint.pickupStoreInfo.friendlyName}
            </p>
            <div
              className={`${
                styles.PickupPointAddress
              } pickup-point-address f7 pb1 gray ${
                !showAddress ? 'hidden dn' : ''
              }`}
            >
              <AddressSummary
                address={pickupPoint.pickupStoreInfo.address}
                rules={selectedRules}
                onClickMaskedInfoIcon={this.handleClickMaskedInfoIcon}
              />
            </div>
            <div className="f6">
              {isModal && (
                <p>
                  <span
                    className={`${
                      styles.PickupPointPrice
                    } pickup-point-price dib mr3 gray`}
                  >
                    {this.translate('price', {
                      value: pickupPoint.price,
                      formattedPrice: formatCurrency({
                        value: pickupPoint.price,
                        storePreferencesData,
                      }),
                    })}
                  </span>
                  <span
                    className={`${
                      styles.PickupPointSLA
                    } pickup-point-sla dib mr3 gray`}
                  >
                    {this.translate(`shippingEstimatePickup-${days}`, {
                      days: daysAmount,
                    })}
                  </span>
                </p>
              )}
              {isModal && (
                <div className="dib">
                  {unavailableItemsAmount > 0 && (
                    <span className="light-red">
                      {this.translate('unavailableItemsAmount', {
                        itemsAmount: unavailableItemsAmount,
                      })}
                    </span>
                  )}
                </div>
              )}
            </div>
            {!isModal && (
              <button
                type="button"
                className={`${
                  styles.details
                } button-details-pickup-point btn btn-link f6 blue no-underline`}
                id="change-pickup-button"
                onClick={this.handlePickupModal}
              >
                {this.translate('details')}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }
}

PickupPoint.defaultProps = {
  isModal: true,
  showAddress: true,
}
PickupPoint.propTypes = {
  changeActivePickupDetails: PropTypes.func,
  changeActivePickupPointId: PropTypes.func,
  togglePickupDetails: PropTypes.func,
  intl: intlShape,
  isModal: PropTypes.bool,
  isSelected: PropTypes.bool,
  liPackage: PropTypes.object,
  onClickPickupModal: PropTypes.func,
  pickupPoint: PropTypes.object.isRequired,
  selectedRules: PropTypes.object.isRequired,
  showAddress: PropTypes.bool,
  storePreferencesData: PropTypes.object.isRequired,
}

const makeMapStateToProps = (state, props) => ({
  storePreferencesData: state.orderForm.storePreferencesData,
  unavailableItemsAmount: getUnavailableItemsAmount(state, props),
  pickupPoint: getPickupPointsById(state, props),
})

export default injectIntl(PickupPoint)
