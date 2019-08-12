import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { formatCurrency, formatNumber } from '../utils/Currency'
import { formatDistance } from '../utils/Distance'
import { translate } from '../utils/i18nUtils'
import PinIcon from '../assets/components/PinIcon'
import TranslateEstimate from 'vtex.shipping-estimate-translator/TranslateEstimate'
import { AddressSummary } from '@vtex/address-form'
import { getUnavailableItemsAmount } from '../utils/pickupUtils'
import bestMarkerIcon from '../assets/icons/best_marker.svg'
import searchMarkerIcon from '../assets/icons/search_marker_icon.svg'
import styles from './PickupPoint.css'
import { injectState } from '../modalStateContext'
import UnavailableMarker from '../assets/components/UnavailableMarker'

const MAX_KILOMETERS = 1000
class PickupPointInfo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      unavailableItemsAmount: getUnavailableItemsAmount(
        props.items,
        props.logisticsInfo,
        props.pickupPoint.id,
        props.sellerId
      ),
      info:
        (props.pickupPoint && props.pickupPoint.pickupStoreInfo) ||
        props.pickupPoint,
      distance: props.pickupPoint.pickupDistance || props.pickupPoint.distance,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.pickupPoint.id !== prevProps.pickupPoint.id) {
      this.setState({
        info:
          (this.props.pickupPoint && this.props.pickupPoint.pickupStoreInfo) ||
          this.props.pickupPoint,
      })
    }
  }

  handleOpenPickupDetails = () => {
    const {
      isBestPickupPoint,
      pickupPoint,
      setSelectedPickupPoint,
      setShouldSearchArea,
    } = this.props

    setSelectedPickupPoint({
      pickupPoint,
      isBestPickupPoint,
    })
    setShouldSearchArea(false)
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
      intl,
      items,
      pickupPoint,
      selectedRules,
      shouldUseMaps,
      storePreferencesData,
      isList,
      isBestPickupPoint,
      isSelectedBestPickupPoint,
    } = this.props

    const { info, unavailableItemsAmount, distance } = this.state

    const pickupId = this.getCleanId()

    const distanceValue = formatNumber({
      value: distance && formatDistance(distance, intl.locale),
      storePreferencesData,
    })

    const shouldShowUnavailableAmount =
      unavailableItemsAmount !== items.length && unavailableItemsAmount > 0

    const sholdShowUnavailableMarker = !isList && !pickupPoint.pickupStoreInfo
    const sholdShowSearchMarker = isList && !pickupPoint.pickupStoreInfo
    const shouldShowEstimate = pickupPoint && pickupPoint.shippingEstimate
    const isBestPickupPointAndAvailable =
      pickupPoint.pickupStoreInfo &&
      (isBestPickupPoint || isSelectedBestPickupPoint)

    return (
      <div
        className={`${styles.pickupPoint} pkpmodal-pickup-point`}
        id={pickupId}
        onClick={this.handleOpenPickupDetails}>
        <div className={`${styles.pickupPointMain} pkpmodal-pickup-point-main`}>
          <div
            className={`${
              shouldUseMaps
                ? styles.pickupPointMarker
                : styles.pickupPointMarkerPostalCode
            } pkpmodal-pickup-point-marker`}>
            {sholdShowUnavailableMarker && <UnavailableMarker />}
            {sholdShowSearchMarker && (
              <img className={styles.searchMarkerIcon} src={searchMarkerIcon} />
            )}
            {isBestPickupPointAndAvailable && <img src={bestMarkerIcon} />}
            {!sholdShowSearchMarker &&
              !sholdShowUnavailableMarker &&
              !isBestPickupPointAndAvailable && <PinIcon />}
            {distance && (
              <p
                className={`${
                  styles.pickupPointDistance
                } pkpmodal-pickup-point-distance`}>
                {translate(intl, 'distance', {
                  distanceValue:
                    distance > MAX_KILOMETERS ? '1000+' : distanceValue,
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
              {info.friendlyName}
            </p>
            <div
              className={`${
                styles.pickupPointAddress
              } pkpmodal-pickup-point-address ${isList ? 'list' : ''}`}>
              <AddressSummary
                address={info.address}
                onClickMaskedInfoIcon={this.handleClickMaskedInfoIcon}
                rules={selectedRules}
              />
            </div>

            {unavailableItemsAmount === items.length && (
              <span
                className={`${
                  styles.pickupPointNoneAvailable
                } pkpmodal-pickup-point-available`}>
                {translate(intl, 'noneItemsAvailable')}
              </span>
            )}

            {shouldShowUnavailableAmount && (
              <span
                className={`${
                  styles.pickupPointAvailability
                } pkpmodal-pickup-point-availability`}>
                {translate(intl, 'unavailableItemsAmount', {
                  unavailableItemsAmount: unavailableItemsAmount,
                  itemsAmount: items.length,
                })}
              </span>
            )}

            {unavailableItemsAmount === 0 && (
              <span
                className={`${
                  styles.pickupPointAllAvailable
                } pkpmodal-pickup-point-available`}>
                {translate(intl, 'allItemsAvailable')}
              </span>
            )}
          </div>
        </div>
        {pickupPoint.pickupStoreInfo && (
          <div
            className={`${
              shouldUseMaps
                ? styles.pickupPointSlaAvailability
                : styles.pickupPointSlaAvailabilityPostalCode
            } pkpmodal-pickup-point-sla-availability`}>
            <span
              className={`${
                styles.pickupPointPrice
              } pkpmodal-pickup-point-price`}>
              {translate(intl, 'price', {
                value: pickupPoint && pickupPoint.price,
                formattedPrice: formatCurrency({
                  value: pickupPoint && pickupPoint.price,
                  storePreferencesData,
                }),
              })}
            </span>
            {shouldShowEstimate && (
              <span
                className={`${
                  styles.pickupPointSla
                } pkpmodal-pickup-point-sla`}>
                <TranslateEstimate
                  shippingEstimate={pickupPoint && pickupPoint.shippingEstimate}
                  isPickup
                />
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
}

PickupPointInfo.defaultProps = {
  showAddress: true,
  isBestPickupPoint: false,
}

PickupPointInfo.propTypes = {
  intl: intlShape.isRequired,
  isBestPickupPoint: PropTypes.bool,
  isSelectedBestPickupPoint: PropTypes.bool,
  isList: PropTypes.bool,
  items: PropTypes.any,
  liPackage: PropTypes.object,
  logisticsInfo: PropTypes.any,
  onChangeActivePickupPointId: PropTypes.func,
  onClickPickupModal: PropTypes.func,
  pickupPoint: PropTypes.object.isRequired,
  selectedRules: PropTypes.object.isRequired,
  sellerId: PropTypes.any,
  setSelectedPickupPoint: PropTypes.func.isRequired,
  setActiveSidebarState: PropTypes.func.isRequired,
  shouldUseMaps: PropTypes.bool,
  setShouldSearchArea: PropTypes.func.isRequired,
  showAddress: PropTypes.bool,
  storePreferencesData: PropTypes.object.isRequired,
  togglePickupDetails: PropTypes.func,
}

export default injectState(injectIntl(PickupPointInfo))
