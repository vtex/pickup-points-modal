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
import ArrowPrevious from '../assets/components/ArrowPrevious'
import ArrowNext from '../assets/components/ArrowNext'
import BackChevron from '../assets/components/BackChevron'
import styles from './PickupPointDetails.css'
import { LIST, ARROW_LEFT, ARROW_RIGHT } from '../constants'
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
      pickupPointInfo: this.getPickupInfo(props),
    }
  }

  componentDidMount() {
    if (!this.props.selectedPickupPoint) {
      this.props.setActiveSidebarState(LIST)
    }

    this.keyListener = document.addEventListener('keydown', event => {
      if (event.code === ARROW_LEFT) {
        this.props.selectPreviousPickupPoint()
      } else if (event.code === ARROW_RIGHT) {
        this.props.selectNextPickupPoint()
      }
    })
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyListener)
  }

  getPickupInfo(props) {
    return props.pickupPoints.find(
      pickupPoint => pickupPoint.id === props.selectedPickupPoint.pickupPointId
    )
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
      bestPickupOptions,
      isSelectedSla,
      logisticsInfo,
      intl,
      selectedPickupPoint,
      selectedRules,
      sellerId,
      shouldUseMaps,
      storePreferencesData,
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

    const confirmButtonId =
      selectedPickupPoint &&
      `confirm-pickup-${selectedPickupPoint.id
        .replace(/[^\w\s]/gi, '')
        .split(' ')
        .join('-')}`

    const pickupIndex =
      bestPickupOptions &&
      bestPickupOptions
        .map(pickupPoint => pickupPoint.pickupPointId || pickupPoint.id)
        .indexOf(selectedPickupPoint.pickupPointId || selectedPickupPoint.id)

    const isFirst = pickupIndex === 0
    const isLast =
      bestPickupOptions && pickupIndex === bestPickupOptions.length - 1

    return (
      <div className={`${styles.modalDetails} pkpmodal-details`}>
        <div className={`${styles.modalDetailsTop} pkpmodal-details-top`}>
          <button
            className={`${
              styles.modalDetailsBackLnk
            } pkpmodal-details-back-lnk btn btn-link`}
            onClick={this.handleBackButtonClick}
            type="button">
            <BackChevron />
            {translate(intl, 'cancelBackList')}
          </button>
        </div>

        <div
          className={`${styles.pickupDetailsHeader} pkpmodal-details-header`}>
          <p
            className={`${
              styles.pickupDetailsHeaderTitle
            } pkpmodal-details-header-title`}>
            {translate(intl, 'pointDetails')}
          </p>
          <div
            className={`${
              styles.pickupDetailsHeaderButtons
            } pkpmodal-details-header-buttons`}>
            <button
              className={`${styles.pickupDetailsHeaderButton} ${
                isFirst ? styles.firstOrLast : ''
              } pkpmodal-details-header-button`}
              onClick={() => this.props.selectPreviousPickupPoint()}>
              <ArrowPrevious />
            </button>
            <button
              className={`${styles.pickupDetailsHeaderButton} ${
                isLast ? styles.firstOrLast : ''
              } pkpmodal-details-header-button`}
              onClick={() => this.props.selectNextPickupPoint()}>
              <ArrowNext />
            </button>
          </div>
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
              id={confirmButtonId}
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
  bestPickupOptions: PropTypes.array.isRequired,
  handleChangeActiveSLAOption: PropTypes.func.isRequired,
  handleClosePickupPointsModal: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  isSelectedSla: PropTypes.bool,
  items: PropTypes.array.isRequired,
  logisticsInfo: PropTypes.array.isRequired,
  onClickPickupModal: PropTypes.func,
  selectedRules: PropTypes.object.isRequired,
  selectedPickupPoint: PropTypes.object.isRequired,
  sellerId: PropTypes.string,
  storePreferencesData: PropTypes.object.isRequired,
  setActiveSidebarState: PropTypes.func.isRequired,
  selectNextPickupPoint: PropTypes.func,
  selectPreviousPickupPoint: PropTypes.func,
  shouldUseMaps: PropTypes.bool.isRequired,
}

export default injectState(injectIntl(PickupPointDetails))
