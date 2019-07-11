import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from './Button'
import styles from '../index.css'
import errorStyles from './ErrorState.css'
import { injectIntl, intlShape } from 'react-intl'
import { INITIAL } from '../constants'
import { translate } from '../utils/i18nUtils'
import { injectState } from '../modalStateContext'

class ErrorState extends PureComponent {
  handleClick = () => this.props.setActiveState(INITIAL)

  render() {
    const { intl, subtitle, title, Icon, isFullPage } = this.props

    return (
      <div
        className={`${
          isFullPage ? styles.modalfullPage : styles.modalSidebar
        } pkpmodal-full-page`}>
        <div
          className={`${styles.searchAlone} ${
            errorStyles.errorModal
          } pkpmodal-search-alone`}>
          <div className={errorStyles.errorWrapper}>
            <Icon />
            <p className={errorStyles.errorTitle}>{translate(intl, title)}</p>
            <p className={errorStyles.errorSubtitle}>
              {translate(intl, subtitle)}
            </p>
            {isFullPage && (
              <Button
                id="pkpmodal-back-to-search"
                kind="primary"
                large
                moreClassName={`${
                  errorStyles.errorBackButton
                } pkpmodal-back-to-search`}
                onClick={this.handleClick}
                title={translate(intl, 'backToSearch')}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}

ErrorState.defaultProps = {
  isFullPage: true,
}

ErrorState.propTypes = {
  intl: intlShape,
  setActiveState: PropTypes.func.isRequired,
  subtitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  Icon: PropTypes.node.isRequired,
  isFullPage: PropTypes.bool,
}

export default injectState(injectIntl(ErrorState))
