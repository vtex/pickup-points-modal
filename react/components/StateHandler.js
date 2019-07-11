import React, { PureComponent } from 'react'
import EmptySearch from './EmptySearch'
import {
  INITIAL,
  SEARCHING,
  ERROR_COULD_NOT_GETLOCATION,
  ERROR_NOT_ALLOWED,
  ERROR_NOT_FOUND,
  SIDEBAR,
  GEOLOCATION_SEARCHING,
} from '../constants'
import SearchingState from './SearchingState'
import ErrorState from './ErrorState'
import PickupSidebar from './PickupSidebar'
import PinLocationUnknown from '../assets/components/PinLocationUnknown'
import PinNoPickups from '../assets/components/PinNoPickups'
import { injectState } from '../modalStateContext'

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

export default injectState(StateHandler)
