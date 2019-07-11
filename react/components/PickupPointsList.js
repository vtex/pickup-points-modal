import react, { PureComponent } from 'react'
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

export default injectState(PickupPointsList)
