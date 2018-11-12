import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils/i18nUtils'
import get from 'lodash/get'
import { fixImageUrl } from '../utils/Images'
import ReactTooltip from 'react-tooltip'

import './ProductItems.css'

function createKey(firstLogisticsInfo, selectedSlaItem) {
  return (
    firstLogisticsInfo.itemIndex +
    firstLogisticsInfo.itemId +
    (selectedSlaItem && selectedSlaItem.id) +
    (selectedSlaItem && selectedSlaItem.shippingEstimate)
  )
}

export class ProductItems extends Component {
  render() {
    const { itemsByPackages, intl, items, isAvailable } = this.props

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
            <div key={createKey(firstLogisticsInfo, selectedSlaItem)}>
              {timeAmount &&
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
                      className={`pkpmodal-product-item ${
                        isAvailable ? '' : 'pkpmodal-product-item-unavailable'
                      }`}
                      data-tip={item.name}
                      key={item.uniqueId}>
                      <img alt={item.name} src={fixImageUrl(item.imageUrl)} />
                      {!isAvailable && (
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
              className={`pkpmodal-product-item ${
                isAvailable ? '' : 'pkpmodal-product-item-unavailable'
              }`}
              data-tip={item.name}
              key={item.uniqueId}>
              <img
                alt={item.name}
                data-tip={item.name}
                src={fixImageUrl(item.imageUrl)}
              />
              {!isAvailable && (
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
  isAvailable: true,
}

ProductItems.propTypes = {
  intl: intlShape,
  isAvailable: PropTypes.bool,
  items: PropTypes.array,
  itemsByPackages: PropTypes.array,
}

export default injectIntl(ProductItems)
