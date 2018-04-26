import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils/i18nUtils'
import { get } from 'lodash/get'
import { fixImageUrl } from '../utils/Images'
import ReactTooltip from 'react-tooltip'

import './ProductItems.css'

export class ProductItems extends Component {
  render() {
    const { itemsByPackages, intl, items, available } = this.props

    return itemsByPackages ? (
      <div className="pkpmodal-product-items-group">
        {itemsByPackages.map(itemsPackage => {
          const time =
            itemsPackage &&
            get(itemsPackage, 'selectedSlaItem.shippingEstimate') &&
            itemsPackage.selectedSlaItem.shippingEstimate.split(/[0-9]+/)[1]
          const timeAmount =
            itemsPackage &&
            get(itemsPackage, 'selectedSlaItem.shippingEstimate') &&
            itemsPackage.selectedSlaItem.shippingEstimate.split(/\D+/)[0]

          const { firstLogisticsInfo, selectedSlaItem } = itemsPackage

          return (
            <div
              key={
                firstLogisticsInfo.itemIndex +
                firstLogisticsInfo.itemId +
                (selectedSlaItem && selectedSlaItem.id) +
                (selectedSlaItem && selectedSlaItem.shippingEstimate)
              }
            >
              {daysAmount &&
                itemsByPackages.length > 1 && (
                  <p>
                    {translate(intl, `shippingEstimate-${time}`, {
                      timeAmount,
                    })}
                  </p>
                )}
              <div className="pkpmodal-product-items">
                {itemsPackage.items.map(item => {
                  return (
                    <span
                      key={item.uniqueId}
                      data-tip={item.name}
                      className={`pkpmodal-product-item ${
                        available ? '' : 'pkpmodal-product-item-unavailable'
                      }`}
                    >
                      <img src={fixImageUrl(item.imageUrl)} alt={item.name} />
                      {!available && (
                        <span className="pkpmodal-product-item-unavailable-slash" />
                      )}
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
      <div className="pkpmodal-product-items">
        {items.map(item => {
          return (
            <span
              key={item.uniqueId}
              data-tip={item.name}
              className={`pkpmodal-product-item ${
                available ? '' : 'pkpmodal-product-item-unavailable'
              }`}
            >
              <img
                src={fixImageUrl(item.imageUrl)}
                alt={item.name}
                data-tip={item.name}
              />
              {!available && (
                <span className="pkpmodal-product-item-unavailable-slash" />
              )}
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
