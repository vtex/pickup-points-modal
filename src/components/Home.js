import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import {
  SHOW_MAP,
  HIDE_MAP,
  ASK,
  WAITING,
  GRANTED,
  INSIDE_MODAL,
  OUTSIDE_MODAL,
} from '../constants'

import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'
import GeolocationInput from '@vtex/address-form/lib/geolocation/GeolocationInput'
import PickupPoint from './PickupPoint'
import PickupPointDetails from './PickupPointDetails'
import Input from './Input'
import PickupTabs from './PickupTabs'

import SearchIcon from '../assets/components/SearchIcon'
import GPS from '../assets/components/GPS'

import AskForGeolocation from './AskForGeolocation'
import Error from './Error'

class Home extends Component {
  onAskGeolocationClick = () => {
    navigator.permissions.query({ name: 'geolocation' }).then(permission => {
      this.props.onAskForGeolocationStatus(
        permission.state === GRANTED || process.env.NODE !== 'production'
          ? WAITING
          : ASK,
        INSIDE_MODAL
      )
      this.props.handleAskForGeolocation(true, INSIDE_MODAL)
    })
  }

  translate = id =>
    this.props.intl.formatMessage({
      id: `pickupPointsModal.${id}`,
    })

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
      handleAskForGeolocation,
      updateLocationTab,
      togglePickupDetails,
      changeActivePickupPointId,
      activePickupPoint,
      changeActivePickupDetails,
      showAskForGeolocation,
      errorStatus,
      showError,
      geolocationFrom,
    } = this.props

    const isNotShowingPickupDetailsAndHasPickupOptions =
      pickupOptions.length > 0 &&
      !isPickupDetailsActive &&
      (mapStatus === HIDE_MAP || largeScreen)

    return (
      <div
        className={`pickup-modal-info-bar ${mapStatus === SHOW_MAP &&
          'pickup-modal-info-bar-map'}`}
      >
        <div
          className={`pickup-modal-info-bar-container ${mapStatus ===
            SHOW_MAP && 'active'}`}
        >
          <div className="pickup-modal-header">
            <h4 className="pickup-modal-title">
              {isPickupDetailsActive
                ? this.translate('pointDetails')
                : this.translate('selectPickupPoint')}
            </h4>
          </div>

          {!isPickupDetailsActive && (
            <form
              id="pickup-modal-search"
              className="pickup-modal-search"
              onSubmit={event => event.preventDefault()}
              onFocus={this.props.setGeolocationFrom}
            >
              <GeolocationInput
                Input={Input}
                placeholder={this.translate('searchLocationMap')}
                loadingGoogle={loading}
                googleMaps={googleMaps}
                address={searchAddress}
                rules={rules}
                onChangeAddress={handleAddressChange}
              />
              {!isPickupDetailsActive &&
                navigator.geolocation && (
                  <button
                    type="button"
                    className="button-ask-geolocation btn btn-link"
                    onClick={this.onAskGeolocationClick}
                  >
                    <GPS />
                  </button>
                )}
              <SearchIcon />
            </form>
          )}

          {!isPickupDetailsActive && (
            <div className="pickup-tabs-container">
              <PickupTabs
                mapStatus={mapStatus}
                updateLocationTab={updateLocationTab}
              />
            </div>
          )}

          {showAskForGeolocation &&
            geolocationFrom === INSIDE_MODAL && (
              <AskForGeolocation
                address={searchAddress}
                googleMaps={googleMaps}
                onAskForGeolocation={this.props.handleAskForGeolocation}
                onChangeAddress={this.props.handleAddressChange}
                rules={rules}
                onGeolocationError={this.props.onGeolocationError}
                status={this.props.askForGeolocationStatus}
                onAskForGeolocationStatus={this.props.onAskForGeolocationStatus}
                askForGeolocation={this.props.showAskForGeolocation}
                geolocationFrom={INSIDE_MODAL}
              />
            )}

          {showError &&
            geolocationFrom === INSIDE_MODAL && (
              <Error
                onManualGeolocationError={this.props.onManualGeolocationError}
                status={errorStatus}
              />
            )}

          {!showAskForGeolocation &&
            !showError &&
            isNotShowingPickupDetailsAndHasPickupOptions && (
              <div className="pickup-modal-points-list">
                {pickupOptions.length > 0 &&
                  activePickupPoint && (
                    <div className="pickup-modal-points-item">
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
                  <div
                    key={pickupPoint.id}
                    className="pickup-modal-points-item"
                  >
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
        )}
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
  setGeolocationFrom: PropTypes.func.isRequired,
  togglePickupDetails: PropTypes.func.isRequired,
  changeActivePickupDetails: PropTypes.func.isRequired,
}

export default injectIntl(Home)
