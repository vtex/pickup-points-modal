import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { fixImageUrl } from '../utils/Images'
import ReactTooltip from 'react-tooltip'

import './ProductItems.css'

export class ProductItems extends Component {
  translate = (id, values) =>
    this.props.intl.formatMessage({ id: `pickupPointsModal.${id}` }, values)

  render() {
    const { itemsByPackages, items, available } = this.props

    return itemsByPackages ? (
      <div className="itemsGroup">
        {itemsByPackages.map(itemsPackage => {
          const time =
            itemsPackage.selectedSlaItem &&
            itemsPackage.selectedSlaItem.shippingEstimate &&
            itemsPackage.selectedSlaItem.shippingEstimate.split(/[0-9]+/)[1]
          const timeAmount =
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
                    {this.translate(`shippingEstimate-${time}`, {
                      timeAmount,
                    })}
                  </p>
                )}
              <div className="items delivery-items">
                {itemsPackage.items.map(item => {
                  return (
                    <span
                      key={item.uniqueId}
                      data-tip={item.name}
                      className={`item ${available ? '' : 'unavailable'} ${
                        available ? '' : 'delivery-item-unavailable'
                      } delivery-item mr1`}>
                      <img
                        src={fixImageUrl(item.imageUrl)}
                        alt={item.name}
                      />
                      { !available && <span className="unavailable-slash"></span> }
                      <ReactTooltip effect="solid" />
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })}
        <ReactTooltip effect="solid" />
      </div>
    ) : (
      <div className="items delivery-items">
        {items.map(item => {
          return (
            <span
              key={item.uniqueId}
              data-tip={item.name}
              className={`item ${available ? '' : 'unavailable'} ${
                available ? '' : 'delivery-item-unavailable'
              } delivery-item mr1`}>
              <img
                src={fixImageUrl(item.imageUrl)}
                alt={item.name}
                data-tip={item.name}
              />
              { !available && <span className="unavailable-slash"></span> }
              <ReactTooltip effect="solid" />
            </span>
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
