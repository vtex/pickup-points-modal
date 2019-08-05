import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import Map from './components/Map'
import CloseButton from './components/CloseButton'
import styles from './index.css'
import ZoomControls from './components/ZoomControls'
import StateHandler from './components/StateHandler'
import ModalState from './ModalState'
import Geolocation from './Geolocation'
import SearchArea from './components/SearchArea'
import SearchOverlay from './assets/components/SearchOverlay'
import { injectIntl, intlShape } from 'react-intl'
import { withGoogleMaps } from './containers/withGoogleMaps'
import { translate } from './utils/i18nUtils'
import { newAddress } from './utils/newAddress'
import { HIDE_MAP, SHOW_MAP } from './constants'
import { getPickupOptionGeolocations } from './utils/pickupUtils'
import { helpers } from 'vtex.address-form'

const { validateField, addValidation } = helpers
const NULL_VALUE = {
  value: '',
}

class PickupPointsModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isMounted: false,
      mapStatus: HIDE_MAP,
      isLargeScreen: window.innerWidth > 1023,
      shouldUseMaps: !!props.googleMapsKey,
    }
  }

  componentDidMount() {
    if (
      !!this.props.selectedPickupPoint &&
      this.state.isPickupDetailsActive === null
    ) {
      this.setState({
        isPickupDetailsActive: true,
        mapStatus: HIDE_MAP,
        isMounted: true,
      })
    } else {
      this.setState({
        isMounted: true,
      })
    }
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount() {
    this.setState({ isMounted: false })
    window.removeEventListener('resize', this.resize, true)
  }

  resize = debounce(() => {
    if (!this.state.isMounted) return
    this.setState({
      isLargeScreen: window.innerWidth > 1023,
      mapStatus: window.innerWidth > 1023 ? SHOW_MAP : HIDE_MAP,
    })
  }, 200)

  updateLocationTab = mapStatus => this.setState({ mapStatus })

  activatePickupDetails = () =>
    this.setState({
      isPickupDetailsActive: true,
      mapStatus: HIDE_MAP,
    })

  getPostalCodeValue = address => {
    // TODO move this to Address Form
    if (
      address &&
      address.country &&
      address.country.value === 'ARG' &&
      address.postalCode &&
      address.postalCode.value
    ) {
      const corePostalCode = address.postalCode.value.match(/([0-9]{4})/g)

      return (
        (corePostalCode.length > 0 && corePostalCode[0]) ||
        address.postalCode.value
      )
    }

    return address.postalCode && address.postalCode.value
  }

  getValidPostalCode = address => {
    if (address.postalCode) {
      const postalCodevalue = this.getPostalCodeValue(address)

      const validatedPostalCode = {
        value: postalCodevalue,
        ...validateField(
          postalCodevalue,
          'postalCode',
          address,
          this.props.rules
        ),
      }

      if (this.props.isAPIEnabled) {
        return {
          ...address.postalCode,
          ...(address.postalCode && validatedPostalCode.valid
            ? validatedPostalCode
            : NULL_VALUE),
        }
      }

      return {
        ...address.postalCode,
        value: validatedPostalCode && validatedPostalCode.value,
        valid: validatedPostalCode && validatedPostalCode.valid,
        visited: null,
      }
    }
    return NULL_VALUE
  }

  handleAddressChange = address => {
    const { searchAddress } = this.props

    const addressValidated = {
      ...addValidation(
        newAddress({
          ...address,
          country:
            searchAddress &&
            searchAddress.country &&
            searchAddress.country.value,
        })
      ),
      neighborhood: address.neighborhood || NULL_VALUE,
      number: address.number || NULL_VALUE,
      postalCode: this.getValidPostalCode(address),
    }

    this.props.onAddressChange(addressValidated)
  }

  render() {
    const {
      activePickupPoint,
      askForGeolocation,
      changeActivePickupDetails,
      changeActiveSLAOption,
      closePickupPointsModal,
      googleMaps,
      intl,
      items,
      isSearching,
      loading,
      logisticsInfo,
      orderFormId,
      pickupOptions,
      pickupPoints,
      rules,
      salesChannel,
      searchAddress,
      sellerId,
      selectedPickupPoint,
      storePreferencesData,
      googleMapsKey,
    } = this.props

    const {
      isLargeScreen,
      isPickupDetailsActive,
      mapStatus,
      shouldUseMaps,
    } = this.state

    const shouldShowMap =
      shouldUseMaps && (isLargeScreen || mapStatus === SHOW_MAP)

    return (
      !loading && (
        <div>
          <div
            className={`${styles.modalBackdrop} pkpmodal-backdrop`}
            onClick={closePickupPointsModal}
          />
          <div className={`${styles.pkpmodal} pkpmodal`}>
            <CloseButton
              alt={translate(intl, 'closeButton')}
              onClickClose={closePickupPointsModal}
            />
            <ModalState
              address={searchAddress}
              askForGeolocation={askForGeolocation}
              googleMapsKey={googleMapsKey}
              isSearching={isSearching}
              items={items}
              logisticsInfo={logisticsInfo}
              pickupPoints={pickupPoints}
              pickupOptions={pickupOptions}
              salesChannel={salesChannel}
              orderFormId={orderFormId}
              selectedPickupPoint={selectedPickupPoint}>
              <Geolocation
                address={searchAddress}
                askForGeolocation={askForGeolocation}
                googleMaps={googleMaps}
                onChangeAddress={this.handleAddressChange}
                rules={rules}>
                <SearchArea
                  address={searchAddress}
                  shouldShow={shouldShowMap}
                  isLargeScreen={isLargeScreen}
                />
                <ZoomControls
                  isLargeScreen={isLargeScreen}
                  mapStatus={mapStatus}
                  shouldShow={shouldShowMap}
                />

                {shouldShowMap && (
                  <Map
                    activatePickupDetails={this.activatePickupDetails}
                    address={searchAddress}
                    changeActivePickupDetails={changeActivePickupDetails}
                    googleMaps={googleMaps}
                    handleAskForGeolocation={this.onAskForGeolocation}
                    isLargeScreen={isLargeScreen}
                    isLoadingGoogle={loading}
                    updateLocationTab={this.updateLocationTab}
                    isPickupDetailsActive={isPickupDetailsActive}
                    onChangeAddress={this.handleAddressChange}
                    rules={rules}
                    selectedPickupPointGeolocation={getPickupOptionGeolocations(
                      selectedPickupPoint
                    )}
                  />
                )}
                <SearchOverlay />
                <StateHandler
                  activePickupPoint={activePickupPoint}
                  askForGeolocation={askForGeolocation}
                  changeActiveSLAOption={changeActiveSLAOption}
                  closePickupPointsModal={closePickupPointsModal}
                  googleMaps={googleMaps}
                  intl={intl}
                  items={items}
                  isLargeScreen={isLargeScreen}
                  isSearching={isSearching}
                  handleAddressChange={this.handleAddressChange}
                  loading={loading}
                  mapStatus={mapStatus}
                  onAddressChange={this.handleAddressChange}
                  rules={rules}
                  searchAddress={searchAddress}
                  shouldUseMaps={shouldUseMaps}
                  sellerId={sellerId}
                  selectedPickupPoint={selectedPickupPoint}
                  storePreferencesData={storePreferencesData}
                  updateLocationTab={this.updateLocationTab}
                />
              </Geolocation>
            </ModalState>
          </div>
        </div>
      )
    )
  }
}

PickupPointsModal.propTypes = {
  activePickupPoint: PropTypes.object,
  askForGeolocation: PropTypes.bool,
  changeActivePickupDetails: PropTypes.func.isRequired,
  changeActiveSLAOption: PropTypes.func.isRequired,
  closePickupPointsModal: PropTypes.func.isRequired,
  googleMaps: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  items: PropTypes.array.isRequired,
  isSearching: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  logisticsInfo: PropTypes.array.isRequired,
  pickupOptions: PropTypes.array.isRequired,
  pickupPoints: PropTypes.array.isRequired,
  rules: PropTypes.object.isRequired,
  searchAddress: PropTypes.object.isRequired,
  sellerId: PropTypes.string,
  selectedPickupPoint: PropTypes.object,
  storePreferencesData: PropTypes.object.isRequired,
}

export default injectIntl(withGoogleMaps(PickupPointsModal))
