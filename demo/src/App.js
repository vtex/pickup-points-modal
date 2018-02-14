import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { PickupPointsModal } from '../../src/index'
import { newAddress } from '../../src/utils/newAddress'
import BRA from '@vtex/address-form/lib/country/BRA'
import { SEARCH, PICKUP_IN_STORE } from '../../src/constants/index'
import { addValidation } from '@vtex/address-form/lib/transforms/address'

const ACCOUNT_NAME = 'qamarketplace'
const API_KEY = 'AIzaSyATLp76vkHxfMZqJF_sJbjQqZwvSIBhsTM'

const pickup = {
  id: '1',
  price: 100,
  shippingEstimate: '0bd',
  pickupStoreInfo: {
    friendlyName: 'xablau',
    address: newAddress({
      geoCoordinates: [1, 2],
      street: 'Praia de Botafogo',
      number: '300',
      postalCode: '22.251-040',
    }),
  },
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isModalOpen: true,
      selectedPickupPoint: pickup,
      pickupOptions: [pickup],
      logisticsInfo: [
        {
          itemIndex: 0,
          selectedDeliveryChannel: PICKUP_IN_STORE,
          deliveryChannels: [{ id: PICKUP_IN_STORE }],
          slas: [pickup],
        },
      ],
      items: [
        {
          seller: '1',
          name: 'title',
          imageUrl:
            'https://basedevmkp.vteximg.com.br/arquivos/ids/168552-55-55/3413316.jpg',
          uniqueId: '10',
        },
      ],
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
      selectedPickupPoint: pickup,
    })

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
            changeActiveSLAOption={() => {}}
            searchAddress={searchAddress}
            googleMapsKey={API_KEY}
            intl={this.props.intl}
            pickupOptions={pickupOptions}
            pickupOptionGeolocations={pickupOptions.map(
              option => option.pickupStoreInfo.address.geoCoordinates
            )}
            selectedRules={BRA}
            closePickupPointsModal={this.handleCloseModal}
            changeActivePickupDetails={this.changeActivePickupDetails}
            selectedPickupPoint={selectedPickupPoint}
            isPickupDetailsActive={isPickupDetailsActive}
            storePreferencesData={storePreferencesData}
            logisticsInfo={logisticsInfo}
            items={items}
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
