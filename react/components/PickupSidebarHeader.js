import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils/i18nUtils'

import styles from './PickupSidebarHeader.css'

class PickupSidebarHeader extends PureComponent {
  render() {
    const { intl, isPickupDetailsActive } = this.props

    return (
      <div className={`${styles.modalHeader} pkpmodal-header`}>
        <p className={`${styles.modalTitle} pkpmodal-title`}>
          {isPickupDetailsActive
            ? translate(intl, 'pointDetails')
            : translate(intl, 'selectPickupPoint')}
        </p>
      </div>
    )
  }
}

PickupSidebarHeader.propTypes = {
  intl: intlShape.isRequired,
  isPickupDetailsActive: PropTypes.bool,
}

export default injectIntl(PickupSidebarHeader)
