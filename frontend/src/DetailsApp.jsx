import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import { todoService } from './services/api';
import { 
  ArrowLeft, Edit, Save, Trash2, Calendar, Tag, AlertTriangle, 
  CheckCircle2, Clock, Check, X, Star, FileText 
} from 'lucide-react';

const DetailsApp = () => {
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Form edit states
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
  const [editStatus, setEditStatus] = useState('pending');
  const [editCategory, setEditCategory] = useState('General');
  const [editDueDate, setEditDueDate] = useState('');

  // Extract ID from query parameters (?id=...)
  const queryParams = new URLSearchParams(window.location.search);
  const todoId = queryParams.get('id');

  useEffect(() => {
    const fetchTodoDetails = async () => {
      if (!todoId) {
        setError('Missing Todo ID query parameter.');
        setLoading(false);
        return;
      }
      try {
        const data = await todoService.getById(todoId);
        setTodo(data);
        
        // Initialize form fields
        setEditTitle(data.title);
        setEditDescription(data.description || '');
        setEditPriority(data.priority);
        setEditStatus(data.status);
        setEditCategory(data.category);
        setEditDueDate(data.dueDate ? data.dueDate.split('T')[0] : '');
      } catch (err) {
        console.error(err);
        setError('Todo item not found or could not be loaded from backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchTodoDetails();
  }, [todoId]);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing && todo) {
      // Reset form states to current todo state
      setEditTitle(todo.title);
      setEditDescription(todo.description || '');
      setEditPriority(todo.priority);
      setEditStatus(todo.status);
      setEditCategory(todo.category);
      setEditDueDate(todo.dueDate ? todo.dueDate.split('T')[0] : '');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      alert('Title is required');
      return;
    }
    setSaveLoading(true);
    try {
      const updatedTodo = await todoService.update(todoId, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
        status: editStatus,
        category: editCategory,
        dueDate: editDueDate || null
      });
      setTodo(updatedTodo);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this task?')) return;
    try {
      await todoService.delete(todoId);
      window.location.href = '/'; // Go back to dashboard list
    } catch (err) {
      console.error(err);
      alert('Failed to delete task.');
    }
  };

  // Helper date formatter
  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const options = { 
      month: 'short', day: 'numeric', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    };
    return new Date(dateStr).toLocaleString(undefined, options);
  };

  return (
    <Layout>
      {/* Back Button navigation */}
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <a href="/" className="btn btn-secondary" style={{ display: 'inline-flex', gap: 'var(--space-sm)' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </a>
      </div>

      {loading ? (
        <div style={{ padding: 'var(--space-xl) 0', textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading task details...</p>
        </div>
      ) : error ? (
        <div className="card" style={{ 
          borderLeft: '4px solid var(--accent)', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: 'var(--space-xl)',
          gap: 'var(--space-sm)'
        }}>
          <AlertTriangle size={48} style={{ color: 'var(--accent)' }} />
          <h3 style={{ fontSize: '1.25rem' }}>Unable to load task</h3>
          <p style={{ color: 'var(--text-muted)' }}>{error}</p>
          <a href="/" className="btn btn-primary" style={{ marginTop: 'var(--space-sm)' }}>
            Go to Main Dashboard
          </a>
        </div>
      ) : (
        <div className="grid-sidebar" style={{ gridTemplateColumns: '1fr 380px' }}>
          {/* Main Details Panel / Edit Form */}
          <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            
            {isEditing ? (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-sm)' }}>
                  <h2 style={{ fontSize: '1.4rem' }}>Edit Task</h2>
                  <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                    <button type="submit" className="btn btn-primary" disabled={saveLoading} style={{ padding: '8px 14px' }}>
                      <Save size={16} style={{ marginRight: '4px' }} /> Save
                    </button>
                    <button type="button" onClick={handleToggleEdit} className="btn btn-secondary" style={{ padding: '8px 14px' }}>
                      <X size={16} style={{ marginRight: '4px' }} /> Cancel
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    className="form-control"
                    rows="6"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    style={{ resize: 'vertical' }}
                  ></textarea>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      className="form-control"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      className="form-control"
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      className="form-control"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
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

                  <div className="form-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                      type="date"
                      id="dueDate"
                      className="form-control"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                    />
                  </div>
                </div>
              </form>
            ) : (
              <>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: 'var(--space-md)',
                  flexWrap: 'wrap',
                  gap: 'var(--space-sm)'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                      <span className={`badge badge-priority-${todo.priority}`}>
                        <Star size={10} style={{ marginRight: '2px' }} /> {todo.priority} Priority
                      </span>
                      <span className={`badge badge-status-${todo.status}`}>
                        {todo.status.replace('-', ' ')}
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                      {todo.title}
                    </h2>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                    <button onClick={handleToggleEdit} className="btn btn-secondary">
                      <Edit size={16} /> Edit Task
                    </button>
                    <button onClick={handleDelete} className="btn btn-danger">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', color: 'var(--text-muted)' }}>
                    <FileText size={16} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</span>
                  </div>
                  <div style={{ 
                    whiteSpace: 'pre-wrap', 
                    color: 'var(--text-secondary)', 
                    background: 'var(--bg-app)', 
                    padding: 'var(--space-md)', 
                    borderRadius: 'var(--radius-md)', 
                    lineHeight: '1.6',
                    fontSize: '0.975rem',
                    border: '1px solid var(--border-color)'
                  }}>
                    {todo.description || <em style={{ color: 'var(--text-muted)' }}>No description provided for this task. Click Edit to add details.</em>}
                  </div>
                </div>
              </>
            )}
          </section>

          {/* Sidebar Metadata Display Panel */}
          <aside className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-sm)' }}>
              Task Metadata
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <div style={{ background: 'var(--bg-input)', padding: '10px', borderRadius: 'var(--radius-sm)', color: 'var(--primary)' }}>
                  <Tag size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CATEGORY</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{todo.category}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <div style={{ background: 'var(--bg-input)', padding: '10px', borderRadius: 'var(--radius-sm)', color: 'var(--info)' }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>DUE DATE</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'No due date'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-md)' }}>
                <div style={{ background: 'var(--bg-input)', padding: '10px', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}>
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CREATED AT</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{formatDateTime(todo.createdAt)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <div style={{ background: 'var(--bg-input)', padding: '10px', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}>
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>LAST UPDATED</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{formatDateTime(todo.updatedAt)}</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </Layout>
  );
};

export default DetailsApp;
