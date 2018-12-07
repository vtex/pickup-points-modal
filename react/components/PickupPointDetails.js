import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils/i18nUtils'

import {
  getUnavailableItemsByPickup,
  getItemsWithPickupPoint,
  formatBusinessHoursList,
} from '../utils/pickupUtils'

import PickupPoint from './PickupPoint'
import ProductItems from './ProductItems'
import PickupPointHour from './PickupPointHour'
import Button from './Button'

import './PickupPointDetails.css'

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
      items: getItemsWithPickupPoint(
        this.props.items,
        this.props.logisticsInfo,
        this.props.pickupPoint,
        this.props.sellerId
      ),
    }
  }
  handleBackButtonClick = () => this.props.togglePickupDetails()

  handleConfirmButtonClick = () => {
    this.props.handleChangeActiveSLAOption({
      slaOption: this.props.pickupPoint.id,
      sellerId: this.props.sellerId,
      shouldUpdateShippingData: false,
    })
    this.props.togglePickupDetails()
    this.props.handleClosePickupPointsModal()
  }

  render() {
    const {
      pickupPoint,
      pickupPointInfo,
      selectedRules,
      isSelectedSla,
      sellerId,
      intl,
      storePreferencesData,
      logisticsInfo,
    } = this.props

    const { unavailableItems, items } = this.state

    const businessHours =
      !pickupPointInfo ||
      !pickupPointInfo.businessHours ||
      pickupPointInfo.businessHours.length === 0
        ? null
        : formatBusinessHoursList(pickupPointInfo.businessHours)

    return (
      <div className="pkpmodal-details">
        <div className="pkpmodal-details-top">
          <button
            className="pkpmodal-details-back-lnk btn btn-link"
            onClick={this.handleBackButtonClick}
            type="button">
            <i
              className={
                'pkpmodal-icon-back-pickup-points-list icon-angle-left'
              }
            />
            {translate(intl, 'cancelBackList')}
          </button>
        </div>

        <div className="pkpmodal-details-middle">
          <div className="pkpmodal-details-store">
            <PickupPoint
              isSelected={isSelectedSla}
              items={this.props.items}
              logisticsInfo={logisticsInfo}
              pickupPoint={pickupPoint}
              selectedRules={selectedRules}
              sellerId={sellerId}
              storePreferencesData={storePreferencesData}
            />
          </div>

          <div className="pkpmodal-details-info">
            {!!items || !!unavailableItems && (
              <div className="pkpmodal-details-group">
                <h3 className="title pkpmodal-details-info-title">
                  {translate(intl, 'productsInPoint')}
                </h3>
                {items && <ProductItems items={items} />}
                {unavailableItems && (
                  <ProductItems isAvailable={false} items={unavailableItems} />
                )}
            </div> )}
            {pickupPoint.pickupStoreInfo &&
              pickupPoint.pickupStoreInfo.additionalInfo && (
              <div className="pkpmodal-details-group">
                <h3 className="pkpmodal-details-info-title">
                  {translate(intl, 'aditionalInfo')}
                </h3>
                {pickupPoint.pickupStoreInfo.additionalInfo}
              </div>
            )}

            {businessHours && (
              <div className="pkpmodal-details-group">
                <h3 className="pkpmodal-details-info-title">
                  {translate(intl, 'businessHours')}
                </h3>
                <table className="pkpmodal-details-hours">
                  {businessHours.map((day, i) => {
                    return (
                      <tr key={i}>
                        <td className="pkpmodal-details-hours-day">
                          {translate(intl, `weekDay${day.number}`)}
                        </td>
                        {day.closed ? (
                          <td className="pkpmodal-details-hours-closed">
                            {translate(intl, 'closed')}
                          </td>
                        ) : (
                          <td className="pkpmodal-details-hours-range">
                            <PickupPointHour time={day.openingTime} />{' '}
                            {translate(intl, 'hourTo')}{' '}
                            <PickupPointHour time={day.closingTime} />
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="pkpmodal-details-bottom">
          <Button
            id={`confirm-pickup-${pickupPoint.id
              .replace(/[^\w\s]/gi, '')
              .split(' ')
              .join('-')}`}
            kind="primary"
            large
            moreClassName="pkpmodal-details-confirm-btn"
            onClick={this.handleConfirmButtonClick}
            title={translate(intl, 'confirmPoint')}
          />
        </div>
      </div>
    )
  }
}

PickupPointDetails.propTypes = {
  handleChangeActiveSLAOption: PropTypes.func.isRequired,
  handleClosePickupPointsModal: PropTypes.func.isRequired,
  intl: intlShape,
  isSelectedSla: PropTypes.bool,
  items: PropTypes.array.isRequired,
  logisticsInfo: PropTypes.array.isRequired,
  onClickPickupModal: PropTypes.func,
  pickupPoint: PropTypes.object.isRequired,
  pickupPointInfo: PropTypes.object.isRequired,
  selectedRules: PropTypes.object.isRequired,
  sellerId: PropTypes.string,
  storePreferencesData: PropTypes.object.isRequired,
  togglePickupDetails: PropTypes.func.isRequired,
}

export default injectIntl(PickupPointDetails)
