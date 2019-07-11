import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils/i18nUtils'

import Input from './Input'
import SearchForm from './SearchForm'

import PinWaiting from '../assets/components/PinWaiting'

import styles from '../index.css'
import emptyStyles from './EmptySearch.css'
import { getShipsTo } from '../utils/AddressUtils'
import GPSDenied from '../assets/components/GPSDenied'
import { ERROR_NOT_ALLOWED } from '../constants'
import { injectState } from '../modalStateContext'

class EmptySearch extends PureComponent {
  render() {
    const {
      askForGeolocation,
      geolocationStatus,
      googleMaps,
      intl,
      handleAddressChange,
      loading,
      logisticsInfo,
      rules,
      searchAddress,
      setGeolocationStatus,
      setActiveState,
      shouldUseMaps,
    } = this.props

    return (
      <div className={`${styles.modalfullPage} pkpmodal-full-page`}>
        <div className={`${styles.searchAlone} pkpmodal-search-alone`}>
          <PinWaiting />
          <h2
            className={`${
              styles.searchAloneTitle
            } pkpmodal-search-alone-title`}>
            {translate(intl, 'geolocationEmpty')}
          </h2>
          <h3
            className={`${
              styles.searchAloneSubtitle
            } pkpmodal-search-alone-subtitle`}>
            {translate(
              intl,
              shouldUseMaps
                ? 'geolocationEmptyInstructions'
                : 'postalCodeEmptyInstructions'
            )}
          </h3>
          <SearchForm
            address={searchAddress}
            autoFocus
            askForGeolocation={askForGeolocation}
            googleMaps={googleMaps}
            Input={Input}
            insideModal={false}
            isLoadingGoogle={loading}
            isGeolocation={shouldUseMaps}
            status={geolocationStatus}
            setActiveState={setActiveState}
            setGeolocationStatus={setGeolocationStatus}
            onChangeAddress={handleAddressChange}
            placeholder={translate(intl, 'searchLocationMap')}
            rules={rules}
            shipsTo={getShipsTo(intl, logisticsInfo)}
          />
          {geolocationStatus === ERROR_NOT_ALLOWED && (
            <div className={emptyStyles.permissionDenied}>
              <GPSDenied />
              <span>{translate(intl, 'permissionDenied')}</span>
            </div>
          )}
        </div>
      </div>
    )
  }
}

EmptySearch.propTypes = {
  geolocationStatus: PropTypes.string,
  handleAddressChange: PropTypes.func.isRequired,
  setGeolocationStatus: PropTypes.func.isRequired,
  setActiveState: PropTypes.func.isRequired,
  askForGeolocation: PropTypes.bool,
  googleMaps: PropTypes.object,
  intl: intlShape,
  loading: PropTypes.bool,
  logisticsInfo: PropTypes.array,
  rules: PropTypes.object,
  searchAddress: PropTypes.object,
  shouldUseMaps: PropTypes.bool,
}

export default injectState(injectIntl(EmptySearch))
