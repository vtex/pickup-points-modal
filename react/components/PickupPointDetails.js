import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils/i18nUtils'

import {
  getUnavailableItemsByPickup,
  getItemsWithPickupPoint,
  formatBusinessHoursList,
} from '../utils/pickupUtils'

import PickupPointInfo from './PickupPointInfo'
import ProductItems from './ProductItems'
import PickupPointHour from './PickupPointHour'
import Button from './Button'

import styles from './PickupPointDetails.css'
import { LIST } from '../constants'
import { injectState } from '../modalStateContext'
import { updateShippingData } from '../fetchers'

class PickupPointDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      unavailableItems: getUnavailableItemsByPickup(
        props.items,
        props.logisticsInfo,
        props.selectedPickupPoint,
        props.sellerId
      ),
      items: getItemsWithPickupPoint(
        props.items,
        props.logisticsInfo,
        props.selectedPickupPoint,
        props.sellerId
      ),
      pickupPointInfo:
        props.selectedPickupPoint.pickupStoreInfo || props.selectedPickupPoint,
    }
  }

  componentDidMount() {
    if (!this.props.selectedPickupPoint) {
      this.props.setActiveSidebarState(LIST)
    }
  }

  handleBackButtonClick = () => {
    this.props.setActiveSidebarState(LIST)
  }

  handleConfirmButtonClick = () => {
    updateShippingData(this.props.logisticsInfo, this.props.selectedPickupPoint)
    this.props.handleClosePickupPointsModal()
  }

  render() {
    const {
      selectedPickupPoint,
      selectedRules,
      isSelectedSla,
      sellerId,
      shouldUseMaps,
      intl,
      storePreferencesData,
      logisticsInfo,
    } = this.props

    const { unavailableItems, items, pickupPointInfo } = this.state

    const businessHours =
      !pickupPointInfo ||
      !pickupPointInfo.businessHours ||
      pickupPointInfo.businessHours.length === 0
        ? null
        : formatBusinessHoursList(pickupPointInfo.businessHours)

    const hasAditionalInfo =
      selectedPickupPoint.pickupStoreInfo &&
      selectedPickupPoint.pickupStoreInfo.additionalInfo

    const shouldShowSelectPickupButton =
      selectedPickupPoint && selectedPickupPoint.pickupStoreInfo

    return (
      <div className={`${styles.modalDetails} pkpmodal-details`}>
        <div className={`${styles.modalDetailsTop} pkpmodal-details-top`}>
          <button
            className={`${
              styles.modalDetailsBackLnk
            } pkpmodal-details-back-lnk btn btn-link`}
            onClick={this.handleBackButtonClick}
            type="button">
            <i
              className={`${
                styles.iconBackPickupPointsList
              } pkpmodal-icon-back-pickup-points-list icon-angle-left`}
            />
            {translate(intl, 'cancelBackList')}
          </button>
        </div>

        <div className={`${styles.modalDetailsMiddle} pkpmodal-details-middle`}>
          <div className={`${styles.modalDetailsStore} pkpmodal-details-store`}>
            <PickupPointInfo
              shouldUseMaps={shouldUseMaps}
              isSelected={isSelectedSla}
              items={this.props.items}
              logisticsInfo={logisticsInfo}
              pickupPoint={selectedPickupPoint}
              selectedRules={selectedRules}
              sellerId={sellerId}
              storePreferencesData={storePreferencesData}
            />
          </div>

          <div className={`${styles.modalDetailsInfo} pkpmodal-details-info`}>
            <div
              className={`${styles.modalDetailsGroup} pkpmodal-details-group`}>
              <h3
                className={`${
                  styles.modalDetailsInfoTitle
                } title pkpmodal-details-info-title`}>
                {translate(intl, 'productsInPoint')}
              </h3>
              {items && <ProductItems items={items} />}
              {unavailableItems && (
                <ProductItems isAvailable={false} items={unavailableItems} />
              )}
            </div>
            {hasAditionalInfo && (
              <div
                className={`${
                  styles.modalDetailsGroup
                } pkpmodal-details-group`}>
                <h3
                  className={`${
                    styles.modalDetailsInfoTitle
                  } pkpmodal-details-info-title`}>
                  {translate(intl, 'aditionalInfo')}
                </h3>
                {selectedPickupPoint.pickupStoreInfo.additionalInfo}
              </div>
            )}

            {businessHours && (
              <div
                className={`${
                  styles.modalDetailsGroup
                } pkpmodal-details-group`}>
                <h3
                  className={`${
                    styles.modalDetailsInfoTitle
                  } pkpmodal-details-info-title`}>
                  {translate(intl, 'businessHours')}
                </h3>
                <table
                  className={`${
                    styles.modalDetailsHours
                  } pkpmodal-details-hours`}>
                  <tbody>
                    {businessHours.map((day, i) => {
                      return (
                        <tr key={i}>
                          <td
                            className={`${
                              styles.modalDetailsHoursDay
                            } pkpmodal-details-hours-day`}>
                            {translate(intl, `weekDay${day.number}`)}
                          </td>
                          {day.closed ? (
                            <td
                              className={`${
                                styles.modalDetailsHoursClosed
                              } pkpmodal-details-hours-closed`}>
                              {translate(intl, 'closed')}
                            </td>
                          ) : (
                            <td
                              className={`${
                                styles.modalDetailsHoursRange
                              } pkpmodal-details-hours-range`}>
                              <PickupPointHour time={day.openingTime} />{' '}
                              {translate(intl, 'hourTo')}{' '}
                              <PickupPointHour time={day.closingTime} />
                            </td>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {shouldShowSelectPickupButton && (
          <div
            className={`${styles.modalDetailsBottom} pkpmodal-details-bottom`}>
            <Button
              id={`confirm-pickup-${selectedPickupPoint.id
                .replace(/[^\w\s]/gi, '')
                .split(' ')
                .join('-')}`}
              kind="primary"
              large
              moreClassName={`${
                styles.modalDetailConfirmBtn
              } pkpmodal-details-confirm-btn`}
              onClick={this.handleConfirmButtonClick}
              title={translate(intl, 'confirmPoint')}
            />
          </div>
        )}
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
  selectedRules: PropTypes.object.isRequired,
  selectedPickupPoint: PropTypes.object.isRequired,
  sellerId: PropTypes.string,
  storePreferencesData: PropTypes.object.isRequired,
  setActiveSidebarState: PropTypes.func.isRequired,
  shouldUseMaps: PropTypes.bool.isRequired,
}

export default injectState(injectIntl(PickupPointDetails))
