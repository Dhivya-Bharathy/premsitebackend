# Dark Patterns Backend

## Setup & Run

1. Open a terminal and navigate to this `backend` folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm start
   ```

The backend will run on [http://localhost:5000](http://localhost:5000).

## API Endpoint

- **POST** `/analyze-url`
  - **Body:** `{ "url": "https://example.com" }`
  - **Returns:** `{ url, patterns, success }` or `{ error }` 