import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedTime } from 'react-intl'

class PickupPointHour extends Component {
  render() {
    const hoursNumbers = this.props.time.split(':').map((t) => parseInt(t, 10))
    const time = (new Date()).setHours.apply(new Date, hoursNumbers)

    return <FormattedTime value={time} />
  }
}

PickupPointHour.propTypes = {
  time: PropTypes.string.isRequired,
}

export default PickupPointHour
