import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import UserGeolocation from '../components/UserGeolocation'

import AddressShapeWithValidation from '@vtex/address-form/lib/propTypes/AddressShapeWithValidation'

import './AskForGeolocation.css'

import closebutton from '../assets/icons/close_icon.svg'

export class AskForGeolocation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      status: 'waiting',
    }
  }

  handleGetGeolocation = () => {
    this.setState({ status: 'waiting' })
  }

  translate = id =>
    this.props.intl.formatMessage({
      id: `pickupPointsModal.${id}`,
    })

  render() {
    const { status } = this.state

    return (
      <div className="ask-for-geolocation">
        <button type="button" className="close-modal btn btn-link">
          <img
            href="#"
            src={closebutton}
            alt={this.translate('closeButton')}
          />
        </button>
        {status === 'ask' && (
          <div className="ask-for-geolocation-wrapper ask-for-geolocation-ask">
            <h2 className="ask-for-geolocation-title">
              Descubra o ponto de retirada mais perto de você
            </h2>
            <h3 className="ask-for-geolocation-subtitle">
              Para encontrá-lo, precisamos da sua localização
            </h3>
            <div className="ask-for-geolocation-image-ask">
              <svg fill="none" width="106%" height="106%" viewBox="0 0 212 212" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g strokeWidth="2" stroke="#FFFFFF">
                  <rect transform="translate(-18.622687, 76.959642) rotate(45.000000) translate(18.622687, -76.959642) " x="-91.9198759" y="3.66245343" width="146.594378" height="146.594378" rx="3"></rect>
                  <rect transform="translate(154.068076, -49.144775) rotate(45.000000) translate(-154.068076, 49.144775) " x="80.7708872" y="-122.441964" width="146.594378" height="146.594378" rx="3"></rect>
                  <rect transform="translate(194.228718, 170.132333) rotate(45.000000) translate(-194.228718, -170.132333) " x="120.93153" y="96.8351442" width="146.594378" height="146.594378" rx="3"></rect>
                  <rect transform="translate(47.240767, 263.305024) rotate(45.000000) translate(-47.240767, -263.305024) " x="-26.0564221" y="190.007835" width="146.594378" height="146.594378" rx="3"></rect>
                  <rect transform="translate(225.521891, 86.630325) rotate(45.000000) translate(-225.521891, -86.630325) " x="152.224702" y="13.3331362" width="146.594378" height="146.594378" rx="3"></rect>
                  <rect transform="translate(-1.755217, 3.064060) rotate(45.000000) translate(1.755217, -3.064060) " x="-75.052406" y="-70.2331289" width="146.594378" height="146.594378" rx="3"></rect>
                </g>
                <path transform="translate(66.666667, 52.208835)" fill="#FFFFFF" d="M33,0 C14.7792857,0 0,15.048 0,33.6 C0,58.8 33,96 33,96 C33,96 66,58.8 66,33.6 C66,15.048 51.2207143,0 33,0 Z M33,45.6 C26.4942857,45.6 21.2142857,40.224 21.2142857,33.6 C21.2142857,26.976 26.4942857,21.6 33,21.6 C39.5057143,21.6 44.7857143,26.976 44.7857143,33.6 C44.7857143,40.224 39.5057143,45.6 33,45.6 Z" id="Shape"></path>
              </svg>
            </div>
            <div className="ask-for-geolocation-cta">
              <UserGeolocation
                address={this.props.address}
                pickupOptionGeolocations={this.props.pickupOptionGeolocations}
                googleMaps={this.props.googleMaps}
                onChangeAddress={this.props.onChangeAddress}
                onGetGeolocation={this.handleGetGeolocation}
                rules={this.props.rules}
              />
            </div>
            <div className="ask-for-geolocation-manual">
              <button className="btn-ask-for-geolocation-manual btn btn-link">Procurar endereço manualmente</button>
            </div>
          </div>
        )}

        {status === 'waiting' && (
          <div className="ask-for-geolocation-wrapper ask-for-geolocation-waiting">
            <div className="ask-for-geolocation-image-waiting">
              <svg className="ask-for-geolocation-image-waiting-pin" width="67px" height="96px" viewBox="0 0 67 96" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path fill="#368DF7" d="M33.3333333,0 C14.9285714,0 0,14.9825301 0,33.4538153 C0,58.5441767 33.3333333,95.5823293 33.3333333,95.5823293 C33.3333333,95.5823293 66.6666667,58.5441767 66.6666667,33.4538153 C66.6666667,14.9825301 51.7380952,0 33.3333333,0 Z M33.3333333,45.4016064 C26.7619048,45.4016064 21.4285714,40.048996 21.4285714,33.4538153 C21.4285714,26.8586345 26.7619048,21.5060241 33.3333333,21.5060241 C39.9047619,21.5060241 45.2380952,26.8586345 45.2380952,33.4538153 C45.2380952,40.048996 39.9047619,45.4016064 33.3333333,45.4016064 Z"></path>
              </svg>
            </div>
            <div className="ask-for-geolocation-image-waiting-shadow"></div>
            <div className="ask-for-geolocation-instructions">
              <h2 className="ask-for-geolocation-title-small">
                Aguardando sua autorização
              </h2>
              <h3 className="ask-for-geolocation-subtitle">
                Selecione “Permitir” no alerta exibido na parte superior esquerda do seu navegador
              </h3>
            </div>
          </div>
        )}

        {status === 'searching' && (
          <div className="ask-for-geolocation-wrapper ask-for-geolocation-searching">
            <div className="ask-for-geolocation-image-searching">
              <svg className="ask-for-geolocation-image-searching-pin" width="67px" height="96px" viewBox="0 0 67 96" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path fill="#368DF7" d="M33.3333333,0 C14.9285714,0 0,14.9825301 0,33.4538153 C0,58.5441767 33.3333333,95.5823293 33.3333333,95.5823293 C33.3333333,95.5823293 66.6666667,58.5441767 66.6666667,33.4538153 C66.6666667,14.9825301 51.7380952,0 33.3333333,0 Z M33.3333333,45.4016064 C26.7619048,45.4016064 21.4285714,40.048996 21.4285714,33.4538153 C21.4285714,26.8586345 26.7619048,21.5060241 33.3333333,21.5060241 C39.9047619,21.5060241 45.2380952,26.8586345 45.2380952,33.4538153 C45.2380952,40.048996 39.9047619,45.4016064 33.3333333,45.4016064 Z"></path>
              </svg>
            </div>
            <div className="ask-for-geolocation-image-searching-shadow"></div>
            <div className="ask-for-geolocation-instructions">
              <h2 className="ask-for-geolocation-title-small">
                Buscando sua localização
              </h2>
            </div>
          </div>
        )}
      </div>
    )
  }
}

AskForGeolocation.propTypes = {
  address: AddressShapeWithValidation,
  googleMaps: PropTypes.object,
  intl: intlShape,
  onChangeAddress: PropTypes.func.isRequired,
  pickupOptionGeolocations: PropTypes.array,
  rules: PropTypes.object,
}

export default injectIntl(AskForGeolocation)
