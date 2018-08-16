import { formatBusinessHoursList } from './pickupUtils'

describe('Format business hours', () => {
  it('should return all days', () => {
    const businessHours = [
      { DayOfWeek: 1, OpeningTime: '08:00:00', ClosingTime: '10:00:00' },
    ]

    const result = formatBusinessHoursList(businessHours)

    expect(result).toHaveLength(7)
  })

  it('should condense week days if hours are the same', () => {
    const businessHours = [
      { DayOfWeek: 1, OpeningTime: '08:00:00', ClosingTime: '10:00:00' },
      { DayOfWeek: 2, OpeningTime: '08:00:00', ClosingTime: '10:00:00' },
      { DayOfWeek: 3, OpeningTime: '08:00:00', ClosingTime: '10:00:00' },
      { DayOfWeek: 4, OpeningTime: '08:00:00', ClosingTime: '10:00:00' },
      { DayOfWeek: 5, OpeningTime: '08:00:00', ClosingTime: '10:00:00' },
      { DayOfWeek: 6, OpeningTime: '08:00:00', ClosingTime: '10:00:00' },
      { DayOfWeek: 0, OpeningTime: '08:00:00', ClosingTime: '10:00:00' },
    ]

    const result = formatBusinessHoursList(businessHours)

    expect(result).toHaveLength(3)
    expect(result[0].number).toBe('1to5')
  })

  it("should set a day to closed if it's not defined", () => {
    const businessHours = [
      { DayOfWeek: 1, OpeningTime: '08:00:00', ClosingTime: '10:00:00' },
      { DayOfWeek: 2, OpeningTime: '08:00:00', ClosingTime: '10:00:00' },
      { DayOfWeek: 4, OpeningTime: '08:00:00', ClosingTime: '10:00:00' },
      { DayOfWeek: 5, OpeningTime: '08:00:00', ClosingTime: '10:00:00' },
      { DayOfWeek: 6, OpeningTime: '08:00:00', ClosingTime: '10:00:00' },
      { DayOfWeek: 0, OpeningTime: '08:00:00', ClosingTime: '10:00:00' },
    ]

    const result = formatBusinessHoursList(businessHours)

    expect(result[2].closed).toBe(true)
  })

  it('should change object properties to camelCase', () => {
    const businessHours = [
      { DayOfWeek: 1, OpeningTime: '08:00:00', ClosingTime: '10:00:00' },
    ]

    const result = formatBusinessHoursList(businessHours)

    expect(result[0]).toHaveProperty('number')
    expect(result[0]).toHaveProperty('closed')
    expect(result[0]).toHaveProperty('openingTime')
    expect(result[0]).toHaveProperty('closingTime')
  })

  it('should reorder days', () => {
    const businessHours = [
      { DayOfWeek: 2, OpeningTime: '02:00:00', ClosingTime: '10:00:00' },
      { DayOfWeek: 4, OpeningTime: '04:00:00', ClosingTime: '10:00:00' },
      { DayOfWeek: 5, OpeningTime: '05:00:00', ClosingTime: '10:00:00' },
      { DayOfWeek: 3, OpeningTime: '03:00:00', ClosingTime: '10:00:00' },
      { DayOfWeek: 0, OpeningTime: '00:00:00', ClosingTime: '10:00:00' },
      { DayOfWeek: 1, OpeningTime: '01:00:00', ClosingTime: '10:00:00' },
      { DayOfWeek: 6, OpeningTime: '06:00:00', ClosingTime: '10:00:00' },
    ]

    const result = formatBusinessHoursList(businessHours)

    expect(result[0].number).toBe(1)
    expect(result[1].number).toBe(2)
    expect(result[2].number).toBe(3)
    expect(result[3].number).toBe(4)
    expect(result[4].number).toBe(5)
    expect(result[5].number).toBe(6)
    expect(result[6].number).toBe(0)
  })
})
