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

- **URL**: `/v1/resume/`
- **Method**: `POST`
- **Body**:

  ```json
  {
    "profile": {
      "email": "john.doe@example.com",
      "location": "123 Main St",
      "name": "John Doe",
      "phone": "1234567890",
      "summary": "An experienced software developer...",
      "url": "johndoe.com"
    },
    "educations": [
      {
        "school": "School Name",
        "degree": "Degree Obtained",
        "date": "Graduation Date",
        "gpa": "3.8",
        "descriptions": ["Description 1", "Description 2"]
      }
    ],
    "workExperiences": [
      {
        "company": "Company Name",
        "date": "Employment Date",
        "jobTitle": "Job Title",
        "descriptions": ["Description 1", "Description 2"]
      }
    ],
    "projects": [
      {
        "date": "Project Date",
        "descriptions": ["Description 1", "Description 2"],
        "project": ["Project Name"]
      }
    ],
    "skills": [
      {
        "descriptions": ["Skill 1", "Skill 2"]
      }
    ],
    "custom": [
      {
        "descriptions": ["Custom Section Description 1", "Custom Section Description 2"]
      }
    ]
  }
  ```

- **Success Response**: HTTP 201 (Created)

#### Get All Resumes

- **URL**: `/v1/resume/`
- **Method**: `GET`
- **Success Response**: HTTP 200 (OK)

#### Get Resume by ID

- **URL**: `/v1/resume/:resumeId`
- **Method**: `GET`
- **Success Response**: HTTP 200 (OK)

#### Delete Resume by ID

- **URL**: `/v1/resume/:resumeId`
- **Method**: `DELETE`
- **Success Response**: HTTP 204 (No Content)

#### Get Resumes by Page

- **URL**: `/v1/resume/resumepage`
- **Method**: `GET`
- **Query Parameters**:
  - `sortBy`: Field to sort by.
  - `limit`: Number of items per page.
  - `page`: Page number.
- **Success Response**: HTTP 200 (OK)

#### Update Resume by ID

- **URL**: `/v1/resume/{resumeId}`
- **Method**: `PATCH`
- **URL Parameters**:
  - `resumeId`: ID of the resume to update.
- **Data Parameters**:
  - Any field of the resume object that needs to be updated.
- **Success Response**: HTTP 200 (OK)
  - **Content**: `{ message: "Resume updated successfully", resume: { updated resume object } }`

### ResumePDF

#### Upload a Resume PDF

- **URL**: `/v1/resumePDF/upload`
- **Method**: `POST`
- **Body**: Form-data with key `pdf` and the PDF file as the value.
- **Success Response**: HTTP 200 (OK) with details of the uploaded file.

#### List All Resume PDFs

- **URL**: `/v1/resumePDF/files`
- **Method**: `GET`
- **Success Response**: HTTP 200 (OK) with a list of all uploaded PDF files.

#### Get a Resume PDF by ID

- **URL**: `/v1/resumePDF/file/:id`
- **Method**: `GET`
- **Success Response**: HTTP 200 (OK) with the requested PDF file content.

#### Delete a Resume PDF by ID

- **URL**: `/v1/resumePDF/file/:id`
- **Method**: `DELETE`
- **Success Response**: HTTP 204 (No Content) after successfully deleting the PDF file.

#### Get Resume PDFs by Page

- **URL**: `/v1/resumePDF/filepage`
- **Method**: `GET`
- **Query Parameters**:
  - `sortBy`: Field to sort by.
  - `limit`: Number of items per page.
  - `page`: Page number.
- **Success Response**: HTTP 200 (OK) with a paginated list of PDF files.

## Models

### Resume Model

The Resume model defines the structure of the resume data, including personal information, education, experience, projects, and skills.

### ResumePDF Model

The ResumePDF model defines the structure of the resume .pdf file.

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
