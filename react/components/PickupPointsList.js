import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import styles from './PickupSidebar.css'
import PickupPointInfo from './PickupPointInfo'
import { injectState } from '../modalStateContext'
import { translate } from '../utils/i18nUtils'
import { injectIntl, intlShape } from 'react-intl'
import Button from './Button'

class PickupPointsList extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      showList: props.bestPickupOptions.length === 0,
    }
  }

  handleShowList = () =>
    this.setState({
      showList: true,
    })

  render() {
    const {
      bestPickupOptions,
      changeActivePickupDetails,
      externalPickupPoints,
      logisticsInfo,
      items,
      intl,
      pickupOptions,
      rules,
      sellerId,
      setActiveSidebarState,
      setSelectedPickupPoint,
      shouldUseMaps,
      storePreferencesData,
    } = this.props

    const { showList } = this.state

    return (
      <div className={`${styles.pointsList} pkpmodal-points-list`}>
        {bestPickupOptions.length > 0 && (
          <Fragment>
            <p className={styles.pickupListTitle}>
              {translate(intl, 'bestResults')}
            </p>
            {bestPickupOptions
              .filter((_, index) => index < 3)
              .map(pickupPoint => (
                <div
                  className={`${styles.pointsItem} pkpmodal-points-item`}
                  key={`best-pickupPoint-${pickupPoint.id}`}>
                  <PickupPointInfo
                    handleChangeActivePickupDetails={changeActivePickupDetails}
                    isList
                    isBestPickupPoint
                    items={items}
                    logisticsInfo={logisticsInfo}
                    pickupPoint={pickupPoint}
                    pickupPointId={pickupPoint.id}
                    selectedRules={rules}
                    sellerId={sellerId}
                    setActiveSidebarState={setActiveSidebarState}
                    setSelectedPickupPoint={setSelectedPickupPoint}
                    shouldUseMaps={shouldUseMaps}
                    storePreferencesData={storePreferencesData}
                  />
                </div>
              ))}
            {!showList && (
              <Button
                id="pkpmodal-show-list-btn"
                kind="secondary"
                large
                moreClassName={`${
                  styles.showListButton
                } pkpmodal-show-list-btn`}
                onClick={this.handleShowList}
                title={translate(intl, 'showPickupPointsList')}
              />
            )}
          </Fragment>
        )}
        {showList && (
          <Fragment>
            <p className={styles.pickupListTitle}>
              {translate(intl, 'resultsOrderedByDistance')}
            </p>
            {pickupOptions.map(pickupPoint => (
              <div
                className={`${styles.pointsItem} pkpmodal-points-item`}
                key={`pickupPoint-${pickupPoint.id}`}>
                <PickupPointInfo
                  handleChangeActivePickupDetails={changeActivePickupDetails}
                  isList
                  items={items}
                  logisticsInfo={logisticsInfo}
                  pickupPoint={pickupPoint}
                  pickupPointId={pickupPoint.id}
                  selectedRules={rules}
                  sellerId={sellerId}
                  setActiveSidebarState={setActiveSidebarState}
                  setSelectedPickupPoint={setSelectedPickupPoint}
                  shouldUseMaps={shouldUseMaps}
                  storePreferencesData={storePreferencesData}
                />
              </div>
            ))}
            {externalPickupPoints.map(pickupPoint => (
              <div
                className={`${styles.pointsItem} pkpmodal-points-item`}
                key={`external-pickupPoint-${pickupPoint.id}`}>
                <PickupPointInfo
                  handleChangeActivePickupDetails={changeActivePickupDetails}
                  isList
                  items={items}
                  logisticsInfo={logisticsInfo}
                  pickupPoint={pickupPoint}
                  pickupPointId={pickupPoint.id}
                  selectedRules={rules}
                  sellerId={sellerId}
                  setActiveSidebarState={setActiveSidebarState}
                  setSelectedPickupPoint={setSelectedPickupPoint}
                  shouldUseMaps={shouldUseMaps}
                  storePreferencesData={storePreferencesData}
                />
              </div>
            ))}
          </Fragment>
        )}
      </div>
    )
  }
}

PickupPointsList.propTypes = {
  bestPickupOptions: PropTypes.array,
  changeActivePickupDetails: PropTypes.func,
  externalPickupPoints: PropTypes.array,
  intl: intlShape,
  items: PropTypes.array.isRequired,
  logisticsInfo: PropTypes.array.isRequired,
  pickupOptions: PropTypes.array.isRequired,
  rules: PropTypes.object.isRequired,
  sellerId: PropTypes.string,
  setActiveSidebarState: PropTypes.func.isRequired,
  setSelectedPickupPoint: PropTypes.func.isRequired,
  shouldUseMaps: PropTypes.bool.isRequired,
  storePreferencesData: PropTypes.object.isRequired,
}

export default injectState(injectIntl(PickupPointsList))
