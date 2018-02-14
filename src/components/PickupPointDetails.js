import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import {
  getUnavailableItemsByPickup,
  getItemsByPickup,
} from '../utils/pickupUtils'

import PickupPoint from './PickupPoint'
import ProductItems from '../components/ProductItems'

import styles from './PickupPointDetails.css'

export class PickupPointDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      unavailableItems: getUnavailableItemsByPickup(
        this.props.items,
        this.props.logisticsInfo,
        this.props.pickupPoint,
        this.props.sellerId
      ),
      items: getItemsByPickup(
        this.props.items,
        this.props.logisticsInfo,
        this.props.pickupPoint,
        this.props.sellerId
      ),
    }
  }
  handleBackButtonClick = () => this.props.togglePickupDetails()

  handleConfirmButtonClick = () => {
    this.props.changeActiveSLAOption({
      slaOption: this.props.pickupPoint.id,
      sellerId: this.props.sellerId,
    })
    this.props.togglePickupDetails()
    this.props.closePickupPointsModal()
  }

  translate = (id, values) =>
    this.props.intl.formatMessage({ id: `pickupPointsModal.${id}` }, values)

  render() {
    const {
      pickupPoint,
      selectedRules,
      isSelectedSla,
      sellerId,
      storePreferencesData,
      logisticsInfo,
    } = this.props

    const { unavailableItems, items } = this.state

    return (
      <div className={`${styles.pickupPointDetails} pickup-point-details`}>
        <div className={`${styles.flexNone} pickup-point-details-top`}>
          <button
            type="button"
            className={`${
              styles.backLink
            } link-back-pickup-points-list btn btn-link f6 blue no-underline`}
            onClick={this.handleBackButtonClick}
          >
            <i className={`${styles.iconBack} icon-angle-left`} />
            {this.translate('cancelBackList')}
          </button>
        </div>

        <div
          className={`${
            styles.pickupDetailsMiddle
          } pickup-point-details-middle`}
        >
          <div
            className={`${
              styles.pickupPointDetailsStore
            } pickup-point-details-store`}
          >
            <PickupPoint
              items={items}
              logisticsInfo={logisticsInfo}
              sellerId={sellerId}
              storePreferencesData={storePreferencesData}
              isSelected={isSelectedSla}
              selectedRules={selectedRules}
              pickupPoint={pickupPoint}
            />
          </div>

          <div className={`${styles.info} pickup-point-details-info`}>
            <div className={`${styles.group} pickup-point-details-group mb3`}>
              <h3
                className={`${
                  styles.title
                } pickup-point-details-info-title fw5 f6 pb1`}
              >
                {this.translate('productsInPoint')}
              </h3>
              {items && <ProductItems items={items} />}
              {unavailableItems && (
                <ProductItems items={unavailableItems} available={false} />
              )}
            </div>
            {pickupPoint.pickupStoreInfo &&
              pickupPoint.pickupStoreInfo.additionalInfo && (
                <div
                  className={`${styles.group} pickup-point-details-group mb3`}
                >
                  <h3
                    className={`${
                      styles.title
                    } pickup-point-details-info-title fw5 f6 pb1`}
                  >
                    {this.translate('aditionalInfo')}
                  </h3>
                  {pickupPoint.pickupStoreInfo.additionalInfo}
                </div>
              )}
          </div>
        </div>

        <div
          className={`${styles.pickupPointDetailsBottom} ${
            styles.bottom
          } pickup-point-details-bottom mt3`}
        >
          <button
            type="button"
            className={`${
              styles.confirmButton
            } pickup-point-details-confirm btn btn-success btn-large`}
            id={`confirm-pickup-${pickupPoint.id
              .replace(/[^\w\s]/gi, '')
              .split(' ')
              .join('-')}`}
            onClick={this.handleConfirmButtonClick}
          >
            {this.translate('confirmPoint')}
          </button>
        </div>
      </div>
    )
  }
}

PickupPointDetails.propTypes = {
  changeActiveSLAOption: PropTypes.func.isRequired,
  intl: intlShape,
  isSelectedSla: PropTypes.bool,
  items: PropTypes.array.isRequired,
  onClickPickupModal: PropTypes.func,
  pickupPoint: PropTypes.object.isRequired,
  selectedRules: PropTypes.object.isRequired,
  storePreferencesData: PropTypes.object.isRequired,
  sellerId: PropTypes.string,
  togglePickupDetails: PropTypes.func.isRequired,
  closePickupPointsModal: PropTypes.func.isRequired,
  logisticsInfo: PropTypes.array.isRequired,
}

const makeMapStateToProps = (state, props) => ({
  pickupPoint: getPickupPointsByStateId(state, props),
  storePreferencesData: state.orderForm.storePreferencesData,
  isSelectedSla: isSelectedSla(state, props),
  items: getItemsByPickup(state, props),
  unavailableItems: getUnavailableItemsByPickup(state, props),
})

export default injectIntl(PickupPointDetails)
