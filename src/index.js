import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { HIDE_MAP, SHOW_MAP, PICKUP_IN_STORE } from './constants'
import debounce from 'lodash/debounce'

import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'
import GoogleMapsContainer from '@vtex/address-form/lib/geolocation/GoogleMapsContainer'
import GeolocationInput from '@vtex/address-form/lib/geolocation/GeolocationInput'

import PickupTabs from './components/PickupTabs'
import PickupPoint from './components/PickupPoint'
import PickupPointDetails from './components/PickupPointDetails'
import Input from './components/Input'
import Map from './components/Map'
import AskForGeolocation from './components/AskForGeolocation'

import { getPickupOptionGeolocations } from './utils/pickupUtils'
import { validateField } from '@vtex/address-form/lib/validateAddress'

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
      filteredPickupOptions: props.pickupOptions.filter(
        option =>
          props.activePickupPoint
            ? option.id !== props.activePickupPoint.id
            : true
      ),
      showAskForGeolocation: this.props.askForGeolocation,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showAskForGeolocation: nextProps.askForGeolocation,
      selectedPickupPoint: nextProps.selectedPickupPoint,
      filteredPickupOptions: nextProps.pickupOptions.filter(
        option =>
          nextProps.activePickupPoint
            ? option.id !== nextProps.activePickupPoint.id
            : true
      ),
    })
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
      showAskForGeolocation: ask || true,
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
    } = this.props

    const {
      filteredPickupOptions,
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
        <div className="pickup-modal-backdrop" onClick={this.handleClick} />
        <GoogleMapsContainer apiKey={googleMapsKey} locale={intl.locale}>
          {({ loading, googleMaps }) => (
            <div className="pickup-modal">
              <button
                type="button"
                className={'pickup-modal-close btn btn-link'}
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
                  activatePickupDetails={this.activatePickupDetails}
                  activePickupPoint={activePickupPoint}
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

              {showAskForGeolocation ? (
                <AskForGeolocation
                  address={searchAddress}
                  pickupOptionGeolocations={getPickupOptionGeolocations(
                    pickupOptions
                  )}
                  googleMaps={googleMaps}
                  onAskForGeolocation={this.handleAskForGeolocation}
                  onChangeAddress={this.handleAddressChange}
                  rules={rules}
                />
              ) : (
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
                        <svg
                          className="pickup-modal-search-icon"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          viewBox="0 0 16 16"
                          width="16"
                          height="16"
                        >
                          <path
                            fill="#666666"
                            d="M12.7,11.3c0.9-1.2,1.4-2.6,1.4-4.2C14.1,3.2,11,0,7.1,0S0,3.2,0,7.1c0,3.9,3.2,7.1,7.1,7.1 c1.6,0,3.1-0.5,4.2-1.4l3,3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4L12.7,11.3z M7.1,12.1 C4.3,12.1,2,9.9,2,7.1S4.3,2,7.1,2s5.1,2.3,5.1,5.1S9.9,12.1,7.1,12.1z"
                          />
                        </svg>
                      </form>
                    )}
                    {!isPickupDetailsActive &&
                      navigator.geolocation && (
                        <button
                          type="button"
                          className="button-ask-geolocation btn btn-link"
                          onClick={this.handleAskForGeolocation}
                        >
                          {this.translate('askGeolocation')}
                        </button>
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
                      <div className={'pickup-modal-points-list'}>
                        {pickupOptions.length > 0 &&
                          activePickupPoint && (
                            <div className="pickup-modal-points-item">
                              <PickupPoint
                                items={items}
                                logisticsInfo={logisticsInfo}
                                sellerId={sellerId}
                                togglePickupDetails={this.togglePickupDetails}
                                handleChangeActivePickupDetails={
                                  changeActivePickupDetails
                                }
                                changeActivePickupPointId={
                                  this.changeActivePickupPointId
                                }
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
                              logisticsInfo={logisticsInfo}
                              sellerId={sellerId}
                              togglePickupDetails={this.togglePickupDetails}
                              handleChangeActivePickupDetails={
                                changeActivePickupDetails
                              }
                              changeActivePickupPointId={
                                this.changeActivePickupPointId
                              }
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

                    {isPickupDetailsActive && (
                      <PickupPointDetails
                        items={items}
                        logisticsInfo={logisticsInfo}
                        sellerId={sellerId}
                        handleChangeActiveSLAOption={changeActiveSLAOption}
                        togglePickupDetails={this.togglePickupDetails}
                        storePreferencesData={storePreferencesData}
                        handleClosePickupPointsModal={closePickupPointsModal}
                        pickupPoint={selectedPickupPoint}
                        selectedRules={rules}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </GoogleMapsContainer>
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
}

export default injectIntl(PickupPointsModal)
