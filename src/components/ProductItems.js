import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { fixImageUrl } from '../utils/Images'

import './ProductItems.css'

export class ProductItems extends Component {
  translate = (id, values) =>
    this.props.intl.formatMessage({ id: `pickupPointsModal.${id}` }, values)

  render() {
    const { itemsByPackages, items, available } = this.props

    return itemsByPackages ? (
      <div className={styles.itemsGroup}>
        {itemsByPackages.map(itemsPackage => {
          const days =
            itemsPackage.selectedSlaItem &&
            itemsPackage.selectedSlaItem.shippingEstimate &&
            itemsPackage.selectedSlaItem.shippingEstimate.split(/[0-9]+/)[1]
          const daysAmount =
            itemsPackage.selectedSlaItem &&
            itemsPackage.selectedSlaItem.shippingEstimate &&
            itemsPackage.selectedSlaItem.shippingEstimate.split(/\D+/)[0]

          return (
            <div
              key={
                itemsPackage.firstLogisticsInfo.itemIndex +
                itemsPackage.firstLogisticsInfo.itemId +
                (itemsPackage.selectedSlaItem &&
                  itemsPackage.selectedSlaItem.id) +
                (itemsPackage.selectedSlaItem &&
                  itemsPackage.selectedSlaItem.shippingEstimate)
              }
            >
              {daysAmount &&
                itemsByPackages.length > 1 && (
                  <p>
                    {this.translate(`shippingEstimate-${days}`, {
                      days: daysAmount,
                    })}
                  </p>
                )}
              <div className="items delivery-items">
                {itemsPackage.items.map(item => {
                  return (
                    <img
                      className={`item ${available ? '' : 'unavailable'} ${
                        available ? '' : 'delivery-item-unavailable'
                      } delivery-item mr1`}
                      key={item.uniqueId}
                      src={fixImageUrl(item.imageUrl)}
                      alt={item.name}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    ) : (
      <div className="items delivery-items">
        {items.map(item => {
          return (
            <img
              className={`item ${available ? '' : 'unavailable'} ${
                available ? '' : 'delivery-item-unavailable'
              } delivery-item mr1`}
              key={item.uniqueId}
              src={fixImageUrl(item.imageUrl)}
              alt={item.name}
            />
          )
        })}
      </div>
    )
  }
}

ProductItems.defaultProps = {
  available: true,
}

ProductItems.propTypes = {
  intl: intlShape,
  itemsByPackages: PropTypes.array,
  items: PropTypes.array,
  available: PropTypes.bool,
}

export default injectIntl(ProductItems)
