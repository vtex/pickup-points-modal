import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import styles from './PickupSidebar.css'
import PickupPointInfo from './PickupPointInfo'
import { injectState } from '../modalStateContext'
import { translate } from '../utils/i18nUtils'
import { injectIntl, intlShape } from 'react-intl'
import Button from './Button'
import { BEST_PICKUPS_AMOUNT } from '../constants'
import InfiniteScroll from 'react-infinite-scroller'
import debounce from 'lodash/debounce'
import Spinner from '../assets/components/Spinner'

class PickupPointsList extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      pickupPoints: [...props.pickupOptions, ...props.externalPickupPoints],
      currentPickupPoints: [
        ...props.pickupOptions,
        ...props.externalPickupPoints,
      ].filter((_, index) => index < 20),
      currentAmount: 20,
    }
  }

  componentDidUpdate(prevProps) {
    const { pickupOptions, externalPickupPoints } = this.props
    const { currentAmount } = this.state
    if (
      pickupOptions !== prevProps.pickupOptions ||
      externalPickupPoints !== prevProps.externalPickupPoints
    ) {
      const pickupPoints = [...pickupOptions, ...externalPickupPoints]
      this.setState({
        pickupPoints,
        currentPickupPoints: pickupPoints.filter(
          (_, index) => index < currentAmount
        ),
      })
    }
  }

  loadMorePickupPoints = debounce(() => {
    const { currentAmount, pickupPoints } = this.state

    const updatedAmount = currentAmount + 20

    this.setState({
      currentPickupPoints: pickupPoints.filter(
        (_, index) => index < updatedAmount
      ),
      currentAmount: updatedAmount,
    })
  }, 300)

  handleShowList = () => this.props.setShowOtherPickupPoints(true)

  render() {
    const {
      bestPickupOptions,
      logisticsInfo,
      items,
      intl,
      rules,
      sellerId,
      setActiveSidebarState,
      setSelectedPickupPoint,
      shouldUseMaps,
      showOtherPickupPoints,
      storePreferencesData,
    } = this.props

    const { currentAmount, currentPickupPoints, pickupPoints } = this.state

    const hasMorePickupPoints = currentAmount <= pickupPoints.length

    return (
      <div className={`${styles.pointsList} pkpmodal-points-list`}>
        {bestPickupOptions.length > 0 && (
          <Fragment>
            <p className={styles.pickupListTitle}>
              {translate(intl, 'bestResults')}
            </p>
            {bestPickupOptions
              .filter((_, index) => index < BEST_PICKUPS_AMOUNT)
              .map(pickupPoint => (
                <div
                  className={`${
                    styles.pointsItem
                  } pkpmodal-points-item best-pickupPoint-${pickupPoint.id}`}
                  key={`best-pickupPoint-${pickupPoint.id}`}>
                  <PickupPointInfo
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
            {!showOtherPickupPoints && (
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
        {showOtherPickupPoints && (
          <Fragment>
            <p className={styles.pickupListTitle}>
              {translate(intl, 'resultsOrderedByDistance')}
            </p>
            <InfiniteScroll
              hasMore={hasMorePickupPoints}
              loadMore={this.loadMorePickupPoints}
              loader={
                <p className={`${styles.listLoading} loader`} key={0}>
                  <Spinner size={24} />
                </p>
              }
              useWindow={false}
              threshold={1}>
              {currentPickupPoints.map(pickupPoint => (
                <div
                  className={`${
                    styles.pointsItem
                  } pkpmodal-points-item pickupPoint-${pickupPoint.id}`}
                  key={`pickupPoint-${pickupPoint.id}`}>
                  <PickupPointInfo
                    isList
                    isBestPickupPoint={false}
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
            </InfiniteScroll>
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
  setShowOtherPickupPoints: PropTypes.func.isRequired,
  shouldUseMaps: PropTypes.bool.isRequired,
  showOtherPickupPoints: PropTypes.bool.isRequired,
  storePreferencesData: PropTypes.object.isRequired,
}

export default injectState(injectIntl(PickupPointsList))
