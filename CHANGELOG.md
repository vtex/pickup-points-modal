# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
