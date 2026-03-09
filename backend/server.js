require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connect } = require('./db');         // Your db connection file
const { ObjectId } = require('mongodb');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware: CORS to allow frontend origin only
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Middleware: Parse JSON body with limit
app.use(express.json({ limit: '10kb' }));

app.use(helmet());
app.use(morgan('combined'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// --- API Routes ---

// GET /api/todos - get all todos sorted by newest first
app.get('/api/todos', async (req, res) => {
  try {
    const db = await connect();
    const todos = await db.collection('todos')
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.json(todos);
  } catch (err) {
    console.error('GET /api/todos error:', err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST /api/todos - create a new todo
app.post('/api/todos', async (req, res) => {
  try {
    if (!req.body.task?.trim()) {
      return res.status(400).json({ error: 'Task is required' });
    }

    const db = await connect();
    const newTodo = {
      task: req.body.task.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('todos').insertOne(newTodo);
    
    res.status(201).json({
      _id: result.insertedId,
      ...newTodo
    });
  } catch (err) {
    console.error('POST /api/todos error:', err);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PUT /api/todos/:id - update a todo by ID
app.put('/api/todos/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const db = await connect();
    const updates = {
      ...req.body,
      updatedAt: new Date()
    };

    const result = await db.collection('todos').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(result.value);
  } catch (err) {
    console.error('PUT /api/todos error:', err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE /api/todos/:id - delete a todo by ID
app.delete('/api/todos/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const db = await connect();
    const result = await db.collection('todos').deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).end(); // No content on success
  } catch (err) {
    console.error('DELETE /api/todos error:', err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Health check endpoints
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.get('/health', async (req, res) => {
  try {
    const db = await connect();
    await db.command({ ping: 1 });
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch {
    res.status(200).json({
      status: 'ok',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

// Root route to show simple message instead of 404 JSON on "/"
app.get('/', (req, res) => {
  res.send('<h1>ToDo API Backend</h1><p>Use /api/todos endpoints for API.</p>');
});

// 404 handler - for any unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
async function start() {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  });
}

if (require.main === module) {
  start().catch(err => {
    console.error('Fatal startup error:', err);
    process.exit(1);
  });
}

module.exports = app;
