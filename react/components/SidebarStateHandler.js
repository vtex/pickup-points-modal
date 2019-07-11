import React, { PureComponent } from 'react'
import {
  DETAILS,
  LIST,
  SEARCHING,
  ERROR_COULD_NOT_GETLOCATION,
  ERROR_NOT_FOUND,
} from '../constants'
import PickupPointsList from './PickupPointsList'
import PickupPointDetails from './PickupPointDetails'
import SearchingState from './SearchingState'
import ErrorState from './ErrorState'
import PinLocationUnknown from '../assets/components/PinLocationUnknown'
import PinNoPickups from '../assets/components/PinNoPickups'
import { injectState } from '../modalStateContext'

class SidebarStateHandler extends PureComponent {
  render() {
    const {
      activeSidebarState,
      activePickupPoint,
      changeActiveSLAOption,
      closePickupPointsModal,
      logisticsInfo,
      items,
      pickupOptions,
      rules,
      styles,
      sellerId,
      shouldUseMaps,
      pickupPoints,
      selectedPickupPoint,
      storePreferencesData,
    } = this.props

    switch (activeSidebarState) {
      case SEARCHING: {
        return (
          <SearchingState
            activeSidebarState={activeSidebarState}
            isFullPage={false}
          />
        )
      }

      case ERROR_COULD_NOT_GETLOCATION: {
        return (
          <ErrorState
            Icon={PinLocationUnknown}
            title="errorCouldNotGetLocation"
            subtitle="errorCouldNotGetLocationSubtitle"
            isFullPage={false}
          />
        )
      }

      case ERROR_NOT_FOUND: {
        return (
          <ErrorState
            Icon={PinNoPickups}
            title="errorNotFound"
            subtitle="errorNotFoundSubtitle"
            isFullPage={false}
          />
        )
      }

      case LIST: {
        return (
          <PickupPointsList
            activePickupPoint={activePickupPoint}
            pickupOptions={pickupOptions}
            logisticsInfo={logisticsInfo}
            items={items}
            rules={rules}
            styles={styles}
            sellerId={sellerId}
            shouldUseMaps={shouldUseMaps}
            storePreferencesData={storePreferencesData}
          />
        )
      }

      case DETAILS:
        return (
          <PickupPointDetails
            handleChangeActiveSLAOption={changeActiveSLAOption}
            handleClosePickupPointsModal={closePickupPointsModal}
            items={items}
            logisticsInfo={logisticsInfo}
            pickupPoint={selectedPickupPoint}
            pickupPointInfo={pickupPoints.find(
              pickup =>
                pickup.id === selectedPickupPoint.pickupPointId ||
                pickup.id === selectedPickupPoint.id
            )}
            selectedRules={rules}
            sellerId={sellerId}
            shouldUseMaps={shouldUseMaps}
            storePreferencesData={storePreferencesData}
          />
        )

      default:
        return <div />
    }
  }
}

export default injectState(SidebarStateHandler)
