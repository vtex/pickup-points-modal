import type { ActiveState, SidebarActiveState } from '../StateUtils'
import {
  isDifferentGeoCoords,
  isCurrentState,
  isCurrentStateFromAllStates,
  getInitialActiveState,
  getInitialActiveSidebarState,
  getCleanId,
} from '../StateUtils'
import {
  SIDEBAR,
  INITIAL,
  DETAILS,
  LIST,
  GEOLOCATION_SEARCHING,
} from '../../constants'

describe('isDifferentGeoCoords', () => {
  it('returns false for the same pair of coordinates', () => {
    expect(isDifferentGeoCoords([-46.6, -23.5], [-46.6, -23.5])).toBe(false)
  })

  it('returns true when only the longitude differs', () => {
    expect(isDifferentGeoCoords([-46.6, -23.5], [-43.2, -23.5])).toBe(true)
  })

  it('returns true when only the latitude differs', () => {
    expect(isDifferentGeoCoords([-46.6, -23.5], [-46.6, -22.9])).toBe(true)
  })

  it('treats 0 and -0 as the same coordinate', () => {
    // `!==` follows IEEE semantics here, where -0 === 0
    expect(isDifferentGeoCoords([0, 0], [-0, -0])).toBe(false)
  })
})

describe('isCurrentState', () => {
  it('returns true when both states match', () => {
    expect(isCurrentState(SIDEBAR, SIDEBAR)).toBe(true)
  })

  it('returns false when the states differ', () => {
    expect(isCurrentState(SIDEBAR, INITIAL)).toBe(false)
  })
})

describe('isCurrentStateFromAllStates', () => {
  // the constants are exported as plain strings, so they need narrowing to the
  // union types this helper is declared against
  const states = {
    activeState: SIDEBAR as ActiveState,
    activeSidebarState: DETAILS as SidebarActiveState,
  }

  it('returns true when the state matches the active top-level state', () => {
    expect(isCurrentStateFromAllStates(SIDEBAR, states)).toBe(true)
  })

  it('returns true when the state matches the active sidebar state', () => {
    expect(isCurrentStateFromAllStates(DETAILS, states)).toBe(true)
  })

  it('returns false when the state matches neither', () => {
    expect(isCurrentStateFromAllStates(LIST, states)).toBe(false)
  })
})

describe('getInitialActiveState', () => {
  it('starts in geolocation search when the modal was asked to locate the user', () => {
    expect(
      getInitialActiveState({ askForGeolocation: true, pickupOptions: [] })
    ).toBe(GEOLOCATION_SEARCHING)
  })

  it('prefers geolocation search even when a pickup point is already selected', () => {
    expect(
      getInitialActiveState({
        askForGeolocation: true,
        selectedPickupPoint: { id: 'store-1' },
        pickupOptions: [{ id: 'store-1' }],
      })
    ).toBe(GEOLOCATION_SEARCHING)
  })

  it('opens the sidebar when a pickup point is already selected', () => {
    expect(
      getInitialActiveState({
        askForGeolocation: false,
        selectedPickupPoint: { id: 'store-1' },
        pickupOptions: [],
      })
    ).toBe(SIDEBAR)
  })

  it('opens the sidebar when there are pickup options to show', () => {
    expect(
      getInitialActiveState({
        askForGeolocation: false,
        pickupOptions: [{ id: 'store-1' }],
      })
    ).toBe(SIDEBAR)
  })

  it('falls back to the initial state with no geolocation, selection or options', () => {
    expect(
      getInitialActiveState({ askForGeolocation: false, pickupOptions: [] })
    ).toBe(INITIAL)
  })
})

describe('getInitialActiveSidebarState', () => {
  it('starts in geolocation search when the modal was asked to locate the user', () => {
    expect(getInitialActiveSidebarState({ askForGeolocation: true })).toBe(
      GEOLOCATION_SEARCHING
    )
  })

  it('opens the details pane when a pickup point is already selected', () => {
    expect(
      getInitialActiveSidebarState({
        askForGeolocation: false,
        selectedPickupPoint: { id: 'store-1' },
      })
    ).toBe(DETAILS)
  })

  it('falls back to the list with no geolocation and no selection', () => {
    expect(getInitialActiveSidebarState({ askForGeolocation: false })).toBe(
      LIST
    )
  })
})

describe('getCleanId', () => {
  it('strips punctuation and joins the remaining words with hyphens', () => {
    expect(getCleanId('Store #1, Downtown')).toBe('Store-1-Downtown')
  })

  it('leaves an already clean single-word id untouched', () => {
    expect(getCleanId('store1')).toBe('store1')
  })

  it('returns undefined when no id is given', () => {
    // the optional chain short-circuits rather than throwing
    expect(getCleanId(undefined)).toBeUndefined()
  })

  it('returns an empty string for an empty id', () => {
    expect(getCleanId('')).toBe('')
  })

  it('keeps underscores, which count as word characters', () => {
    expect(getCleanId('store_1')).toBe('store_1')
  })
})
