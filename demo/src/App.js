import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { PickupPointsModal } from '../../src/index'
import { newAddress } from '../../src/utils/newAddress'
import BRA from '@vtex/address-form/lib/country/BRA'
import { SEARCH, PICKUP_IN_STORE } from '../../src/constants/index'
import { addValidation } from '@vtex/address-form/lib/transforms/address'

import '../../src/index.css'
import '../../src/components/PickupPoint.css'
import '../../src/components/PickupPointDetails.css'
import '../../src/components/PickupTabs.css'
import '../../src/components/ProductItems.css'

import pickupMock from './pickup-options'
import itemsMock from './items'
import logisticsInfoMock from './logistics-info'

const ACCOUNT_NAME = 'qamarketplace'
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
      pickupOptions,
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
            onAddressChange={this.handleAddressChange}
            activePickupPoint={selectedPickupPoint}
            closePickupPointsModal={this.handleCloseModal}
            changeActivePickupDetails={this.changeActivePickupDetails}
            changeActiveSLAOption={() => {}}
            googleMapsKey={API_KEY}
            intl={this.props.intl}
            items={items}
            askForGeolocation={false}
            isPickupDetailsActive={isPickupDetailsActive}
            logisticsInfo={logisticsInfo}
            pickupOptions={pickupMock.pickupOptions}
            searchAddress={searchAddress}
            selectedPickupPoint={selectedPickupPoint}
            rules={BRA}
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
