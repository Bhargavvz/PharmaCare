# PharmaCare+ Frontend

This is the frontend application for PharmaCare+, a comprehensive health management system that bridges the gap between pharmacies and users.

## Technologies Used

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client

## Prerequisites

- Node.js 16 or higher
- npm or yarn

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Configure the API URL:
   - Open `src/config.ts` and ensure `API_URL` is set to `http://localhost:8080/api`
4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Backend Integration

The frontend is designed to work with the PharmaCare+ backend API. Make sure the backend is running before using the frontend.

### Authentication

The frontend uses JWT authentication with the backend. The authentication flow is as follows:

1. User signs up or logs in
2. Backend returns a JWT token
3. Frontend stores the token in localStorage
4. Frontend includes the token in the Authorization header for authenticated requests

### OAuth2 Authentication

The frontend also supports OAuth2 authentication with Google. To use OAuth2:

1. Click the "Sign in with Google" button
2. You will be redirected to Google's authentication page
3. After successful authentication, you will be redirected back to the frontend with a JWT token

## Troubleshooting

### CORS Issues

If you encounter CORS issues:

1. Ensure the backend is properly configured to allow requests from your frontend origin (`http://localhost:5173`)
2. Check that your requests include the proper headers
3. Verify that the backend's CORS filter is properly configured

### Authentication Issues

If you encounter authentication issues:

1. Check that the JWT token is being properly sent in the Authorization header
2. Verify that the token is not expired
3. Ensure that the user exists in the database
4. Check the browser console and server logs for more detailed error messages

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run preview`: Preview the production build locally
- `npm run lint`: Lint the codebase
- `npm run test`: Run tests

## Project Structure

- `src/`: Source code
  - `components/`: React components
  - `pages/`: Page components
  - `context/`: React context providers
  - `services/`: API services
  - `hooks/`: Custom React hooks
  - `utils/`: Utility functions
  - `styles/`: CSS styles
  - `assets/`: Static assets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 