import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'
import PickupSidebarHeader from './PickupSidebarHeader'
import Input from './Input'
import PickupTabs from './PickupTabs'
import SearchForm from './SearchForm'
import styles from './PickupSidebar.css'
import SidebarStateHandler from './SidebarStateHandler'
import { injectIntl, intlShape } from 'react-intl'
import { SHOW_MAP, DETAILS } from '../constants'
import { translate } from '../utils/i18nUtils'
import { getShipsTo } from '../utils/AddressUtils'
import { injectState } from '../modalStateContext'

class PickupSidebar extends Component {
  getAddress = () => {
    const { searchAddress } = this.props
    const { city, postalCode, neighborhood, street } = searchAddress

    return (
      (street && street.value) ||
      (city.value &&
        neighborhood.value &&
        `${city.value} > ${neighborhood.value}`) ||
      (city && city.value) ||
      (postalCode && postalCode.value)
    )
  }

  render() {
    const {
      activePickupPoint,
      activeSidebarState,
      changeActiveSLAOption,
      closePickupPointsModal,
      googleMaps,
      intl,
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
      setGeolocationStatus,
      shouldUseMaps,
      storePreferencesData,
      updateLocationTab,
      selectedPickupPoint,
    } = this.props

    const hasPickups = pickupOptions.length !== 0

    const isPickupDetailsActive = activeSidebarState === DETAILS

    const shouldShowPickupTabs =
      !isPickupDetailsActive && hasPickups && shouldUseMaps

    const shouldShowSearchForm = !isPickupDetailsActive && shouldUseMaps

    return (
      <div
        className={classNames(
          shouldUseMaps ? styles.infoBar : styles.infoBarPostalCode,
          mapStatus === SHOW_MAP && styles.infoBarMap,
          'pkpmodal-info-bar',
          {
            'pkpmodal-info-bar-map': mapStatus === SHOW_MAP,
          }
        )}>
        <div
          className={classNames(
            styles.infoBarContainer,
            'pkpmodal-info-bar-container',
            {
              infoBarContainerActive: mapStatus === SHOW_MAP,
            }
          )}>
          <PickupSidebarHeader isPickupDetailsActive={isPickupDetailsActive} />
          {shouldShowSearchForm && (
            <SearchForm
              address={searchAddress}
              googleMaps={googleMaps}
              Input={Input}
              isLoadingGoogle={isLoading}
              isGeolocation={shouldUseMaps}
              isSidebar
              onChangeAddress={onHandleAddressChange}
              placeholder={translate(intl, 'searchLocationMap')}
              rules={rules}
              setGeolocationStatus={setGeolocationStatus}
              shipsTo={getShipsTo(intl, logisticsInfo)}
            />
          )}

          {shouldShowPickupTabs && (
            <div className={`${styles.tabsContainer} pickup-tabs-container`}>
              <PickupTabs
                mapStatus={mapStatus}
                updateLocationTab={updateLocationTab}
                setActiveSidebarState={this.setActiveSidebarState}
              />
            </div>
          )}

          <SidebarStateHandler
            changeActiveSLAOption={changeActiveSLAOption}
            closePickupPointsModal={closePickupPointsModal}
            activeSidebarState={activeSidebarState}
            activePickupPoint={activePickupPoint}
            logisticsInfo={logisticsInfo}
            items={items}
            pickupOptions={pickupOptions}
            pickupPoints={pickupPoints}
            rules={rules}
            selectedPickupPoint={selectedPickupPoint}
            sellerId={sellerId}
            shouldUseMaps={shouldUseMaps}
            storePreferencesData={storePreferencesData}
            styles={styles}
            setActiveSidebarState={this.props.setActiveSidebarState}
            setSelectedPickupPoint={this.props.setSelectedPickupPoint}
          />
        </div>
      </div>
    )
  }
}

PickupSidebar.propTypes = {
  activeSidebarState: PropTypes.string,
  activePickupPoint: PropTypes.object,
  setSelectedPickupPoint: PropTypes.func.isRequired,
  changeActiveSLAOption: PropTypes.func.isRequired,
  closePickupPointsModal: PropTypes.func.isRequired,
  googleMaps: PropTypes.object,
  intl: intlShape,
  isLoading: PropTypes.bool,
  items: PropTypes.array.isRequired,
  logisticsInfo: PropTypes.array.isRequired,
  mapStatus: PropTypes.string.isRequired,
  onHandleAddressChange: PropTypes.func.isRequired,
  pickupOptions: PropTypes.array.isRequired,
  pickupPoints: PropTypes.array.isRequired,
  rules: PropTypes.object.isRequired,
  searchAddress: AddressShapeWithValidation,
  selectedPickupPoint: PropTypes.object,
  sellerId: PropTypes.string,
  setGeolocationStatus: PropTypes.func.isRequired,
  setActiveSidebarState: PropTypes.func.isRequired,
  shouldUseMaps: PropTypes.bool,
  storePreferencesData: PropTypes.object.isRequired,
  updateLocationTab: PropTypes.func.isRequired,
}

export default injectState(injectIntl(PickupSidebar))
