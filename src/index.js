import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { withGoogleMaps } from './containers/withGoogleMaps'
import {
  HIDE_MAP,
  SHOW_MAP,
  PICKUP_IN_STORE,
  WAITING,
  SEARCHING,
  ASK,
} from './constants'
import debounce from 'lodash/debounce'

import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'
import Map from './components/Map'
import AskForGeolocation from './components/AskForGeolocation'
import Home from './components/Home'
import CloseButton from './components/CloseButton'

import { validateField } from '@vtex/address-form/lib/validateAddress'
import { getPickupOptionGeolocations } from './utils/pickupUtils'
import { getPickupSlaString } from './utils/GetString'

import './index.css'

export class PickupPointsModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isMounted: false,
      mapStatus: HIDE_MAP,
      largeScreen: window.innerWidth > 1023,
      selectedPickupPoint: props.selectedPickupPoint,
      isPickupDetailsActive: null,
      filteredPickupOptions: props.pickupOptions.filter(
        option =>
          props.activePickupPoint
            ? option.id !== props.activePickupPoint.id
            : true
      ),
      showAskForGeolocation: this.props.askForGeolocation,
      askForGeolocationStatus: this.props.askForGeolocation ? WAITING : null,
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    const thisPickupOptions = getPickupSlaString(this.props.pickupOptions)
    const nextPickupOptions = getPickupSlaString(nextProps.pickupOptions)

    this.setState({
      showAskForGeolocation: nextProps.isSearching,
      askForGeolocationStatus: nextProps.isSearching
        ? SEARCHING
        : this.state.askForGeolocationStatus,
      selectedPickupPoint: nextProps.selectedPickupPoint,
      filteredPickupOptions: nextProps.pickupOptions.filter(
        option =>
          nextProps.activePickupPoint
            ? option.id !== nextProps.activePickupPoint.id
            : true
      ),
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.isPickupDetailsActive !== nextState.isPickupDetailsActive ||
      this.state.mapStatus !== nextState.mapStatus ||
      this.state.largeScreen !== nextState.largeScreen ||
      this.props.searchAddress !== nextState.searchAddress ||
      this.props.pickupOptions !== nextProps.pickupOptions ||
      this.props.selectedPickupPoint.id !== nextProps.selectedPickupPoint.id ||
      this.props.askForGeolocation !== nextProps.askForGeolocation
    )
  }

  componentWillUnmount() {
    this.setState({ isMounted: false })
    window.removeEventListener('resize', this.resize, true)
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

  handleAskForGeolocation = ask => {
    this.setState({
      showAskForGeolocation: ask,
    })
  }

  handleAskForGeolocationStatus = status => {
    this.setState({
      askForGeolocationStatus: status,
    })
  }

  resize = debounce(() => {
    if (!this.state.isMounted) return
    this.setState({
      largeScreen: window.innerWidth > 1023,
      mapStatus: window.innerWidth > 1023 ? SHOW_MAP : HIDE_MAP,
    })
  }, 200)

  updateLocationTab = mapStatus => this.setState({ mapStatus })

  changeActivePickupPointId = selectedPickupPoint =>
    this.setState({ selectedPickupPoint })

  togglePickupDetails = () =>
    this.setState({
      isPickupDetailsActive: !this.state.isPickupDetailsActive,
    })

  activatePickupDetails = () =>
    this.setState({
      isPickupDetailsActive: true,
      mapStatus: HIDE_MAP,
    })

  handleAddressChange = address => {
    if (address.postalCode && !address.postalCode.value) return
    const addressValidated = {
      ...address,
      complement: {
        value: null,
      },
      reference: {
        value: null,
      },
      postalCode: {
        ...address.postalCode,
        ...validateField(
          address.postalCode.value,
          'postalCode',
          address,
          this.props.rules
        ),
      },
    }

    this.props.onAddressChange({
      ...addressValidated,
      postalCode: addressValidated.postalCode.valid
        ? addressValidated.postalCode
        : {
          value: null,
        },
    })
  }

  translate = id =>
    this.props.intl.formatMessage({
      id: `pickupPointsModal.${id}`,
    })

  render() {
    const {
      googleMapsKey,
      searchAddress,
      intl,
      rules,
      changeActivePickupDetails,
      closePickupPointsModal,
      changeActiveSLAOption,
      sellerId,
      storePreferencesData,
      items,
      pickupOptions,
      logisticsInfo,
      activePickupPoint,
      askForGeolocation,
      googleMaps,
      loading,
    } = this.props

    const {
      filteredPickupOptions,
      isPickupDetailsActive,
      largeScreen,
      mapStatus,
      selectedPickupPoint,
      showAskForGeolocation,
      askForGeolocationStatus,
    } = this.state

    return (
      <div>
        <div
          className="pickup-modal-backdrop"
          onClick={this.props.closePickupPointsModal}
        />
        <div className="pickup-modal">
          <CloseButton
            onClickClose={this.props.closePickupPointsModal}
            alt={this.translate('closeButton')}
          />
          {(largeScreen || mapStatus === SHOW_MAP) && (
            <Map
              address={searchAddress}
              activatePickupDetails={this.activatePickupDetails}
              activePickupPoint={activePickupPoint}
              changeActivePickupDetails={changeActivePickupDetails}
              googleMaps={googleMaps}
              isPickupDetailsActive={isPickupDetailsActive}
              handleAskForGeolocation={this.onAskForGeolocation}
              largeScreen={largeScreen}
              loadingGoogle={loading}
              onChangeAddress={this.handleAddressChange}
              pickupOptionGeolocations={getPickupOptionGeolocations(
                pickupOptions
              )}
              pickupOptions={pickupOptions}
              rules={rules}
              selectedPickupPointGeolocation={getPickupOptionGeolocations(
                selectedPickupPoint
              )}
              pickupPoint={selectedPickupPoint}
            />
          )}

          {showAskForGeolocation ? (
            <div className="pkpmodal-full-page">
              <AskForGeolocation
                address={searchAddress}
                pickupOptionGeolocations={getPickupOptionGeolocations(
                  pickupOptions
                )}
                googleMaps={googleMaps}
                onAskForGeolocation={this.handleAskForGeolocation}
                onChangeAddress={this.handleAddressChange}
                rules={rules}
                status={askForGeolocationStatus}
                onAskForGeolocationStatus={this.handleAskForGeolocationStatus}
                askForGeolocation={showAskForGeolocation}
              />
            </div>
          ) : (
            <Home
              mapStatus={mapStatus}
              activePickupPoint={activePickupPoint}
              isPickupDetailsActive={isPickupDetailsActive}
              loading={loading}
              googleMaps={googleMaps}
              searchAddress={searchAddress}
              rules={rules}
              filteredPickupOptions={filteredPickupOptions}
              items={items}
              logisticsInfo={logisticsInfo}
              sellerId={sellerId}
              pickupOptions={pickupOptions}
              largeScreen={largeScreen}
              onAskForGeolocationStatus={this.handleAskForGeolocationStatus}
              changeActiveSLAOption={changeActiveSLAOption}
              storePreferencesData={storePreferencesData}
              closePickupPointsModal={closePickupPointsModal}
              selectedPickupPoint={selectedPickupPoint}
              changeActivePickupDetails={changeActivePickupDetails}
              handleAddressChange={this.handleAddressChange}
              handleAskForGeolocation={this.handleAskForGeolocation}
              updateLocationTab={this.updateLocationTab}
              togglePickupDetails={this.togglePickupDetails}
              changeActivePickupPointId={this.changeActivePickupPointId}
              askForGeolocationStatus={askForGeolocationStatus}
              askForGeolocation={askForGeolocation}
              status={askForGeolocationStatus}
              onAskForGeolocation={this.handleAskForGeolocation}
              onChangeAddress={this.handleAddressChange}
            />
          )}
        </div>
      </div>
    )
  }
}

PickupPointsModal.propTypes = {
  activePickupPoint: PropTypes.object,
  changeActivePickupDetails: PropTypes.func.isRequired,
  changeActiveSLAOption: PropTypes.func.isRequired,
  closePickupPointsModal: PropTypes.func.isRequired,
  googleMapsKey: PropTypes.string.isRequired,
  intl: intlShape,
  items: PropTypes.array.isRequired,
  logisticsInfo: PropTypes.array.isRequired,
  onAddressChange: PropTypes.func.isRequired,
  pickupOptions: PropTypes.array.isRequired,
  rules: PropTypes.object,
  searchAddress: AddressShapeWithValidation,
  selectedPickupPoint: PropTypes.object,
  sellerId: PropTypes.string,
  storePreferencesData: PropTypes.object.isRequired,
  googleMaps: PropTypes.object,
  loading: PropTypes.bool,
}

export default injectIntl(withGoogleMaps(PickupPointsModal))
