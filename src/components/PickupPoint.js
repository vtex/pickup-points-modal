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
    if (!this.props.isModal) return
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
        <div className="flex lh-copy">
          {isModal && (
            <div className="pickup-point-marker">
              <img
                className="pickup-point-marker-image"
                src={isSelected ? markerIconSelected : markerIcon}
                alt=""
              />
              <div className="hide">{pickupPoint.distance}</div>
            </div>
          )}
          <div className="pickup-point-info">
            <p className="pickup-point-name">
              {!isModal && (
                <img
                  className={styles.markerIcon}
                  src={markerIcon}
                  alt={pickupPoint.pickupStoreInfo.friendlyName}
                />
              )}
              {pickupPoint.pickupStoreInfo.friendlyName}
            </p>
            <div className="pickup-point-address">
              <AddressSummary
                address={pickupPoint.pickupStoreInfo.address}
                rules={selectedRules}
                onClickMaskedInfoIcon={this.handleClickMaskedInfoIcon}
              />
            </div>
            <div className="f6">
              {isModal && (
                <p>
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
                </p>
              )}
              {isModal && (
                <div className="">
                  {unavailableItemsAmount > 0 && (
                    <span className="">
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
                className="button-details-pickup-point btn btn-link"
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
  handleChangeActivePickupDetails: PropTypes.func,
  onChangeActivePickupPointId: PropTypes.func,
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

export default injectIntl(PickupPoint)
