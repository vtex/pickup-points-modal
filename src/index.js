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
      isPickupDetailsActive: props.isPickupDetailsActive || false,
    }
  }

  componentWillUnmount() {
    this.setState({ isMounted: false })
    window.removeEventListener('resize', this.resize, true)
  }

  componentDidMount() {
    if (!this.props.selectedPickupPoint) return
    this.props.changeActivePickupDetails(this.props.selectedPickupPoint)
    this.setState({ isMounted: true })
    window.addEventListener('resize', this.resize)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.isPickupDetailsActive !== nextProps.isPickupDetailsActive ||
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
    } = this.state

    const isNotShowingPickupDetailsAndHasPickupOptions =
      pickupOptions.length > 0 &&
      !isPickupDetailsActive &&
      (mapStatus === HIDE_MAP || largeScreen)

    return (
      <div>
        <div
          className="backdrop pickup-modal-backdrop"
          onClick={this.handleClick}
        />
        <div className="PickupModal pickup-modal aspect-ratio--object z-999 bg-white flex flex-column overflow-hidden fixed">
          <div className="PickupModalHeader flex-none flex items-center bb b--light-gray">
            <div className="PickupModalTitle pickup-modal-title flex-auto pv3 pl3">
              <Heading level="4" size="5" variation="bolder">
                {isPickupDetailsActive
                  ? this.translate('pointDetails')
                  : this.translate('selectPickupPoint')}
              </Heading>
            </div>
            <button
              type="button"
              className={
                'PickupModalClose PickupModalClose pickup-modal-close btn btn-link flex-none pa3 bn bg-white'
              }
              onClick={this.handleClick}
            >
              <img
                href="#"
                src={closebutton}
                alt={this.translate('closeButton')}
              />
            </button>
          </div>

          <GoogleMapsContainer apiKey={googleMapsKey} locale={intl.locale}>
            {({ loading, googleMaps }) => (
              <div>
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
                {!isPickupDetailsActive && (
                  <form
                    id="pickup-modal-search"
                    className="PickupModalSearch pickup-modal-search flex-none pa2 relative"
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
              </div>
            )}
          </GoogleMapsContainer>

          {!isPickupDetailsActive && (
            <div className="pickupTabsContainer pickupTabsContainer pickup-tabs-container">
              <PickupTabs
                mapStatus={mapStatus}
                updateLocationTab={this.updateLocationTab}
              />
            </div>
          )}

          {isNotShowingPickupDetailsAndHasPickupOptions && (
            <div
              className={
                'PickupModalPointsList pickup-modal-points-list flex-auto relative overflow-auto'
              }
            >
              {pickupOptions.map(pickupPoint => (
                <div
                  key={pickupPoint.id}
                  className="PickupModalPointsItem pickup-modal-points-item"
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
            <div className="detail pickup-modal-details-wrapper flex-auto flex">
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
            </div>
          )}
        </div>
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
