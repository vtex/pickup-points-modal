import React from 'react'
import type { InjectedIntlProps } from 'react-intl'
import { injectIntl } from 'react-intl'

import styles from './PickupBusinessHours.css'
import { translate } from '../utils/i18nUtils'
import PickupPointHour from './PickupPointHour'

const DAYS_ORDER = [1, 2, 3, 4, 5, 6, 0]

const MONDAY = 1
const FRIDAY = 5

const MONDAY_INDEX = DAYS_ORDER.indexOf(MONDAY)
const FRIDAY_INDEX = DAYS_ORDER.indexOf(FRIDAY)

function doesWeekDaysHaveTheSameHours(businessHours: NormalizedBusinessHour[]) {
  const weekDays = businessHours.slice(MONDAY_INDEX, FRIDAY_INDEX + 1)

  const [monday] = weekDays

  let previousOpeningTime = monday.closed ? null : monday.openingTime
  let previousClosingTime = monday.closed ? null : monday.closingTime

  for (let i = 1; i < weekDays.length; i++) {
    const currentDay = weekDays[i]

    const currentDayOpeningTime = currentDay.closed
      ? null
      : currentDay.openingTime

    const currentDayClosingTime = currentDay.closed
      ? null
      : currentDay.closingTime

    if (
      currentDayOpeningTime !== previousOpeningTime ||
      currentDayClosingTime !== previousClosingTime
    ) {
      return false
    }

    previousOpeningTime = currentDayOpeningTime
    previousClosingTime = currentDayClosingTime
  }

  return true
}

function condenseWeekDaysHours(businessHours: NormalizedBusinessHour[]) {
  return businessHours.reduce<NormalizedBusinessHour[]>(
    (acc, businessHour, index) => {
      if (index >= MONDAY_INDEX && index <= FRIDAY_INDEX) {
        if (index === MONDAY_INDEX) {
          return acc.concat({
            number: '1to5',
            ...(businessHour.closed
              ? {
                  closed: businessHour.closed,
                }
              : {
                  closed: businessHour.closed,
                  openingTime: businessHour.openingTime,
                  closingTime: businessHour.closingTime,
                }),
          })
        }

        return acc
      }

      return acc.concat(businessHour)
    },
    []
  )
}

type NormalizedBusinessHour =
  | {
      closed: true
      number: string | number
    }
  | {
      openingTime: string
      closingTime: string
      closed: false
      number: string | number
    }

function normalizeBusinessHours(
  businessHours: BusinessHour[]
): NormalizedBusinessHour[] {
  return DAYS_ORDER.map((number) => {
    const day = businessHours.find(
      (businessDay) => number === businessDay.DayOfWeek
    )

    const dayObject = day && {
      closed: false,
      openingTime: day.OpeningTime,
      closingTime: day.ClosingTime,
    }

    return {
      number,
      closed: true,
      ...(dayObject ?? {}),
    }
  })
}

export function formatBusinessHoursList(businessHours: BusinessHour[]) {
  const normalizedBusinessHours = normalizeBusinessHours(businessHours)

  const weekDaysHaveTheSameHours = doesWeekDaysHaveTheSameHours(
    normalizedBusinessHours
  )

  if (weekDaysHaveTheSameHours) {
    return condenseWeekDaysHours(normalizedBusinessHours)
  }

  return normalizedBusinessHours
}

interface BusinessHour {
  DayOfWeek: number
  OpeningTime: string
  ClosingTime: string
}

interface Props {
  businessHours: BusinessHour[]
}

const PickupBusinessHours: React.FC<Props & InjectedIntlProps> = ({
  intl,
  businessHours,
}) => {
  const formattedBusinessHours = formatBusinessHoursList(businessHours)

  return (
    <div className={`${styles.modalDetailsGroup} pkpmodal-details-group`}>
      <h3
        className={`${styles.modalDetailsInfoTitle} pkpmodal-details-info-title`}
      >
        {translate(intl, 'businessHours')}
      </h3>
      <table className={`${styles.modalDetailsHours} pkpmodal-details-hours`}>
        <tbody>
          {formattedBusinessHours.map((day, i) => {
            return (
              <tr key={i}>
                <td
                  className={`${styles.modalDetailsHoursDay} pkpmodal-details-hours-day`}
                >
                  {translate(intl, `weekDay${day.number}`)}
                </td>
                {day.closed ? (
                  <td
                    className={`${styles.modalDetailsHoursClosed} pkpmodal-details-hours-closed`}
                  >
                    {translate(intl, 'closed')}
                  </td>
                ) : (
                  <td
                    className={`${styles.modalDetailsHoursRange} pkpmodal-details-hours-range`}
                  >
                    <PickupPointHour time={day.openingTime} />{' '}
                    {translate(intl, 'hourTo')}{' '}
                    <PickupPointHour time={day.closingTime} />
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default injectIntl(PickupBusinessHours)
