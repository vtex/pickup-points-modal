import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { fixImageUrl } from '../utils/Images'
import ReactTooltip from 'react-tooltip'
import TranslateEstimate from 'vtex.shipping-estimate-translator/TranslateEstimate'

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
    const { itemsByPackages, items, isAvailable } = this.props

    return itemsByPackages ? (
      <div className="pkpmodal-product-items-group">
        {itemsByPackages.map(itemsPackage => {
          const { firstLogisticsInfo, selectedSlaItem } = itemsPackage

          return (
            <div key={createKey(firstLogisticsInfo, selectedSlaItem)}>
              {itemsByPackages.length > 1 && (
                <p>
                  <TranslateEstimate
                    shippingEstimate={
                      itemsPackage &&
                      itemsPackage.selectedSlaItem &&
                      itemsPackage.selectedSlaItem.shippingEstimate
                    }
                    isPickup
                  />
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
  isAvailable: PropTypes.bool,
  items: PropTypes.array,
  itemsByPackages: PropTypes.array,
}

export default ProductItems
