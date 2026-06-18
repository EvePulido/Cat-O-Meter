# Change Log

*Read this in other languages: [Español](CHANGELOG.es.md)*

## [1.1.2] - 2026-06-18
### Changed
- Translated the extension description in `package.json` to English.

## [1.1.1] - 2026-06-05
### Fixed
- Fixed a bug where the cat image would disappear when switching sidebar panels or tabs, by implementing a load-handshake verification.

## [1.1.0] - 2026-06-05
### Added
- Added 2 new cat reactions for each severity level (8 new reactions in total).

### Changed
- Adjusted severity level error thresholds (Stressed: 4-7 errors, Chaos: 8+ errors) to make chaos reactions trigger more realistically during active refactorings.
- Converted all new media resources to WebP format to drastically reduce extension weight and speed up installation.

## [1.0.1] - 2026-05-16
### Fixed
- The image no longer changes if the error count remains the same.
- Smoothed the fade transition effect.

## [1.0.0] - 2026-05-05
- Initial release of Cat-O-Meter 🐱
- Added 4 severity levels.
- Configured initial collection of cats.