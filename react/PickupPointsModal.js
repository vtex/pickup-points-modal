import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import { injectIntl, intlShape } from 'react-intl'
import { helpers } from 'vtex.address-form'

import Map from './components/Map.jsx'
import CloseButton from './components/CloseButton'
import styles from './index.css'
import ZoomControls from './components/ZoomControls'
import StateHandler from './components/StateHandler'
import ModalState from './ModalState'
import Geolocation from './Geolocation'
import SearchArea from './components/SearchArea'
import SearchOverlay from './assets/components/SearchOverlay'
import { withGoogleMaps } from './containers/withGoogleMaps'
import { translate } from './utils/i18nUtils'
import { newAddress } from './utils/newAddress'
import { HIDE_MAP, SHOW_MAP } from './constants'
import { getPickupOptionGeolocations } from './utils/pickupUtils'
import {
  closePickupPointsModalEvent,
  openPickupPointsModalEvent,
  searchPickupAddressByGeolocationEvent,
} from './utils/metrics'

const { validateField, addValidation } = helpers
const NULL_VALUE = {
  value: '',
}

class PickupPointsModal extends Component {
  startTime = null

  constructor(props) {
    super(props)

    this.state = {
      addressQuery: {
        value:
          (props.searchAddress &&
            props.searchAddress.street &&
            props.searchAddress.street.value) ||
          '',
      },
      isMounted: false,
      mapStatus: HIDE_MAP,
      isLargeScreen: window.innerWidth > 1023,
      shouldUseMaps: !!props.googleMapsKey,
      innerWidth: window.innerWidth,
      isLoadingGeolocation: null,
    }
  }

  componentDidMount() {
    const { style } = document.body

    style.overflow = 'hidden'
    style.position = 'fixed'
    style.width = '100%'

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

    this.startTime = Date.now()

    window.addEventListener('resize', this.resize)
    openPickupPointsModalEvent()
  }

  componentWillUnmount() {
    this.setState({ isMounted: false })
    window.removeEventListener('resize', this.resize, true)
  }

  resize = debounce(() => {
    // On mobile browsers trigger the resize event when keyboard is opened
    // even though the screen size itself is the same
    const isWidthEqual = this.state.innerWidth === window.innerWidth

    if (!this.state.isMounted || isWidthEqual) return
    this.setState({
      isLargeScreen: window.innerWidth > 1023,
      mapStatus: window.innerWidth > 1023 ? SHOW_MAP : HIDE_MAP,
      innerWidth: window.innerWidth,
    })
  }, 200)

  updateLocationTab = (mapStatus) => this.setState({ mapStatus })

  activatePickupDetails = () =>
    this.setState({
      isPickupDetailsActive: true,
      mapStatus: HIDE_MAP,
    })

  getPostalCodeValue = (address) => {
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

  getValidPostalCode = (address) => {
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

  handleAddressChange = (address) => {
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

    this.setState({ addressQuery: addressValidated.addressQuery })
    this.props.onAddressChange(addressValidated)
  }

  handleManuallyCloseModal = () => {
    closePickupPointsModalEvent()
    this.handleCloseModal()
  }

  handleCloseModal = () => {
    const { style } = document.body

    style.overflow = 'auto'
    style.position = ''
    if (this.state.isLoadingGeolocation) {
      const elapsedTime = Date.now() - this.startTime

      searchPickupAddressByGeolocationEvent({
        closedWhileLoading: true,
        elapsedTime,
      })
    }

    this.props.closePickupPointsModal()
  }

  handleChangeGeolocationLoading = (event) => {
    this.setState({ isLoadingGeolocation: event.loading })
  }

  render() {
    const {
      activePickupPoint,
      askForGeolocation,
      changeActivePickupDetails,
      changeActiveSLAOption,
      googleMaps,
      intl,
      items,
      isSearching,
      loading,
      logisticsInfo,
      orderFormId,
      pickupOptions,
      pickupPoints,
      residentialAddress,
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
      addressQuery,
    } = this.state

    const shouldShowMap =
      shouldUseMaps && (isLargeScreen || mapStatus === SHOW_MAP)

    const searchAddressWithAddressQuery = {
      ...searchAddress,
      addressQuery,
    }

    return (
      !loading && (
        <div>
          <div
            className={`${styles.modalBackdrop} pkpmodal-backdrop`}
            onClick={this.handleManuallyCloseModal}
          />
          <div className={`${styles.pkpmodal} pkpmodal`}>
            <CloseButton
              alt={translate(intl, 'closeButton')}
              onClickClose={this.handleManuallyCloseModal}
            />
            <ModalState
              activePickupPoint={activePickupPoint}
              address={searchAddressWithAddressQuery}
              residentialAddress={residentialAddress}
              askForGeolocation={askForGeolocation}
              googleMapsKey={googleMapsKey}
              isSearching={isSearching}
              items={items}
              logisticsInfo={logisticsInfo}
              mapStatus={mapStatus}
              pickupPoints={pickupPoints}
              pickupOptions={pickupOptions}
              salesChannel={salesChannel}
              orderFormId={orderFormId}
              selectedPickupPoint={selectedPickupPoint}
            >
              <Geolocation
                address={searchAddressWithAddressQuery}
                askForGeolocation={askForGeolocation}
                googleMaps={googleMaps}
                onChangeAddress={this.handleAddressChange}
                onChangeGeolocationState={this.handleChangeGeolocationLoading}
                rules={rules}
              >
                <SearchArea
                  address={searchAddressWithAddressQuery}
                  mapStatus={mapStatus}
                  shouldShow={shouldShowMap}
                  isLargeScreen={isLargeScreen}
                />
                {/*
                 * Used for rendering the <ZoomControls /> component. This is
                 * currently done this way because the ZoomControls must be a child of <Map />
                 * to be able to consume the <GoogleMaps /> context, but it must be placed in
                 * this position for the layout to work
                 */}
                <div id="controls-wrapper" />

                {shouldUseMaps && (
                  <Map
                    activatePickupDetails={this.activatePickupDetails}
                    address={searchAddressWithAddressQuery}
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
                  >
                    <ZoomControls
                      isLargeScreen={isLargeScreen}
                      mapStatus={mapStatus}
                      shouldShow={shouldShowMap}
                    />
                  </Map>
                )}
                <SearchOverlay />
                <StateHandler
                  activePickupPoint={activePickupPoint}
                  askForGeolocation={askForGeolocation}
                  changeActiveSLAOption={changeActiveSLAOption}
                  closePickupPointsModal={this.handleCloseModal}
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
                  searchAddress={searchAddressWithAddressQuery}
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
  googleMaps: PropTypes.object,
  intl: intlShape.isRequired,
  items: PropTypes.array.isRequired,
  isSearching: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  logisticsInfo: PropTypes.array.isRequired,
  pickupOptions: PropTypes.array.isRequired,
  pickupPoints: PropTypes.array.isRequired,
  residentialAddress: PropTypes.object,
  rules: PropTypes.object.isRequired,
  searchAddress: PropTypes.object.isRequired,
  sellerId: PropTypes.string,
  selectedPickupPoint: PropTypes.object,
  storePreferencesData: PropTypes.object.isRequired,
}

export default injectIntl(withGoogleMaps(PickupPointsModal))
