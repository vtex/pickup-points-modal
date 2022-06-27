import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import PickupPointDetails from './PickupPointDetails'
import PickupPointsList from './PickupPointsList'
import SearchingState from './SearchingState'
import ErrorState from './ErrorState'
import PinLocationUnknown from '../assets/components/PinLocationUnknown'
import PinNoPickups from '../assets/components/PinNoPickups'
import {
  DETAILS,
  LIST,
  SEARCHING,
  ERROR_COULD_NOT_GETLOCATION,
  ERROR_NOT_FOUND,
  GEOLOCATION_SEARCHING,
} from '../constants'
import { injectState } from '../modalStateContext'

class SidebarStateHandler extends PureComponent {
  render() {
    const {
      activeSidebarState,
      changeActiveSLAOption,
      onClosePickupPointsModal,
      items,
      rules,
      styles,
      sellerId,
      shouldUseMaps,
      storePreferencesData,
    } = this.props

    switch (activeSidebarState) {
      case GEOLOCATION_SEARCHING:

      // eslint-disable-next-line no-fallthrough
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
            handleClosePickupPointsModal={onClosePickupPointsModal}
            items={items}
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

SidebarStateHandler.propTypes = {
  activeSidebarState: PropTypes.string.isRequired,
  changeActiveSLAOption: PropTypes.func.isRequired,
  onClosePickupPointsModal: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  pickupOptions: PropTypes.array.isRequired,
  rules: PropTypes.object.isRequired,
  sellerId: PropTypes.string,
  shouldUseMaps: PropTypes.bool.isRequired,
  styles: PropTypes.object.isRequired,
  selectedPickupPoint: PropTypes.object,
  storePreferencesData: PropTypes.object.isRequired,
}

export default injectState(SidebarStateHandler)
