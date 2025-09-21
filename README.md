# Aldi E-Commerce Demo

This is an Angular-based e-commerce demo application for Aldi, featuring product listing, shopping cart functionality, and a modern UI using PrimeNG and Bootstrap.  
The app uses Angular **standalone components** and the new router configuration via `provideRouter`.

## Features

- Product listing with images, prices, and package info
- Shopping cart with total calculation and badge indicator
- Search bar for filtering products
- Responsive design using Bootstrap and SCSS
- PrimeNG components for cards, buttons, icons, and badges
- Angular standalone components and standalone routing

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

1. Clone the repository:

   ```sh
   git clone <your-repo-url>
   cd aldi-test
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Running the Application

Start the development server:

```sh
npm start
```

The app will be available at [http://localhost:4200](http://localhost:4200).

### Running Tests

To execute unit tests:

```sh
npm test
```

## Project Structure

- `src/app/components/` — UI components (product list, product item, cart, cart item)
- `src/app/services/` — Angular services (product fetching, cart logic)
- `src/app/interfaces/` — TypeScript interfaces (e.g., `Product`)
- `src/app/app.ts` — Root standalone component
- `src/app/app.routes.ts` — Route configuration for standalone routing

## Technologies Used

- Angular 17+ (standalone components & routing)
- PrimeNG & PrimeIcons
- Bootstrap 5
- RxJS
- SCSS

## Routing

Routes are configured in [`src/app/app.routes.ts`](src/app/app.routes.ts) and provided via `provideRouter` in `main.ts`.  
Navigation uses `[routerLink]` on `<a>` tags for client-side routing.

## Customization

- Theme can be customized in `src/app/app.scss`.
- Product API endpoint is set in `src/app/services/product.service.ts`.

## License

This project is for demonstration purposes.
