import kebabCase from 'lodash/kebabCase'
import reduce from 'lodash/reduce'

import { DELIVERY } from '../constants'

export function groupByCommonDeliveries(li) {
  const slasIds = kebabCase(
    reduce(
      li.slas,
      (acc, sla) =>
        sla.deliveryChannel === DELIVERY ? `${acc}${sla.id} ` : '',
      ''
    )
      .trim()
      .toLowerCase()
  )

  return li.selectedSla ? `seller-${li.seller}-${slasIds}` : 'unavailable'
}

export function groupByCommonPickups(li) {
  const selectedSla = li.slas.find((sla) => sla.id === li.selectedSla)

  return `seller-${li.seller}-${selectedSla && selectedSla.id}`
}
