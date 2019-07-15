import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './PickupSidebar.css'
import PickupPoint from './PickupPoint'
import { injectState } from '../modalStateContext'

class PickupPointsList extends PureComponent {
  render() {
    const {
      changeActivePickupDetails,
      activePickupPoint,
      pickupOptions,
      logisticsInfo,
      items,
      rules,
      sellerId,
      setActiveSidebarState,
      setSelectedPickupPoint,
      shouldUseMaps,
      storePreferencesData,
    } = this.props
    return (
      <div className={`${styles.pointsList} pkpmodal-points-list`}>
        {pickupOptions.map(pickupPoint => (
          <div
            className={`${styles.pointsItem} pkpmodal-points-item`}
            key={pickupPoint.id}>
            <PickupPoint
              handleChangeActivePickupDetails={changeActivePickupDetails}
              isList
              isSelected={pickupPoint === activePickupPoint}
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
  activePickupPoint: PropTypes.object.isRequired,
  changeActivePickupDetails: PropTypes.func,
  logisticsInfo: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  pickupOptions: PropTypes.array.isRequired,
  rules: PropTypes.object.isRequired,
  sellerId: PropTypes.string,
  setActiveSidebarState: PropTypes.func.isRequired,
  setSelectedPickupPoint: PropTypes.func.isRequired,
  shouldUseMaps: PropTypes.bool.isRequired,
  storePreferencesData: PropTypes.object.isRequired,
}

export default injectState(PickupPointsList)
