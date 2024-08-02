const Todo = require('../models/todo');

exports.createTodo = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.userId;

  try {
    const todo = new Todo({ userId, title, description });
    await todo.save();
    res.status(201).json({message:'New Todo Created Successfully'});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.userId });
    if (todos.length === 0) {
        return res.status(404).json({ message: 'No todos found for the user.' });
      }
  
      res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTodoById = async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findOne({ _id: id, userId: req.user.userId });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { title, description, completed },
      { new: true }
    );
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json({message:"Todo Updated Successfully"});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTodo = async (req, res) => {
    
  const { id } = req.params;
  try {
    const todo = await Todo.findOneAndDelete({ _id: id, userId: req.user.userId });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo Deleted Successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
