import React from 'react'
import PropTypes from 'prop-types'
import { FormattedTime } from 'react-intl'

interface Props {
  time: string
}

const PickupPointHour: React.FC<Props> = (props) => {
  const hoursNumbers = props.time.split(':').map((t) => parseInt(t, 10)) as [
    number,
    number,
    number
  ]

  const time = new Date().setHours(...hoursNumbers)

  return <FormattedTime value={time} />
}

PickupPointHour.propTypes = {
  time: PropTypes.string.isRequired,
}

export default PickupPointHour
