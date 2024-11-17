# IS442 OOP G3T1 Cleaning Scheduler

**IS442 OOP G3T1 Cleaning Scheduler** is a comprehensive cleaning management platform built with [Next.js](https://nextjs.org/), designed to streamline client, contract, and shift management processes.

## Features

- **Client Management**: Create and manage clients, including properties and contact information.  
- **Contract Management**: Create and manage contracts with details like duration, frequency, and associated properties.  
- **Shift Management**: Start and end shifts with image uploads, view detailed shift records, and track shift statuses.  
- **Leave Management**: Apply for medical and annual leave, including file uploads for supporting documents such as medical certificates.  
- **Google Maps Integration**: View directions and calculate travel duration between locations.  
- **Data Visualization**: Visualize key data points such as clients, contracts, workers, and sessions using interactive charts.

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Ensure you have the following installed on your system:
- Node.js (16 or higher)
- npm, Yarn, pnpm, or Bun (any package manager)

In order to run the backend system, please clone this repository (https://github.com/TonyDS2022/is442-cleaning-scheduler.git) and follow the steps listed in the respective README file

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mageshkarthiga/oop-cleaning-scheduler.git
   cd oop-cleaning-scheduler
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

### Running the Development Server

Start the server in development mode:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application. The page auto-updates as you edit files in the `app` directory.

## Fonts

This project uses `next/font` to automatically optimize and load the **Inter** font from Google Fonts.

## Directory Structure

- `app/page.js`: The main entry point for the application. Modify this file to update the homepage.
- `app/client`: Pages related to client management
- `app/calendar`: Calendar view of sessions for admins and shifts for workers
- `app/components`: Consists of components commonly used across all pages
- `app/contract`: Pages related to contract management
- `app/leave`: Pages related to leave application submission and approval/rejection
- `app/session`: Page to show cleaning sessions details according to the ID
- `app/shift`: Page to show shift details according to the 
- `app/layout.js`: To manage the styling of the application
- `styles`: CSS file to apply global styles across the application


## License

This project is licensed under the [MIT License](LICENSE).
