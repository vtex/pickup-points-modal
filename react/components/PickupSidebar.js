import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { SHOW_MAP, HIDE_MAP, INSIDE_MODAL } from '../constants'
import classNames from 'classnames'
import { translate } from '../utils/i18nUtils'
import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'
import PickupPoint from './PickupPoint'
import PickupSidebarHeader from './PickupSidebarHeader'
import PickupPointDetails from './PickupPointDetails'
import Input from './Input'
import PickupTabs from './PickupTabs'
import GeolocationStatus from './GeolocationStatus'
import SearchForm from './SearchForm'

import PinWaiting from '../assets/components/PinWaiting'
import AskForGeolocation from './AskForGeolocation'
import Error from './Error'

import styles from './PickupSidebar.css'

class PickupSidebar extends Component {
  render() {
    const {
      activePickupPoint,
      changeActivePickupDetails,
      changeActivePickupPointId,
      changeActiveSLAOption,
      closePickupPointsModal,
      errorStatus,
      geolocationFrom,
      googleMaps,
      intl,
      isPickupDetailsActive,
      isLargeScreen,
      isLoading,
      items,
      logisticsInfo,
      mapStatus,
      onHandleAddressChange,
      pickupOptions,
      pickupPoints,
      rules,
      searchAddress,
      sellerId,
      selectedPickupPoint,
      showAskForGeolocation,
      showError,
      storePreferencesData,
      togglePickupDetails,
      updateLocationTab,
    } = this.props

    const isNotShowingPickupDetailsAndHasPickupOptions =
      pickupOptions.length > 0 &&
      !isPickupDetailsActive &&
      (mapStatus === HIDE_MAP || isLargeScreen)

    const hasPickups = pickupOptions.length !== 0
    const isInsideModal = geolocationFrom === INSIDE_MODAL

    return (
      <div
        className={classNames('pkpmodal-info-bar', styles.infoBar, {
          'pkpmodal-info-bar-map': mapStatus === SHOW_MAP,
        })}>
        <div
          className={classNames('pkpmodal-info-bar-container', styles.infoBarContainer, {
            infoBarContainerActive: mapStatus === SHOW_MAP,
          })}>
          <PickupSidebarHeader isPickupDetailsActive={isPickupDetailsActive} />
          {!isPickupDetailsActive && (
            <SearchForm
              address={searchAddress}
              googleMaps={googleMaps}
              Input={Input}
              isLoadingGoogle={isLoading}
              onAskForGeolocationStatus={this.props.onAskForGeolocationStatus}
              onChangeAddress={onHandleAddressChange}
              onHandleAskForGeolocation={this.props.onHandleAskForGeolocation}
              placeholder={translate(intl, 'searchLocationMap')}
              rules={rules}
              setGeolocationFrom={this.props.setGeolocationFrom}
            />
          )}

          {!isPickupDetailsActive &&
            hasPickups && (
            <div className={`pickup-tabs-container ${styles.tabsContainer}`}>
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
            <div className={`pkpmodal-locating-wrapper ${styles.locatingWrapper}`}>
              <GeolocationStatus
                Image={() => (
                  <div>
                    <div className="pkpmodal-locating-image-waiting">
                      <PinWaiting />
                    </div>
                    <div className="pkpmodal-locating-image-waiting-shadow" />
                  </div>
                )}
                subtitleBottom="geolocationEmptyInstructions"
                titleBottom="geolocationEmpty"
              />
            </div>
          )}

          {showAskForGeolocation &&
            isInsideModal && (
            <AskForGeolocation
              address={searchAddress}
              askForGeolocation={this.props.showAskForGeolocation}
              geolocationFrom={INSIDE_MODAL}
              googleMaps={googleMaps}
              onAskForGeolocation={this.props.onHandleAskForGeolocation}
              onAskForGeolocationStatus={this.props.onAskForGeolocationStatus}
              onChangeAddress={this.props.onHandleAddressChange}
              onGeolocationError={this.props.onGeolocationError}
              onManualGeolocation={this.props.onManualGeolocation}
              rules={rules}
              status={this.props.askForGeolocationStatus}
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
            <div className={`pkpmodal-points-list ${styles.pointsList}`}>
              {pickupOptions.map(pickupPoint => (
                <div className={`pkpmodal-points-item ${styles.pointsItem}`} key={pickupPoint.id}>
                  <PickupPoint
                    changeActivePickupPointId={changeActivePickupPointId}
                    handleChangeActivePickupDetails={
                      changeActivePickupDetails
                    }
                    isList
                    isSelected={pickupPoint === activePickupPoint}
                    items={items}
                    logisticsInfo={logisticsInfo}
                    pickupPoint={pickupPoint}
                    pickupPointId={pickupPoint.id}
                    selectedRules={rules}
                    sellerId={sellerId}
                    storePreferencesData={storePreferencesData}
                    togglePickupDetails={togglePickupDetails}
                  />
                </div>
              ))}
            </div>
          )}

          {!showAskForGeolocation &&
            !showError &&
            isPickupDetailsActive && (
            <PickupPointDetails
              handleChangeActiveSLAOption={changeActiveSLAOption}
              handleClosePickupPointsModal={closePickupPointsModal}
              items={items}
              logisticsInfo={logisticsInfo}
              pickupPoint={selectedPickupPoint}
              pickupPointInfo={pickupPoints.find(
                pickup => pickup.id === selectedPickupPoint.pickupPointId
              )}
              selectedRules={rules}
              sellerId={sellerId}
              storePreferencesData={storePreferencesData}
              togglePickupDetails={togglePickupDetails}
            />
          )}
        </div>
      </div>
    )
  }
}

PickupSidebar.propTypes = {
  activePickupPoint: PropTypes.object,
  askForGeolocationStatus: PropTypes.string,
  changeActivePickupDetails: PropTypes.func.isRequired,
  changeActivePickupPointId: PropTypes.func.isRequired,
  changeActiveSLAOption: PropTypes.func.isRequired,
  closePickupPointsModal: PropTypes.func.isRequired,
  errorStatus: PropTypes.string,
  geolocationFrom: PropTypes.string,
  googleMaps: PropTypes.object.isRequired,
  intl: intlShape,
  isLargeScreen: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  isPickupDetailsActive: PropTypes.bool,
  items: PropTypes.array.isRequired,
  logisticsInfo: PropTypes.array.isRequired,
  mapStatus: PropTypes.string.isRequired,
  onAskForGeolocationStatus: PropTypes.func.isRequired,
  onGeolocationError: PropTypes.func.isRequired,
  onHandleAddressChange: PropTypes.func.isRequired,
  onHandleAskForGeolocation: PropTypes.func.isRequired,
  onManualGeolocation: PropTypes.func.isRequired,
  onManualGeolocationError: PropTypes.func.isRequired,
  pickupOptions: PropTypes.array.isRequired,
  pickupPoints: PropTypes.array.isRequired,
  rules: PropTypes.object.isRequired,
  searchAddress: AddressShapeWithValidation,
  selectedPickupPoint: PropTypes.object,
  sellerId: PropTypes.string,
  setGeolocationFrom: PropTypes.func.isRequired,
  showAskForGeolocation: PropTypes.bool,
  showError: PropTypes.bool,
  storePreferencesData: PropTypes.object.isRequired,
  togglePickupDetails: PropTypes.func.isRequired,
  updateLocationTab: PropTypes.func.isRequired,
}

export default injectIntl(PickupSidebar)
