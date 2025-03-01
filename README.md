# eCFR Analyzer

A modern web application for analyzing the Electronic Code of Federal Regulations (eCFR) with interactive visualizations and metrics.

## Overview

The eCFR Analyzer provides insights into federal regulations through data visualization and analysis. It leverages the public eCFR API to present meaningful metrics about regulatory content across different government agencies.

## Features

- **Agency Selection**: Browse and select from all agencies with eCFR content
- **Word Count Analysis**: View total words, average per title, and largest title for each agency
- **Historical Change Tracking**: Analyze corrections and changes over time with adjustable time periods
- **Interactive Visualizations**: Explore data through responsive charts with detailed tooltips
- **Clean, Modern UI**: Intuitive interface designed for ease of use

## Technology Stack

- React with TypeScript
- Vite for fast development and building
- Chart.js and Recharts for data visualization
- Tailwind CSS for styling
- eCFR public API for data

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/ecfr-analyzer.git
   cd ecfr-analyzer
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Build for production
   ```
   npm run build
   ```

## Project Structure

- `/src/components` - React components for UI elements
- `/src/hooks` - Custom hooks for data fetching and processing
- `/src/utils` - Utility functions and API interfaces

## Acknowledgments

- Data provided by the [Electronic Code of Federal Regulations](https://www.ecfr.gov/)

## License

MIT
