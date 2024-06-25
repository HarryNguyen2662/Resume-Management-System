# Resume Management API Documentation

## Overview

This documentation provides an overview of the Resume Management API, which allows for creating, retrieving, updating, and deleting resume information. The API is structured around REST principles, providing a predictable and resource-oriented URLs.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- Validator.js for data validation

## Getting Started

To get started with the Resume Management API, clone the repository and install the dependencies using `npm install`. Ensure you have MongoDB running locally or configure your MongoDB URI for a cloud instance.

## API Endpoints

### Resumes

#### Create a Resume

- **URL**: `/api/resumes/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "personalInfo": {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "1234567890",
      "address": "123 Main St",
      "linkedIn": "linkedin.com/in/johndoe",
      "website": "johndoe.com"
    },
    "education": [...],
    "experience": [...],
    "projects": [...],
    "skills": [...]
  }
  ```
- **Success Response**: HTTP 201 (Created)

#### Get All Resumes

- **URL**: `/api/resumes/`
- **Method**: `GET`
- **Success Response**: HTTP 200 (OK)

#### Get Resume by ID

- **URL**: `/api/resumes/:resumeId`
- **Method**: `GET`
- **Success Response**: HTTP 200 (OK)

#### Delete Resume by ID

- **URL**: `/api/resumes/:resumeId`
- **Method**: `DELETE`
- **Success Response**: HTTP 204 (No Content)

#### Get Resumes by Page

- **URL**: `/api/resumes/resumepage/:page/:limit`
- **Method**: `GET`
- **Success Response**: HTTP 200 (OK)

## Models

### Resume Model

The Resume model defines the structure of the resume data, including personal information, education, experience, projects, and skills.

## Services

### Resume Service

The Resume Service contains the business logic for handling CRUD operations related to resumes. It interacts with the MongoDB database through Mongoose models.

## Controllers

### Resume Controller

The Resume Controller handles incoming HTTP requests and delegates them to the appropriate service methods. It also sends the HTTP responses back to the client.

## Error Handling

The API uses a custom [`ApiError`](command:_github.copilot.openSymbolFromReferences?%5B%7B%22%24mid%22%3A1%2C%22path%22%3A%22%2FUsers%2Ftoannguyen%2FCV_management_system%2Fserver%2Fsrc%2Futils%2FApiError.js%22%2C%22scheme%22%3A%22file%22%7D%2C%7B%22line%22%3A0%2C%22character%22%3A0%7D%5D 'server/src/utils/ApiError.js') class to handle errors uniformly. Errors are caught and processed by middleware to return a consistent error response format.

## Validation

Input validation is performed using Validator.js to ensure that the data received from clients meets the expected format and constraints.

## Pagination

The API supports pagination for listing resumes, allowing clients to specify a page number and a limit for the number of items per page.

## Security

Ensure to implement security best practices, such as validating input data, securing MongoDB connections, and using environment variables for sensitive information.

## Conclusion

This API provides a robust solution for managing resume data, offering flexibility and scalability for future enhancements.
