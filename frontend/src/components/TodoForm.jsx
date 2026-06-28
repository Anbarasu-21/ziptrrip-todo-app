import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';

const TodoForm = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate || null,
      status: 'pending' // Default when creating
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('General');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xs)' }}>Create New Task</h2>
      
      {error && (
        <div style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600, background: 'rgba(244, 63, 94, 0.1)', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title">Task Title *</label>
        <input
          type="text"
          id="title"
          className="form-control"
          placeholder="e.g. Design Landing Page"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          className="form-control"
          placeholder="Add more details about this task..."
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ resize: 'vertical' }}
        ></textarea>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            className="form-control"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="General">General</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Shopping">Shopping</option>
            <option value="Finance">Finance</option>
            <option value="Health">Health</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
          type="date"
          id="dueDate"
          className="form-control"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-sm)' }} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="loading-spinner" style={{ width: '18px', height: '18px', margin: '0' }} />
            Creating...
          </>
        ) : (
          <>
            <PlusCircle size={18} />
            Add Task
          </>
        )}
      </button>
    </form>
  );
};

export default TodoForm;
