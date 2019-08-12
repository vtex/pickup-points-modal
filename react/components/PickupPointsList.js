import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import styles from './PickupSidebar.css'
import PickupPointInfo from './PickupPointInfo'
import { injectState } from '../modalStateContext'
import { translate } from '../utils/i18nUtils'
import { injectIntl, intlShape } from 'react-intl'
import Button from './Button'
import { BEST_PICKUPS_AMOUNT } from '../constants'

class PickupPointsList extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      showList: props.bestPickupOptions.length === 0,
    }
  }

  handleShowList = () => this.props.setShowOtherPickupPoints(true)

  render() {
    const {
      bestPickupOptions,
      externalPickupPoints,
      logisticsInfo,
      items,
      intl,
      pickupOptions,
      rules,
      sellerId,
      setActiveSidebarState,
      setSelectedPickupPoint,
      shouldUseMaps,
      showOtherPickupPoints,
      storePreferencesData,
    } = this.props

    return (
      <div className={`${styles.pointsList} pkpmodal-points-list`}>
        {bestPickupOptions.length > 0 && (
          <Fragment>
            <p className={styles.pickupListTitle}>
              {translate(intl, 'bestResults')}
            </p>
            {bestPickupOptions
              .filter((_, index) => index < BEST_PICKUPS_AMOUNT)
              .map(pickupPoint => (
                <div
                  className={`${styles.pointsItem} pkpmodal-points-item`}
                  key={`best-pickupPoint-${pickupPoint.id}`}>
                  <PickupPointInfo
                    isList
                    isBestPickupPoint
                    items={items}
                    logisticsInfo={logisticsInfo}
                    pickupPoint={pickupPoint}
                    pickupPointId={pickupPoint.id}
                    selectedRules={rules}
                    sellerId={sellerId}
                    setActiveSidebarState={setActiveSidebarState}
                    setSelectedPickupPoint={setSelectedPickupPoint}
                    shouldUseMaps={shouldUseMaps}
                    storePreferencesData={storePreferencesData}
                  />
                </div>
              ))}
            {!showOtherPickupPoints && (
              <Button
                id="pkpmodal-show-list-btn"
                kind="secondary"
                large
                moreClassName={`${
                  styles.showListButton
                } pkpmodal-show-list-btn`}
                onClick={this.handleShowList}
                title={translate(intl, 'showPickupPointsList')}
              />
            )}
          </Fragment>
        )}
        {showOtherPickupPoints && (
          <Fragment>
            <p className={styles.pickupListTitle}>
              {translate(intl, 'resultsOrderedByDistance')}
            </p>
            {pickupOptions.map(pickupPoint => (
              <div
                className={`${styles.pointsItem} pkpmodal-points-item`}
                key={`pickupPoint-${pickupPoint.id}`}>
                <PickupPointInfo
                  isList
                  items={items}
                  logisticsInfo={logisticsInfo}
                  pickupPoint={pickupPoint}
                  pickupPointId={pickupPoint.id}
                  selectedRules={rules}
                  sellerId={sellerId}
                  setActiveSidebarState={setActiveSidebarState}
                  setSelectedPickupPoint={setSelectedPickupPoint}
                  shouldUseMaps={shouldUseMaps}
                  storePreferencesData={storePreferencesData}
                />
              </div>
            ))}
            {externalPickupPoints.map(pickupPoint => (
              <div
                className={`${styles.pointsItem} pkpmodal-points-item`}
                key={`external-pickupPoint-${pickupPoint.id}`}>
                <PickupPointInfo
                  isList
                  items={items}
                  logisticsInfo={logisticsInfo}
                  pickupPoint={pickupPoint}
                  pickupPointId={pickupPoint.id}
                  selectedRules={rules}
                  sellerId={sellerId}
                  setActiveSidebarState={setActiveSidebarState}
                  setSelectedPickupPoint={setSelectedPickupPoint}
                  shouldUseMaps={shouldUseMaps}
                  storePreferencesData={storePreferencesData}
                />
              </div>
            ))}
          </Fragment>
        )}
      </div>
    )
  }
}

PickupPointsList.propTypes = {
  bestPickupOptions: PropTypes.array,
  changeActivePickupDetails: PropTypes.func,
  externalPickupPoints: PropTypes.array,
  intl: intlShape,
  items: PropTypes.array.isRequired,
  logisticsInfo: PropTypes.array.isRequired,
  pickupOptions: PropTypes.array.isRequired,
  rules: PropTypes.object.isRequired,
  sellerId: PropTypes.string,
  setActiveSidebarState: PropTypes.func.isRequired,
  setSelectedPickupPoint: PropTypes.func.isRequired,
  shouldUseMaps: PropTypes.bool.isRequired,
  showOtherPickupPoints: PropTypes.bool.isRequired,
  storePreferencesData: PropTypes.object.isRequired,
}

export default injectState(injectIntl(PickupPointsList))
