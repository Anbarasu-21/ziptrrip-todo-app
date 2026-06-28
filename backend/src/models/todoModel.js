import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'todos.json');

// Helper to ensure data directory and file exist
async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      // File doesn't exist, create it with empty list
      await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Error ensuring data file exists:', error);
  }
}

class TodoModel {
  static async getAll() {
    await ensureDataFile();
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading todos file:', error);
      return [];
    }
  }

  static async getById(id) {
    const todos = await this.getAll();
    return todos.find(todo => todo.id === id) || null;
  }

  static async create(todoData) {
    await ensureDataFile();
    const todos = await this.getAll();

    const newTodo = {
      id: uuidv4(),
      title: todoData.title || 'Untitled Todo',
      description: todoData.description || '',
      status: todoData.status || 'pending', // pending, in-progress, completed
      priority: todoData.priority || 'medium', // low, medium, high
      dueDate: todoData.dueDate || null,
      category: todoData.category || 'General',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    todos.push(newTodo);
    await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
    return newTodo;
  }

  static async update(id, updateData) {
    await ensureDataFile();
    const todos = await this.getAll();
    const index = todos.findIndex(todo => todo.id === id);

    if (index === -1) return null;

    const updatedTodo = {
      ...todos[index],
      ...updateData,
      id: todos[index].id, // Ensure ID cannot be changed
      createdAt: todos[index].createdAt, // Keep original creation date
      updatedAt: new Date().toISOString()
    };

    todos[index] = updatedTodo;
    await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
    return updatedTodo;
  }

  static async delete(id) {
    await ensureDataFile();
    const todos = await this.getAll();
    const index = todos.findIndex(todo => todo.id === id);

    if (index === -1) return false;

    todos.splice(index, 1);
    await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
    return true;
  }
}

export default TodoModel;
