# Fintrack Backend

A complete Node.js/Express backend for the Fintrack Finance Tracker application.

## Features

- User Authentication (Register/Login)
- Income Management
- Expense Management  
- Budget Management
- Goal Management
- MongoDB Database with Mongoose
- Clean MVC Architecture

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Income
- `POST /api/income/add` - Add income entry
- `GET /api/income/:userId` - Get all income for user
- `DELETE /api/income/:id` - Delete income entry

### Expense
- `POST /api/expense/add` - Add expense entry
- `GET /api/expense/:userId` - Get all expenses for user
- `DELETE /api/expense/:id` - Delete expense entry

### Budget
- `POST /api/budget` - Create/update budget
- `GET /api/budget/:userId` - Get budget for user

### Goals
- `POST /api/goal` - Create new goal
- `GET /api/goal/:userId` - Get all goals for user

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment Variables
Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fintrack
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For macOS with Homebrew
brew services start mongodb-community

# Or start mongod directly
mongod
```

### 4. Run the Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## Database Models

### User
- name: String
- email: String (unique)
- password: String (hashed)

### Income
- userId: ObjectId (ref: User)
- amount: Number
- source: String
- date: Date
- note: String

### Expense
- userId: ObjectId (ref: User)
- amount: Number
- category: String
- date: Date
- note: String

### Budget
- userId: ObjectId (ref: User)
- amount: Number

### Goal
- userId: ObjectId (ref: User)
- goalName: String
- target: Number
- saved: Number

## Project Structure

```
backend/
├── models/
│   ├── User.js
│   ├── Income.js
│   ├── Expense.js
│   ├── Budget.js
│   └── Goal.js
├── controllers/
│   ├── authController.js
│   ├── incomeController.js
│   ├── expenseController.js
│   ├── budgetController.js
│   └── goalController.js
├── routes/
│   ├── auth.js
│   ├── income.js
│   ├── expense.js
│   ├── budget.js
│   └── goal.js
├── config/
│   └── database.js
├── middleware/
├── server.js
├── package.json
├── .env
└── README.md
```

## Testing the API

You can test the API using Postman, curl, or any HTTP client:

### Example: Register a user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"123456"}'
```

### Example: Add income
```bash
curl -X POST http://localhost:5000/api/income/add \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID","amount":5000,"source":"Salary","note":"Monthly salary"}'
```

## Error Handling

All API responses follow a consistent format:
- Success: `{ success: true, data: ... }`
- Error: `{ success: false, message: "Error description" }`
