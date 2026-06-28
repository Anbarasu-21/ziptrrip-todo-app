import React from 'react';
import { Calendar, Tag, Trash2, ArrowRight, CheckCircle2, Circle } from 'lucide-react';

const TodoCard = ({ todo, onToggleComplete, onDelete }) => {
  const { id, title, description, status, priority, dueDate, category } = todo;

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const isCompleted = status === 'completed';

  return (
    <div className={`card todo-card ${isCompleted ? 'completed-card' : ''}`} style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 'var(--space-md)',
      position: 'relative',
      opacity: isCompleted ? 0.75 : 1,
      transition: 'opacity var(--transition-fast), transform var(--transition-fast)'
    }}>
      <div className="todo-header" style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start' }}>
        <button
          onClick={() => onToggleComplete(id, status)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginTop: '3px',
            color: isCompleted ? 'var(--success)' : 'var(--text-muted)'
          }}
          title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
        >
          {isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
        </button>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '1.15rem',
            fontWeight: 600,
            textDecoration: isCompleted ? 'line-through' : 'none',
            color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
            transition: 'color var(--transition-fast)'
          }}>
            {title}
          </h3>
          {description && (
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              marginTop: '4px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="todo-footer" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--space-xs)',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--border-color)',
        paddingTop: 'var(--space-md)',
        marginTop: 'auto'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <span className={`badge badge-priority-${priority}`}>
            {priority}
          </span>
          <span className={`badge badge-status-${status}`}>
            {status.replace('-', ' ')}
          </span>
          <span className="badge badge-category">
            <Tag size={10} style={{ marginRight: '2px' }} />
            {category}
          </span>
          {dueDate && (
            <span className="badge" style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
              <Calendar size={10} style={{ marginRight: '2px' }} />
              {formatDate(dueDate)}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
          <a
            href={`/todo.html?id=${id}`}
            className="btn btn-secondary btn-icon"
            title="View details & edit"
            style={{ width: '32px', height: '32px' }}
          >
            <ArrowRight size={16} />
          </a>
          <button
            onClick={() => onDelete(id)}
            className="btn btn-danger btn-icon"
            title="Delete Todo"
            style={{ width: '32px', height: '32px' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
