import React, { Component } from 'react'
import IntlContainer from './IntlContainer'
import Styles from './Styles'

import App from './App'

const locale = 'en'

class Container extends Component {
  render() {
    return (
      <IntlContainer locale={locale}>
        <Styles>
          <App />
        </Styles>
      </IntlContainer>
    )
  }
}

export default Container
