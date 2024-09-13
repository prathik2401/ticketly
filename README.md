# Ticketly

Ticketly is an event booking web application that allows users to browse, book, and manage event tickets. It uses a Django backend and a React frontend.

## Features

- User authentication and authorization
- Browse events by category
- Book and manage tickets
- Admin panel for event management
- Responsive design

## Technologies

- **Backend**: Django, Django REST framework
- **Frontend**: React
- **Database**: PostgreSQL (NeonDB)

## Installation

### Prerequisites

- Python 3.11.x
- Node.js

### Backend Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/ticketly.git
    cd ticketly
    ```

2. Go to ticketly_backend and activate virual environment using:
    ```sh
    pipenv shell
    ```

3. Install backend dependencies:
    ```sh
    pip install -r requirements.txt
    ```

4. Apply migrations:
    ```sh
    python manage.py migrate
    ```

5. Create a superuser:
    ```sh
    python manage.py createsuperuser
    ```

6. Run the backend server:
    ```sh
    python manage.py runserver
    ```

### Frontend Setup

1. Navigate to the frontend directory:
    ```sh
    cd frontend
    ```

2. Install frontend dependencies:
    ```sh
    npm install
    ```

3. Run the frontend development server:
    ```sh
    npm start
    ```

## Usage

- Open your browser and navigate to `http://localhost:3000` to access the frontend.
- The backend API will be available at `http://localhost:8000`.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License.
