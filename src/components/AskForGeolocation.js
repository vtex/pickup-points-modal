import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'

import './AskForGeolocation.css'

import closebutton from '../assets/icons/close_icon.svg'

export class AskForGeolocation extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  translate = id =>
    this.props.intl.formatMessage({
      id: `pickupPointsModal.${id}`,
    })

  render() {
    return (
      <div className="ask-for-geolocation">
        <button type="button" className="close-modal btn btn-link">
          <img
            href="#"
            src={closebutton}
            alt={this.translate('closeButton')}
          />
        </button>
        <div className="ask-for-geolocation-wrapper">
          <h2 className="ask-for-geolocation-title">
            Descubra o ponto de retirada mais perto de você
          </h2>
          <h3 className="ask-for-geolocation-subtitle">
            Para encontrá-lo, precisamos da sua localização
          </h3>
          <div className="ask-for-geolocation-image">
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
            <button className="btn-ask-for-geolocation-cta btn btn-success btn-large">Usar minha localização atual</button>
          </div>
          <div className="ask-for-geolocation-manual">
            <button className="btn-ask-for-geolocation-manual btn btn-link">Procurar endereço manualmente</button>
          </div>
        </div>
      </div>
    )
  }
}

AskForGeolocation.propTypes = {
  intl: intlShape,
}

export default injectIntl(AskForGeolocation)
