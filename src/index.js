import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { HIDE_MAP, SHOW_MAP, PICKUP_IN_STORE } from './constants'
import debounce from 'lodash/debounce'

import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'
import GoogleMapsContainer from '@vtex/address-form/lib/geolocation/GoogleMapsContainer'
import GeolocationInput from '@vtex/address-form/lib/geolocation/GeolocationInput'

import Heading from './components/Heading'
import PickupTabs from './components/PickupTabs'
import PickupPoint from './components/PickupPoint'
import PickupPointDetails from './components/PickupPointDetails'
import UserGeolocation from './components/UserGeolocation'
import Input from './components/Input'
import Map from './components/Map'

import { getPickupOptionGeolocations } from './utils/pickupUtils'

import closebutton from './assets/icons/close_icon.svg'
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
      showAskForGeolocation: false,
    }
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
        isMounted: true,
      })
    } else {
      this.setState({
        isMounted: true,
      })
    }
    window.addEventListener('resize', this.resize)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.isPickupDetailsActive !== nextState.isPickupDetailsActive ||
      this.state.mapStatus !== nextState.mapStatus ||
      this.state.largeScreen !== nextState.largeScreen ||
      this.props.searchAddress !== nextState.searchAddress ||
      this.props.pickupOptions !== nextProps.pickupOptions
    )
  }

  resize = debounce(() => {
    if (!this.state.isMounted) return
    this.setState({
      largeScreen: window.innerWidth > 1023,
      mapStatus: window.innerWidth > 1023 ? SHOW_MAP : HIDE_MAP,
    })
  }, 200)

  handlePreventSubmitRefresh = event => event.preventDefault()

  updateLocationTab = mapStatus => this.setState({ mapStatus })

  changeActivePickupPointId = selectedPickupPoint =>
    this.setState({ selectedPickupPoint })

  handleClick = () => this.props.closePickupPointsModal()

  translate = id =>
    this.props.intl.formatMessage({
      id: `pickupPointsModal.${id}`,
    })

  togglePickupDetails = () =>
    this.setState({ isPickupDetailsActive: !this.state.isPickupDetailsActive })

  handleAddressChange = address => {
    if (!address.postalCode.value) return
    this.props.onAddressChange(address)
  }

  render() {
    const {
      pickupOptions,
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
      logisticsInfo,
    } = this.props

    const {
      isPickupDetailsActive,
      largeScreen,
      mapStatus,
      selectedPickupPoint,
      showAskForGeolocation,
    } = this.state

    const isNotShowingPickupDetailsAndHasPickupOptions =
      pickupOptions.length > 0 &&
      !isPickupDetailsActive &&
      (mapStatus === HIDE_MAP || largeScreen)

    return (
      <div>
        <div
          className="pickup-modal-backdrop"
          onClick={this.handleClick}
        />
        <GoogleMapsContainer apiKey={googleMapsKey} locale={intl.locale}>
          {({ loading, googleMaps }) => (
            <div className="pickup-modal">
              <button
                type="button"
                className={
                  'pickup-modal-close btn btn-link flex-none pa3 bn bg-white'
                }
                onClick={this.handleClick}
              >
                <img
                  href="#"
                  src={closebutton}
                  alt={this.translate('closeButton')}
                />
              </button>
              {(largeScreen || mapStatus === SHOW_MAP) && (
                <Map
                  address={searchAddress}
                  changeActivePickupDetails={changeActivePickupDetails}
                  googleMaps={googleMaps}
                  isPickupDetailsActive={isPickupDetailsActive}
                  handleAskForGeolocation={this.onAskForGeolocation}
                  largeScreen={largeScreen}
                  loadingGoogle={loading}
                  mapProps={{
                    style: {
                      height: '100%',
                      width: '100%',
                      position: 'absolute',
                      top: 0,
                      zIndex: 0,
                    },
                  }}
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

              {
                showAskForGeolocation
                  ? ''
                  : (
                    <div className="pickup-modal-info-bar">
                      <div className="pickup-modal-info-bar-container">
                        <div className="pickup-modal-header">
                          <div className="pickup-modal-title">
                            <Heading level="4" size="5" variation="bolder">
                              {isPickupDetailsActive
                                ? this.translate('pointDetails')
                                : this.translate('selectPickupPoint')}
                            </Heading>
                          </div>
                        </div>

                        {!isPickupDetailsActive && (
                          <form
                            id="pickup-modal-search"
                            className="pickup-modal-search"
                            onSubmit={this.handlePreventSubmitRefresh}
                          >
                            <GeolocationInput
                              Input={Input}
                              placeholder={this.translate('searchLocationMap')}
                              loadingGoogle={loading}
                              googleMaps={googleMaps}
                              address={searchAddress}
                              rules={rules}
                              onChangeAddress={this.handleAddressChange}
                            />
                          </form>
                        )}
                        {!isPickupDetailsActive &&
                          navigator.geolocation && (
                            <UserGeolocation
                              address={searchAddress}
                              pickupOptionGeolocations={getPickupOptionGeolocations(
                                pickupOptions
                              )}
                              googleMaps={googleMaps}
                              onChangeAddress={this.handleAddressChange}
                              rules={rules}
                            />
                          )}

                        {!isPickupDetailsActive && (
                          <div className="pickup-tabs-container">
                            <PickupTabs
                              mapStatus={mapStatus}
                              updateLocationTab={this.updateLocationTab}
                            />
                          </div>
                        )}

                        {isNotShowingPickupDetailsAndHasPickupOptions && (
                          <div
                            className={
                              'pickup-modal-points-list'
                            }
                          >
                            {pickupOptions.map(pickupPoint => (
                              <div
                                key={pickupPoint.id}
                                className="pickup-modal-points-item"
                              >
                                <PickupPoint
                                  items={items}
                                  logisticsInfo={logisticsInfo}
                                  sellerId={sellerId}
                                  togglePickupDetails={this.togglePickupDetails}
                                  handleChangeActivePickupDetails={changeActivePickupDetails}
                                  changeActivePickupPointId={this.changeActivePickupPointId}
                                  sellerId={sellerId}
                                  selectedRules={rules}
                                  pickupPoint={pickupPoint}
                                  storePreferencesData={storePreferencesData}
                                  pickupPointId={pickupPoint.id}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {isPickupDetailsActive && (
                          <PickupPointDetails
                            items={items}
                            logisticsInfo={logisticsInfo}
                            sellerId={sellerId}
                            handleChangeActiveSLAOption={changeActiveSLAOption}
                            togglePickupDetails={this.togglePickupDetails}
                            storePreferencesData={storePreferencesData}
                            handleClosePickupPointsModal={closePickupPointsModal}
                            sellerId={sellerId}
                            pickupPoint={selectedPickupPoint}
                            selectedRules={rules}
                          />
                        )}
                      </div>
                    </div>
                  )
              }
            </div>
          )}
        </GoogleMapsContainer>
      </div>
    )
  }
}

PickupPointsModal.propTypes = {
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
}

export default injectIntl(PickupPointsModal)
