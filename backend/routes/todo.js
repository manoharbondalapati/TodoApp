const express = require('express');
const router = express.Router();
const { createTodo, getTodos, getTodoById, updateTodo, deleteTodo } = require('../controllers/todoController');
const auth = require('../middleware/authMiddleware');

router.post('/todos', auth, createTodo);
router.get('/todos', auth, getTodos);
router.get('/todos/:id', auth,getTodoById);
router.put('/todos/:id', auth, updateTodo);
router.delete('/todos/:id', auth, deleteTodo);

module.exports = router;