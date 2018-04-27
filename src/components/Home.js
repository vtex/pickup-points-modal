import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { SHOW_MAP, HIDE_MAP, INSIDE_MODAL } from '../constants'

import { translate } from '../utils/i18nUtils'
import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'
import PickupPoint from './PickupPoint'
import PickupPointDetails from './PickupPointDetails'
import Input from './Input'
import PickupTabs from './PickupTabs'
import GeolocationStatus from './GeolocationStatus'
import SearchForm from './SearchForm'

import PinWaiting from '../assets/components/PinWaiting'

import AskForGeolocation from './AskForGeolocation'
import Error from './Error'

import './Home.css'

class Home extends Component {
  render() {
    const {
      mapStatus,
      isPickupDetailsActive,
      loading,
      googleMaps,
      searchAddress,
      rules,
      filteredPickupOptions,
      pickupOptions,
      items,
      logisticsInfo,
      sellerId,
      changeActiveSLAOption,
      storePreferencesData,
      closePickupPointsModal,
      selectedPickupPoint,
      largeScreen,
      handleAddressChange,
      updateLocationTab,
      togglePickupDetails,
      changeActivePickupPointId,
      activePickupPoint,
      changeActivePickupDetails,
      showAskForGeolocation,
      errorStatus,
      showError,
      geolocationFrom,
      intl,
    } = this.props

    const isNotShowingPickupDetailsAndHasPickupOptions =
      pickupOptions.length > 0 &&
      !isPickupDetailsActive &&
      (mapStatus === HIDE_MAP || largeScreen)

    const hasPickups = pickupOptions.length !== 0

    const isInsideModal = geolocationFrom === INSIDE_MODAL

    return (
      <div
        className={`pkpmodal-info-bar ${mapStatus === SHOW_MAP &&
          'pkpmodal-info-bar-map'}`}
      >
        <div
          className={`pkpmodal-info-bar-container ${mapStatus === SHOW_MAP &&
            'active'}`}
        >
          <div className="pkpmodal-header">
            <h4 className="pkpmodal-title">
              {isPickupDetailsActive
                ? translate(intl, 'pointDetails')
                : translate(intl, 'selectPickupPoint')}
            </h4>
          </div>

          {!isPickupDetailsActive && (
            <SearchForm
              Input={Input}
              placeholder={translate(intl, 'searchLocationMap')}
              loadingGoogle={loading}
              googleMaps={googleMaps}
              address={searchAddress}
              rules={rules}
              onChangeAddress={handleAddressChange}
              setGeolocationFrom={this.props.setGeolocationFrom}
              handleAskForGeolocation={this.props.handleAskForGeolocation}
              onAskForGeolocationStatus={this.props.onAskForGeolocationStatus}
            />
          )}

          {!isPickupDetailsActive &&
            hasPickups && (
              <div className="pickup-tabs-container">
                <PickupTabs
                  mapStatus={mapStatus}
                  updateLocationTab={updateLocationTab}
                />
              </div>
            )}

          {!showAskForGeolocation &&
            !showError &&
            !isPickupDetailsActive &&
            !hasPickups && (
              <div className="pkpmodal-locating">
                <GeolocationStatus
                  titleBottom="geolocationEmpty"
                  subtitleBottom="geolocationEmptyInstructions"
                  Image={() => (
                    <div>
                      <div className="pkpmodal-locating-image-waiting">
                        <PinWaiting />
                      </div>
                      <div className="pkpmodal-locating-image-waiting-shadow" />
                    </div>
                  )}
                />
              </div>
            )}

          {showAskForGeolocation &&
            isInsideModal && (
              <AskForGeolocation
                address={searchAddress}
                googleMaps={googleMaps}
                onAskForGeolocation={this.props.handleAskForGeolocation}
                onChangeAddress={this.props.handleAddressChange}
                rules={rules}
                onManualGeolocation={this.props.onManualGeolocation}
                onGeolocationError={this.props.onGeolocationError}
                status={this.props.askForGeolocationStatus}
                onAskForGeolocationStatus={this.props.onAskForGeolocationStatus}
                askForGeolocation={this.props.showAskForGeolocation}
                geolocationFrom={INSIDE_MODAL}
              />
            )}

          {showError &&
            isInsideModal && (
              <Error
                onManualGeolocationError={this.props.onManualGeolocationError}
                status={errorStatus}
              />
            )}

          {!showAskForGeolocation &&
            !showError &&
            isNotShowingPickupDetailsAndHasPickupOptions && (
              <div className="pkpmodal-points-list">
                {pickupOptions.length > 0 &&
                  activePickupPoint && (
                    <div className="pkpmodal-points-item">
                      <PickupPoint
                        items={items}
                        isList
                        logisticsInfo={logisticsInfo}
                        sellerId={sellerId}
                        togglePickupDetails={togglePickupDetails}
                        handleChangeActivePickupDetails={
                          changeActivePickupDetails
                        }
                        changeActivePickupPointId={changeActivePickupPointId}
                        selectedRules={rules}
                        pickupPoint={activePickupPoint}
                        storePreferencesData={storePreferencesData}
                        pickupPointId={activePickupPoint.id}
                        isSelected
                      />
                    </div>
                  )}

                {filteredPickupOptions.map(pickupPoint => (
                  <div key={pickupPoint.id} className="pkpmodal-points-item">
                    <PickupPoint
                      items={items}
                      isList
                      logisticsInfo={logisticsInfo}
                      sellerId={sellerId}
                      togglePickupDetails={togglePickupDetails}
                      handleChangeActivePickupDetails={
                        changeActivePickupDetails
                      }
                      changeActivePickupPointId={changeActivePickupPointId}
                      selectedRules={rules}
                      pickupPoint={pickupPoint}
                      storePreferencesData={storePreferencesData}
                      pickupPointId={pickupPoint.id}
                      isSelected={pickupPoint === activePickupPoint}
                    />
                  </div>
                ))}
              </div>
            )}

          {!showAskForGeolocation &&
            !showError &&
            isPickupDetailsActive && (
              <PickupPointDetails
                items={items}
                logisticsInfo={logisticsInfo}
                sellerId={sellerId}
                handleChangeActiveSLAOption={changeActiveSLAOption}
                togglePickupDetails={togglePickupDetails}
                storePreferencesData={storePreferencesData}
                handleClosePickupPointsModal={closePickupPointsModal}
                pickupPoint={selectedPickupPoint}
                selectedRules={rules}
              />
            )}
        </div>
      </div>
    )
  }
}

Home.propTypes = {
  intl: intlShape,
  mapStatus: PropTypes.string.isRequired,
  isPickupDetailsActive: PropTypes.bool,
  showAskForGeolocation: PropTypes.bool,
  errorStatus: PropTypes.string,
  showError: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  geolocationFrom: PropTypes.string,
  googleMaps: PropTypes.object.isRequired,
  activePickupPoint: PropTypes.object,
  searchAddress: AddressShapeWithValidation,
  rules: PropTypes.object.isRequired,
  filteredPickupOptions: PropTypes.array.isRequired,
  pickupOptions: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  logisticsInfo: PropTypes.array.isRequired,
  sellerId: PropTypes.string,
  changeActiveSLAOption: PropTypes.func.isRequired,
  storePreferencesData: PropTypes.object.isRequired,
  closePickupPointsModal: PropTypes.func.isRequired,
  selectedPickupPoint: PropTypes.object,
  largeScreen: PropTypes.bool,
  handleAddressChange: PropTypes.func.isRequired,
  onAskForGeolocationStatus: PropTypes.func.isRequired,
  handleAskForGeolocation: PropTypes.func.isRequired,
  updateLocationTab: PropTypes.func.isRequired,
  togglePickupDetails: PropTypes.func.isRequired,
  changeActivePickupPointId: PropTypes.func.isRequired,
  onManualGeolocationError: PropTypes.func.isRequired,
  onGeolocationError: PropTypes.func.isRequired,
  onManualGeolocation: PropTypes.func.isRequired,
  setGeolocationFrom: PropTypes.func.isRequired,
  togglePickupDetails: PropTypes.func.isRequired,
  changeActivePickupDetails: PropTypes.func.isRequired,
}

export default injectIntl(Home)
