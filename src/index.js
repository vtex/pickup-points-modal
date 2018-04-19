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
  OUTSIDE_MODAL,
  ERROR_NOT_FOUND,
  INSIDE_MODAL,
} from './constants'
import debounce from 'lodash/debounce'

import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'
import Map from './components/Map'
import AskForGeolocation from './components/AskForGeolocation'
import Error from './components/Error'
import Home from './components/Home'
import CloseButton from './components/CloseButton'
import Input from './components/Input'
import SearchForm from './components/SearchForm'

import { validateField } from '@vtex/address-form/lib/validateAddress'
import { getPickupOptionGeolocations } from './utils/pickupUtils'
import { getPickupSlaString } from './utils/GetString'

import PinWaiting from './assets/components/PinWaiting'

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
            : true,
      ),
      geolocationFrom: OUTSIDE_MODAL,
      showAskForGeolocation: this.props.askForGeolocation,
      askForGeolocationStatus: this.props.askForGeolocation ? WAITING : '',
      showError: false,
      errorStatus: '',
      showManualSearch: props.pickupOptions.length === 0,
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    const thisPickupOptions = getPickupSlaString(this.props.pickupOptions)
    const nextPickupOptions = getPickupSlaString(nextProps.pickupOptions)

    const notSearchingAndIsEmptyPickupOptions =
      !nextProps.isSearching &&
      this.props.askForGeolocationStatus !== SEARCHING &&
      nextPickupOptions.length === 0

    this.setState({
      showAskForGeolocation:
        nextProps.isSearching ||
        nextProps.askForGeolocationStatus === SEARCHING,
      showManualSearch: this.state.showManualSearch
        ? nextPickupOptions.length !== 0 && !nextProps.isSearching
        : false,
      askForGeolocationStatus: nextProps.isSearching ? SEARCHING : null,
      showError: notSearchingAndIsEmptyPickupOptions,
      errorStatus: notSearchingAndIsEmptyPickupOptions ? ERROR_NOT_FOUND : '',
      selectedPickupPoint: nextProps.selectedPickupPoint,
      filteredPickupOptions: nextProps.pickupOptions.filter(
        option =>
          nextProps.activePickupPoint
            ? option.id !== nextProps.activePickupPoint.id
            : true,
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

  setGeolocationFrom = () => {
    this.setState({
      geolocationFrom: INSIDE_MODAL,
    })
  }

  handleAskForGeolocation = (ask, geolocationFrom) => {
    this.setState({
      showAskForGeolocation: ask,
      showManualSearch: false,
      showError: false,
      ...(geolocationFrom ? { geolocationFrom: geolocationFrom } : {}),
    })
  }

  handleAskForGeolocationStatus = (status, geolocationFrom) => {
    this.setState({
      askForGeolocationStatus: status,
      showManualSearch: false,
      showError: false,
      ...(geolocationFrom ? { geolocationFrom: geolocationFrom } : {}),
    })
  }

  handleGeolocationError = (status, geolocationFrom) => {
    this.setState({
      showError: true,
      showAskForGeolocation: false,
      askForGeolocationStatus: null,
      errorStatus: status,
      ...(geolocationFrom ? { geolocationFrom: geolocationFrom } : {}),
    })
  }

  handleManualGeolocationError = () => {
    this.setState({
      showError: false,
      errorStatus: null,
      showManualSearch: true,
    })
  }

  handleManualGeolocation = () => {
    this.setState({
      showManualSearch: true,
      showAskForGeolocation: false,
      showError: false,
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
      neighbourhood: address.neighbourhood || {
        value: null,
      },
      number: address.number || {
        value: null,
      },
      postalCode: {
        ...address.postalCode,
        ...(address.postalCode
          ? {
            ...validateField(
              address.postalCode.value,
              'postalCode',
              address,
              this.props.rules,
            ),
          }
          : {
            value: null,
          }),
      },
    }

    this.setState({
      showAskForGeolocation: true,
      askForGeolocationStatus: SEARCHING,
    })

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
      geolocationFrom,
      showError,
      errorStatus,
      showManualSearch,
    } = this.state

    return (
      <div>
        <div
          className="pkpmodal-backdrop"
          onClick={this.props.closePickupPointsModal}
        />
        <div className="pkpmodal">
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
                pickupOptions,
              )}
              pickupOptions={pickupOptions}
              rules={rules}
              selectedPickupPointGeolocation={getPickupOptionGeolocations(
                selectedPickupPoint,
              )}
              pickupPoint={selectedPickupPoint}
            />
          )}

          {(showAskForGeolocation || showError) &&
          geolocationFrom === OUTSIDE_MODAL ? (
              <div className="pkpmodal-full-page">
                {showAskForGeolocation && (
                  <AskForGeolocation
                    address={searchAddress}
                    pickupOptionGeolocations={getPickupOptionGeolocations(
                      pickupOptions,
                    )}
                    onGeolocationError={this.handleGeolocationError}
                    googleMaps={googleMaps}
                    onAskForGeolocation={this.handleAskForGeolocation}
                    onChangeAddress={this.handleAddressChange}
                    rules={rules}
                    status={askForGeolocationStatus}
                    onAskForGeolocationStatus={this.handleAskForGeolocationStatus}
                    onManualGeolocation={this.handleManualGeolocation}
                    askForGeolocation={showAskForGeolocation}
                    geolocationFrom={OUTSIDE_MODAL}
                  />
                )}
                {showError && (
                  <Error
                    onManualGeolocationError={this.handleManualGeolocationError}
                    status={errorStatus}
                  />
                )}
              </div>
            ) : showManualSearch && largeScreen ? (
              <div className="pkpmodal-full-page">
                <div className="pkpmodal-search-alone">
                  <PinWaiting />
                  <h2 className="pkpmodal-search-alone-title">
                    {this.translate('geolocationEmpty')}
                  </h2>
                  <h3 className="pkpmodal-search-alone-subtitle">
                    {this.translate('geolocationEmptyInstructions')}
                  </h3>
                  <SearchForm
                    Input={Input}
                    placeholder={this.translate('searchLocationMap')}
                    loadingGoogle={loading}
                    googleMaps={googleMaps}
                    address={searchAddress}
                    rules={rules}
                    onChangeAddress={this.handleAddressChange}
                    onAskForGeolocationStatus={this.handleAskForGeolocationStatus}
                    handleAskForGeolocation={this.handleAskForGeolocation}
                    insideModal={false}
                  />
                </div>
              </div>
            ) : (
              <Home
                mapStatus={mapStatus}
                errorStatus={errorStatus}
                geolocationFrom={geolocationFrom}
                showError={showError}
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
                onManualGeolocation={this.handleManualGeolocation}
                onManualGeolocationError={this.handleManualGeolocationError}
                onGeolocationError={this.handleGeolocationError}
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
                showAskForGeolocation={showAskForGeolocation}
                status={askForGeolocationStatus}
                onAskForGeolocation={this.handleAskForGeolocation}
                onChangeAddress={this.handleAddressChange}
                setGeolocationFrom={this.setGeolocationFrom}
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
