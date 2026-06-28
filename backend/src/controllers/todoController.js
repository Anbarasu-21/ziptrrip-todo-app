import TodoModel from '../models/todoModel.js';

export const getAllTodos = async (req, res) => {
  try {
    let todos = await TodoModel.getAll();
    const { search, status, priority, category, sortBy } = req.query;

    // Apply searching (case-insensitive title/description search)
    if (search) {
      const searchLower = search.toLowerCase();
      todos = todos.filter(
        todo =>
          todo.title.toLowerCase().includes(searchLower) ||
          todo.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply filtering by status
    if (status) {
      todos = todos.filter(todo => todo.status === status);
    }

    // Apply filtering by priority
    if (priority) {
      todos = todos.filter(todo => todo.priority === priority);
    }

    // Apply filtering by category
    if (category) {
      todos = todos.filter(todo => todo.category.toLowerCase() === category.toLowerCase());
    }

    // Apply sorting
    if (sortBy) {
      if (sortBy === 'dueDate') {
        todos.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
      } else if (sortBy === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        todos.sort((a, b) => (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0));
      } else if (sortBy === 'createdAt') {
        todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    } else {
      // Default sort by createdAt desc
      todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving todos: ' + error.message });
  }
};

export const getTodoById = async (req, res) => {
  try {
    const todo = await TodoModel.getById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo item not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving todo: ' + error.message });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, category } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTodo = await TodoModel.create({
      title,
      description,
      status,
      priority,
      dueDate,
      category
    });

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating todo: ' + error.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, category } = req.body;
    
    // We could validate fields here if needed
    const updated = await TodoModel.update(req.params.id, {
      title,
      description,
      status,
      priority,
      dueDate,
      category
    });

    if (!updated) {
      return res.status(404).json({ error: 'Todo item not found or could not be updated' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating todo: ' + error.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const success = await TodoModel.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Todo item not found' });
    }
    res.json({ message: 'Todo item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting todo: ' + error.message });
  }
};
