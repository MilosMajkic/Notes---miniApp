# Notes API - Simple RESTful API with Web Interface

A simple RESTful API application for managing notes, built with Node.js and Express.js. All data is stored in a JSON file without using any database.

## Features

- Full CRUD operations (Create, Read, Update, Delete) for notes
- RESTful API endpoints
- Modern web interface for managing notes
- Data persistence using JSON file storage
- No database required
- CORS enabled for frontend access

## Tech Stack

- Node.js
- Express.js
- Vanilla JavaScript (frontend)
- HTML/CSS

## Project Structure

```
beleske-api/
├── server.js          # Main Express server file
├── notes.json         # JSON file for storing notes
├── package.json       # npm configuration
├── test-api.js        # API testing script
└── public/            # Frontend files
    ├── index.html     # Main HTML file
    ├── styles.css     # Styling
    └── app.js         # Frontend JavaScript
```

## Installation

1. Clone the repository or navigate to the project directory

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Start the Server

```bash
node server.js
```

Or using npm:
```bash
npm start
```

The server will start on `http://localhost:3000`

### Access the Web Interface

Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

All endpoints are prefixed with `/beleške`

### GET /beleške
Retrieve all notes

**Response:**
```json
[
  {
    "id": "1234567890",
    "title": "Note Title",
    "content": "Note content",
    "createdAt": "2025-01-01T12:00:00.000Z",
    "updatedAt": "2025-01-01T12:00:00.000Z"
  }
]
```

### POST /beleške
Create a new note

**Request Body:**
```json
{
  "title": "Note Title",
  "content": "Note content"
}
```

**Response:**
```json
{
  "id": "1234567890",
  "title": "Note Title",
  "content": "Note content",
  "createdAt": "2025-01-01T12:00:00.000Z",
  "updatedAt": "2025-01-01T12:00:00.000Z"
}
```

### GET /beleške/:id
Retrieve a specific note by ID

**Response:**
```json
{
  "id": "1234567890",
  "title": "Note Title",
  "content": "Note content",
  "createdAt": "2025-01-01T12:00:00.000Z",
  "updatedAt": "2025-01-01T12:00:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Beleška sa datim ID-jem nije pronađena"
}
```

### PUT /beleške/:id
Update an existing note

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Response:**
```json
{
  "id": "1234567890",
  "title": "Updated Title",
  "content": "Updated content",
  "createdAt": "2025-01-01T12:00:00.000Z",
  "updatedAt": "2025-01-01T13:00:00.000Z"
}
```

### DELETE /beleške/:id
Delete a note by ID

**Response:**
```json
{
  "message": "Beleška je uspešno obrisana",
  "id": "1234567890"
}
```

## Testing

### Using the Test Script

Run the included test script to verify all API endpoints:

```bash
node test-api.js
```

### Using cURL

```bash
# Get all notes
curl http://localhost:3000/beleške

# Create a note
curl -X POST http://localhost:3000/beleške \
  -H "Content-Type: application/json" \
  -d '{"title":"My Note","content":"Note content"}'

# Get a specific note
curl http://localhost:3000/beleške/1234567890

# Update a note
curl -X PUT http://localhost:3000/beleške/1234567890 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","content":"Updated content"}'

# Delete a note
curl -X DELETE http://localhost:3000/beleške/1234567890
```

## Web Interface Features

The web interface provides:

- Create new notes with a simple form
- View all notes in a card-based layout
- Edit existing notes inline
- Delete notes with confirmation
- Real-time updates after each operation
- Responsive design for mobile and desktop
- Date and time display for each note

## Data Storage

All notes are stored in `notes.json` file in the root directory. The file is automatically created if it doesn't exist. Data is persisted using Node.js File System module with asynchronous operations.

## Error Handling

The API returns appropriate HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request (missing required fields)
- 404: Not Found (note doesn't exist)
- 500: Internal Server Error

## CORS

CORS is enabled for all origins, allowing frontend applications to access the API from any domain.

## License

ISC

## Author

Notes API Project


