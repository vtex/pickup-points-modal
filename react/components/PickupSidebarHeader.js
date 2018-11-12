import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils/i18nUtils'

export class PickupSidebarHeader extends PureComponent {
  render() {
    const { intl, isPickupDetailsActive } = this.props

    return (
      <div className="pkpmodal-header">
        <h4 className="pkpmodal-title">
          {isPickupDetailsActive
            ? translate(intl, 'pointDetails')
            : translate(intl, 'selectPickupPoint')}
        </h4>
      </div>
    )
  }
}

PickupSidebarHeader.propTypes = {
  intl: intlShape,
  isPickupDetailsActive: PropTypes.bool,
}

export default injectIntl(PickupSidebarHeader)
