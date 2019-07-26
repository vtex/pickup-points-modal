import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import EmptySearch from './EmptySearch'
import SearchingState from './SearchingState'
import ErrorState from './ErrorState'
import PickupSidebar from './PickupSidebar'
import PinLocationUnknown from '../assets/components/PinLocationUnknown'
import PinNoPickups from '../assets/components/PinNoPickups'
import {
  INITIAL,
  SEARCHING,
  ERROR_COULD_NOT_GETLOCATION,
  ERROR_NOT_FOUND,
  SIDEBAR,
  GEOLOCATION_SEARCHING,
} from '../constants'
import { injectState } from '../modalStateContext'
import { intlShape } from 'react-intl'

class StateHandler extends PureComponent {
  render() {
    const {
      activeState,
      activePickupPoint,
      askForGeolocation,
      changeActiveSLAOption,
      closePickupPointsModal,
      googleMaps,
      intl,
      isLargeScreen,
      isSearching,
      items,
      loading,
      logisticsInfo,
      mapStatus,
      onAddressChange,
      pickupOptions,
      pickupPoints,
      rules,
      searchAddress,
      sellerId,
      shouldUseMaps,
      storePreferencesData,
      updateLocationTab,
    } = this.props

    switch (activeState) {
      case INITIAL: {
        return (
          <EmptySearch
            askForGeolocation={askForGeolocation}
            googleMaps={googleMaps}
            intl={intl}
            handleAddressChange={onAddressChange}
            loading={loading}
            logisticsInfo={logisticsInfo}
            rules={rules}
            searchAddress={searchAddress}
            shouldUseMaps={shouldUseMaps}
          />
        )
      }

      case GEOLOCATION_SEARCHING:
      case SEARCHING: {
        return <SearchingState activeState={activeState} />
      }

      case ERROR_COULD_NOT_GETLOCATION: {
        return (
          <ErrorState
            Icon={PinLocationUnknown}
            title="errorCouldNotGetLocation"
            subtitle="errorCouldNotGetLocationSubtitle"
          />
        )
      }

      case ERROR_NOT_FOUND: {
        return (
          <ErrorState
            Icon={PinNoPickups}
            title="errorNotFound"
            subtitle="errorNotFoundSubtitle"
          />
        )
      }

      case SIDEBAR: {
        return (
          <PickupSidebar
            activePickupPoint={activePickupPoint}
            changeActiveSLAOption={changeActiveSLAOption}
            closePickupPointsModal={closePickupPointsModal}
            googleMaps={googleMaps}
            isLargeScreen={isLargeScreen}
            isSearching={isSearching}
            isLoading={loading}
            items={items}
            logisticsInfo={logisticsInfo}
            mapStatus={mapStatus}
            onHandleAddressChange={onAddressChange}
            pickupOptions={pickupOptions}
            pickupPoints={pickupPoints}
            rules={rules}
            searchAddress={searchAddress}
            shouldUseMaps={shouldUseMaps}
            sellerId={sellerId}
            storePreferencesData={storePreferencesData}
            updateLocationTab={updateLocationTab}
          />
        )
      }
    }
  }
}

StateHandler.propTypes = {
  activeState: PropTypes.string.isRequired,
  activePickupPoint: PropTypes.object,
  askForGeolocation: PropTypes.bool,
  changeActiveSLAOption: PropTypes.func.isRequired,
  closePickupPointsModal: PropTypes.func.isRequired,
  googleMaps: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  isLargeScreen: PropTypes.bool.isRequired,
  isSearching: PropTypes.bool,
  items: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  logisticsInfo: PropTypes.array.isRequired,
  mapStatus: PropTypes.string,
  onAddressChange: PropTypes.func.isRequired,
  pickupOptions: PropTypes.array.isRequired,
  pickupPoints: PropTypes.array.isRequired,
  rules: PropTypes.object.isRequired,
  searchAddress: PropTypes.object.isRequired,
  sellerId: PropTypes.string,
  shouldUseMaps: PropTypes.bool,
  storePreferencesData: PropTypes.object.isRequired,
  updateLocationTab: PropTypes.func,
}

export default injectState(StateHandler)
