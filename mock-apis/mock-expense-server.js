/*
Express one dependency, deliberately 
Instantiate our express app
create our in memory DB
hand written CORS middleware - answer browser preflight request
GET /api/expenses - return all expenses
GET /api/expenses/error - deliberate 500 error for testing
POST /api/expenses check our bearer token, validate, create new expense, return it
Everything return a JSON 404
listen 3500
*/

//instantiate express
const express = require('express');
const app = express();

//create our in memory DB
let expenses = [
  { id: 1, description: 'Pokemon Cards', amount: 8.5 },
  { id: 2, description: 'Team Lunch', amount: 12.0 },
  { id: 3, description: 'Conference', amount: 300 }
];

// CORS: the browser enforces this policy, our server must respond with
// the right headers to allow the browser to make cross origin requests
// we're going localhost:4200 --
// middleware, not cors package

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // Preflight request, no content
  }
  next(); // let the request continue to the next middleware or route handler
});

// GET /api/expenses - return all expenses
app.get('/api/expenses', (req, res) => {
  res.json(expenses);
});

// GET /api/expenses/error - deliberate 500 error for testing
app.get('/api/expenses/error', (req, res) => {
  res.status(500).json({ error: 'Deliberate server error for testing' });
});

// POST /api/expenses - check our bearer token, validate, create new expense, return it
app.post('/api/expenses', (req, res) => {
// Writes require a bearer token, check for it
  const auth = req.headers['authorization'] || '';

  if (!auth.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Missing Bearer Token'});
  }

  const expense = req.body;
  if (!expense.description || !expense.description.trim()) {
    return res.status(422).json({
      status: 422, error: "Unproceesable Entity",
      message: "Description is required"
    })
  }

  if (expenses.some((e) => e.description == expense.description)) {
    return res.status(422).json({
      status: 422, error: "Unproceesable Entity",
      message: "Description is required"
    })
  }

  const created = { 
    id: expenses.length + 1,
    description: expense.description,
    category: expense.category || 'Other',
    amount: expense.amount || 0
  };

  expenses.push(created);
  res.status(201).json(created);
});

// Everything else return a JSON 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

//listen 3501
const PORT = 3501;
app.listen(PORT, () => {
  console.log(`Mock Expense Server is running on http://localhost:${PORT}`);
});