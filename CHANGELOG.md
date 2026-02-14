# Changelog

All notable changes to this project will be documented in this file.

## [0.2.1] - 2026-02-14

### Fixed
- **Mobile Distortion**: Resolved canvas stretching issues on mobile browsers by syncing internal resolution with device pixel ratio.
- **Coordinate Offset**: Fixed interaction "force field" misalignment by using `getBoundingClientRect` for relative mouse/touch positions.
- **Orientation Change**: Added smooth particle re-scaling when switching between portrait and landscape modes.

### Changed
- Refactored `App.vue` demo with minimalist UI and real-time value toggles (Wind, Mouse Interaction).
- Optimized CSS using variables for easier theme switching.

## [0.2.0] - 2026-02-14

### Added
- **Auto-Season Mode**: Automatic season detection based on the current month.
- **Mouse/Touch Interaction**: Particles now react to user movement.
- **Smart Density**: Implemented square-root scaling to ensure consistent particle density across all screen sizes (Mobile to 4K).

### Changed
- Updated documentation and added live demo link.

## [0.1.0] - 2026-02-13

### Added
- Initial release with basic Spring, Summer, Autumn, and Winter effects.