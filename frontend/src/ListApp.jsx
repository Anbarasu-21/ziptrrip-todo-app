import React, { useEffect, useState, useCallback } from 'react';
import Layout from './components/Layout';
import TodoForm from './components/TodoForm';
import TodoCard from './components/TodoCard';
import { todoService } from './services/api';
import { Search, SlidersHorizontal, AlertCircle, Inbox, RefreshCw } from 'lucide-react';

const ListApp = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  // Filtering States
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  // Debounced search could be implemented, but simple triggers are fine or direct trigger
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await todoService.getAll({
        search,
        status,
        priority,
        category,
        sortBy
      });
      setTodos(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch tasks. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, category, sortBy]);

  useEffect(() => {
    // Initial fetch and fetch on filter change
    const timer = setTimeout(() => {
      fetchTodos();
    }, 300); // Simple debounce for search input

    return () => clearTimeout(timer);
  }, [fetchTodos]);

  const handleCreateTodo = async (todoData) => {
    setFormLoading(true);
    setError('');
    try {
      await todoService.create(todoData);
      fetchTodos(); // Refresh list
    } catch (err) {
      console.error(err);
      setError('Failed to create task. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      // Optimistic update
      setTodos(prev => prev.map(t => t.id === id ? { ...t, status: nextStatus } : t));
      await todoService.update(id, { status: nextStatus });
    } catch (err) {
      console.error(err);
      setError('Failed to update task status.');
      fetchTodos(); // Revert on error
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      // Optimistic update
      setTodos(prev => prev.filter(t => t.id !== id));
      await todoService.delete(id);
    } catch (err) {
      console.error(err);
      setError('Failed to delete task.');
      fetchTodos(); // Revert on error
    }
  };

  return (
    <Layout>
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Workspace Dashboard
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage, track, and complete your tasks efficiently.</p>
      </div>

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          background: 'rgba(244, 63, 94, 0.1)',
          color: 'var(--accent)',
          padding: 'var(--space-md)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-lg)',
          border: '1px solid rgba(244, 63, 94, 0.2)'
        }}>
          <AlertCircle size={20} />
          <div style={{ flex: 1 }}>{error}</div>
          <button onClick={fetchTodos} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            <RefreshCw size={14} style={{ marginRight: '4px' }} /> Retry
          </button>
        </div>
      )}

      <div className="grid-sidebar">
        {/* Sidebar Creation Form */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <TodoForm onSubmit={handleCreateTodo} loading={formLoading} />
        </aside>

        {/* Main List Area */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {/* Filter Bar Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', padding: 'var(--space-md)' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '40px' }}
              />
            </div>

            {/* Filter Controls Row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-sm)',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border-color)',
              paddingTop: 'var(--space-sm)'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)', alignItems: 'center' }}>
                <SlidersHorizontal size={14} style={{ color: 'var(--text-muted)', marginRight: '4px' }} />
                
                {/* Status selection */}
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-control"
                  style={{ width: 'auto', padding: '6px 10px', fontSize: '0.85rem' }}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                {/* Priority Selection */}
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="form-control"
                  style={{ width: 'auto', padding: '6px 10px', fontSize: '0.85rem' }}
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>

                {/* Category Selection */}
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-control"
                  style={{ width: 'auto', padding: '6px 10px', fontSize: '0.85rem' }}
                >
                  <option value="">All Categories</option>
                  <option value="General">General</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Finance">Finance</option>
                  <option value="Health">Health</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              {/* Sorting Selection */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-control"
                  style={{ width: 'auto', padding: '6px 10px', fontSize: '0.85rem' }}
                >
                  <option value="createdAt">Date Created</option>
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority weight</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cards List Grid */}
          {loading ? (
            <div style={{ padding: 'var(--space-xl) 0', textAlign: 'center' }}>
              <div className="loading-spinner"></div>
              <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>Syncing with backend workspace...</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="card empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-xl)' }}>
              <Inbox size={48} />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginTop: 'var(--space-sm)' }}>No Tasks Found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '320px', marginTop: 'var(--space-xs)' }}>
                Create a task on the sidebar or change your search/filter parameters to find other items.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--space-md)'
            }}>
              {todos.map(todo => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default ListApp;
