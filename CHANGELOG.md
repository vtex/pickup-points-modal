# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.4.2] - 2021-08-27

### Fixed

- I18n pt-PT.

## [3.4.1] - 2021-05-27

### Fixed

- Outdated pickup point details shown when switching pickup points through the map or arrow keys.
- Right arrow not being disabled when it reaches the last pickup point.

## [3.4.0] - 2021-05-13

### Added

- I18n Pt-PT.

### Changed

- Crowdin configuration file.

## [3.3.1] - 2020-12-17

### Added

- I18n Cs.

### Fixed

- I18n Fr, It and Nl.

### Changed

- Crowdin configuration file.

## [3.3.0] - 2020-10-05

### Fixed

- i18n for RO & DE.
- Missing json files for BG, DA, EL, FI, KO, RU, SK, SL, SV & UK.

## [3.2.3] - 2020-06-25

### Changed

- Italian translations.

## [3.2.2] - 2020-05-13

### Fixed

- `shippingData` attachment request not sending the current residential address.

## [3.2.1] - 2020-04-28

### Fixed

- English i18n translations.

## [3.2.0] - 2020-03-10

### Added

- Dutch and Polish translations.

## [3.1.0] - 2020-03-06

### Fixed

- Modal breaking if an image URL does not match the regex.

### Changed

- Regular expression used to get image dimensions.

## [3.0.22] - 2020-01-30

### Fixed

- Selecting delivery channel for Delivery items.

## [3.0.21] - 2020-01-29

### Fixed

- Showing pickup unavailable items.

## [3.0.20] - 2019-10-28

### Added

- Add German translations.

## [3.0.19] - 2019-10-24

### Added

- Behavior to when going back to the list from details to scroll to the last pickup point selected.

## [3.0.18] - 2019-10-16

### Fixed

- Not showing best pickup point markers in the remaining pickup points list

## [3.0.17] - 2019-10-03

### Fixed

- Modal breaking if map does not load due to billing issues

## [3.0.16] - 2019-10-02

### Fixed

- Marker changes size on hover and when a pickup point in the list is selected

## [3.0.15] - 2019-09-23

### Fixed

- Showing availability only if not an external pickup point

### Changed

- External pickup points to show only the ones which are not SLAs

## [3.0.14] - 2019-09-13

### Fixed

- Geolocation stuck on loading
- Getting pickup points from simulation

## [3.0.13] - 2019-09-13

### Added

- Parameter to shippingData not to clear address if postalCode not found
- Axios retry to retry if simulation gives errors

### Changed

- Moment to reset markers only if pickup options changed

### Fixed

- Getting selected pickup point from active pickup and selected pickup point

## [3.0.12] - 2019-09-12

### Fixed

- Map not loading on second purchase;
- Searching pickup points with geolocation which would be stuck in a loading screen

## [3.0.11] - 2019-09-12

### Added

- check if simulation SLA contains `pickupPointId` from the selected pickup point

## [3.0.10] - 2019-09-12

### Fixed

- `shippingData` request adding missing `itemIndex` from the body.

## [3.0.9] - 2019-09-11

### Fixed

- Map breaking if did not find bounds.

## [3.0.8] - 2019-09-10

### Fixed

- Searching on mobile through the map would return list mode.

## [3.0.7] - 2019-09-10

### Fixed

- Pickup points order by strings now by floating point number.

## [3.0.6] - 2019-09-09

### Fixed

- Best pickups algorithm, it was returning score as NaN resulting in wrong order;
- Best pickup markers since it was counting only the first pickup point.

## [3.0.5] - 2019-09-09

### Fixed

- Unavailable items amount which previously showed wrongly the items amount.

## [3.0.4] - 2019-09-09

### Fixed

- Permission status from state which prevented users from select geolocation.

## [3.0.3] - 2019-09-09

### Fixed

- Pickups list to only show button if has more than three pickup points.

## [3.0.2] - 2019-09-09

### Changed

- External pickup points endpoint.

## Added

- Fallback if external pickup points promise failed.

## [3.0.1] - 2019-09-05

### Changed

- Update dependencies with audit

## [3.0.0] - 2019-09-05

### Added

- Customized zoom controls

### Changed

- Pickup point pin styles
- Sidebar styles
- Initial state styles
- Searching styles
- State handling using new react context
- Pickup points are now searched with checkout API simulation
- External pickup points are now searched with the new pickup points endpoint

## [2.3.11] - 2019-05-21

### Fixed

- location button when does not have pickups

## [2.3.10] - 2019-05-16

### Fixed

- PostalCode input not editing

## [2.3.9] - 2019-05-13

### Fixed

- Invalid postalCode removal

## [2.3.8] - 2019-05-13

### Fixed

- Invalid postalCode removal

## [2.3.7] - 2019-05-10

### Added

- Condition to handle new argentina postalCodes

## [2.3.6] - 2019-05-10

### Changed

- Address creation to be search addresses

## [2.3.5] - 2019-05-09

### Fixes

- Formatting null values

## [2.3.4] - 2019-05-08

### Fix

- Modal details viewport

## [2.3.3] - 2019-05-03

### Fixed

- Modify button for geolocation fallback

## [2.3.2] - 2019-04-22

### Fixed

- Remove postalCode address if has google maps key

## [2.3.1] - 2019-04-22

### Fixed

- Showing maps on mobile

## [2.3.0] - 2019-04-22

### Added

- PostalCode fallback if does not have google maps API key

## [2.2.0] - 2019-04-08

### Changed

- Changed all css classes to use CSS Modules instead of external CSS

## [2.1.1] - 2019-03-19

### Fix

- Romanian locale messages

### Remove

- Unused italian locale messages

## [2.1.0] - 2019-03-12

### Added

- `intl-equalizer` to lint locales
- `shipping-estimate-translator` to keep estimate translations updated

### Removed

- Some of unused locale keys

## [2.0.2] - 2019-03-07

### Added

- Add Italian translation

## [2.0.1] - 2018-11-26

## [2.0.0] - 2018-11-13

### Changed

Transpose component to VTEX IO scafolding and configuration
