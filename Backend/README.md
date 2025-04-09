# PharmaCare+ Backend API

This is the backend API for the PharmaCare+ application, a comprehensive health management system that bridges the gap between pharmacies and users.

## Technologies Used

- **Java 17**: Core programming language
- **Spring Boot 3.2.3**: Application framework
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Database access
- **PostgreSQL**: Primary database
- **Redis**: Caching
- **JWT**: Token-based authentication
- **OAuth2**: Social login
- **Swagger/OpenAPI**: API documentation

## Prerequisites

- Java 17 or higher
- Maven
- PostgreSQL
- Redis

## Setup and Installation

1. Clone the repository
2. Configure PostgreSQL:
   - Create a database named `pharmacare`
   - Update `application.properties` with your database credentials if needed
3. Configure Redis:
   - Ensure Redis is running on localhost:6379 or update `application.properties` with your Redis configuration
4. Configure Google OAuth2 (optional, but recommended):
   - Follow the instructions in the "Google OAuth2 Setup" section below
5. Build the project:
   ```bash
   mvn clean install
   ```
6. Run the application:
   ```bash
   mvn spring-boot:run
   ```

## Google OAuth2 Setup

To enable Google OAuth2 authentication:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "OAuth consent screen"
4. Choose "External" user type and click "Create"
5. Fill in the required information (App name, User support email, Developer contact information)
6. Add the scopes: `.../auth/userinfo.email`, `.../auth/userinfo.profile`, and `openid`
7. Add your test users (including your own email)
8. Complete the setup
9. Navigate to "APIs & Services" > "Credentials"
10. Click "Create Credentials" > "OAuth client ID"
11. Select "Web application" as the application type
12. Add a name for your OAuth client
13. Add authorized JavaScript origins:
    - `http://localhost:5173` (for Vite frontend)
    - `http://localhost:8080` (for Spring Boot backend)
14. Add authorized redirect URIs:
    - `http://localhost:8080/api/oauth2/callback/google`
15. Click "Create"
16. Note your Client ID and Client Secret
17. Update `application.properties` with your Client ID and Client Secret:
    ```properties
    spring.security.oauth2.client.registration.google.client-id=your-client-id
    spring.security.oauth2.client.registration.google.client-secret=your-client-secret
    ```

## API Documentation

Once the application is running, you can access the Swagger UI at:
```
http://localhost:8080/api/swagger-ui.html
```

## Features

- User authentication (JWT + OAuth2)
- Medication management
- Reminder system
- Family member management
- Medicine donation system
- Caching with Redis for improved performance

## Project Structure

- `config`: Configuration classes
- `controller`: REST API controllers
- `dto`: Data Transfer Objects
- `exception`: Custom exceptions
- `model`: Entity classes
- `repository`: Data access layer
- `security`: Security configuration and JWT handling
- `service`: Business logic
- `util`: Utility classes

## Troubleshooting

### CORS Issues

If you encounter CORS issues:

1. Ensure your frontend origin is listed in the `cors.allowed-origins` property in `application.properties`
2. Check that the `CorsFilter` is properly configured
3. Verify that your requests include the proper headers

### Authentication Issues

If you encounter authentication issues:

1. Check that the JWT token is being properly sent in the Authorization header
2. Verify that the token is not expired
3. Ensure that the user exists in the database
4. Check the server logs for more detailed error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 