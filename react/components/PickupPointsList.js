import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './PickupSidebar.css'
import PickupPointInfo from './PickupPointInfo'
import { injectState } from '../modalStateContext'

class PickupPointsList extends PureComponent {
  render() {
    const {
      changeActivePickupDetails,
      externalPickupPoints,
      logisticsInfo,
      items,
      pickupOptions,
      rules,
      sellerId,
      setActiveSidebarState,
      setSelectedPickupPoint,
      shouldUseMaps,
      storePreferencesData,
    } = this.props
    return (
      <div className={`${styles.pointsList} pkpmodal-points-list`}>
        {pickupOptions.map((pickupPoint, index) => (
          <div
            className={`${styles.pointsItem} pkpmodal-points-item`}
            key={pickupPoint.id + index}>
            <PickupPointInfo
              handleChangeActivePickupDetails={changeActivePickupDetails}
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
        {externalPickupPoints &&
          externalPickupPoints.map((pickupPoint, index) => (
            <div
              className={`${styles.pointsItem} pkpmodal-points-item`}
              key={pickupPoint.id + index}>
              <PickupPointInfo
                handleChangeActivePickupDetails={changeActivePickupDetails}
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
      </div>
    )
  }
}

PickupPointsList.propTypes = {
  changeActivePickupDetails: PropTypes.func,
  externalPickupPoints: PropTypes.array,
  items: PropTypes.array.isRequired,
  logisticsInfo: PropTypes.array.isRequired,
  pickupOptions: PropTypes.array.isRequired,
  rules: PropTypes.object.isRequired,
  sellerId: PropTypes.string,
  setActiveSidebarState: PropTypes.func.isRequired,
  setSelectedPickupPoint: PropTypes.func.isRequired,
  shouldUseMaps: PropTypes.bool.isRequired,
  storePreferencesData: PropTypes.object.isRequired,
}

export default injectState(PickupPointsList)
