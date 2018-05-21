import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import PickupPointsModal from '../../src/index'
import { newAddress } from '../../src/utils/newAddress'
import BRA from '@vtex/address-form/lib/country/BRA'
import { SEARCH } from '../../src/constants/index'
import { addValidation } from '@vtex/address-form/lib/transforms/address'

import '../../src/index.css'
import '../../src/components/PickupPoint.css'
import '../../src/components/PickupPointDetails.css'
import '../../src/components/PickupTabs.css'
import '../../src/components/ProductItems.css'

import pickupMock from './pickup-options'
import itemsMock from './items'
import logisticsInfoMock from './logistics-info'

const API_KEY = 'AIzaSyATLp76vkHxfMZqJF_sJbjQqZwvSIBhsTM'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isModalOpen: true,
      selectedPickupPoint: pickupMock.pickupOptions[0],
      pickupOptions: pickupMock.pickupOptions,
      logisticsInfo: logisticsInfoMock.logisticsInfo,
      items: itemsMock.items,
      storePreferencesData: {
        countryCode: 'BRA',
        currencyCode: 'BRL',
        currencySymbol: 'R$',
        currencyFormatInfo: {
          currencyDecimalDigits: 2,
          currencyDecimalSeparator: ',',
          currencyGroupSeparator: '.',
          currencyGroupSize: 3,
          startsWithCurrencySymbol: true,
        },
      },
      searchAddress: addValidation(
        newAddress({
          addressType: SEARCH,
          geoCoordinates: [-43.185971, -22.943419],
        })
      ),
    }
  }

  handleCloseModal = () => this.setState({ isModalOpen: false })

  handleOpenModal = () => this.setState({ isModalOpen: true })

  changeActivePickupDetails = () =>
    this.setState({
      selectedPickupPoint: pickupMock.pickupOptions[0],
    })

  handleAddressChange = address => this.setState({ address })

  render() {
    const {
      isModalOpen,
      searchAddress,
      selectedPickupPoint,
      isPickupDetailsActive,
      storePreferencesData,
      logisticsInfo,
      items,
    } = this.state

    return (
      <div>
        {isModalOpen && (
          <PickupPointsModal
            activePickupPoint={selectedPickupPoint}
            askForGeolocation={false}
            changeActivePickupDetails={this.changeActivePickupDetails}
            changeActiveSLAOption={() => {}}
            closePickupPointsModal={this.handleCloseModal}
            googleMapsKey={API_KEY}
            intl={this.props.intl}
            isPickupDetailsActive={isPickupDetailsActive}
            items={items}
            logisticsInfo={logisticsInfo}
            onAddressChange={this.handleAddressChange}
            pickupOptions={pickupMock.pickupOptions}
            rules={BRA}
            searchAddress={searchAddress}
            selectedPickupPoint={selectedPickupPoint}
            storePreferencesData={storePreferencesData}
          />
        )}
        <a onClick={this.handleOpenModal}>Open Modal</a>
      </div>
    )
  }
}

App.propTypes = {
  intl: intlShape,
}

export default injectIntl(App)
