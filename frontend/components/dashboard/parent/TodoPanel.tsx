'use client';

import { useEffect, useState } from 'react';
import { todoAPI } from '@/lib/api';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

interface Todo {
  id: string;
  title: string;
  description?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
}

interface TodoPanelProps {
  profileId: string;
}

export default function TodoPanel({ profileId }: TodoPanelProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTodo, setNewTodo] = useState({ title: '', description: '', priority: 'MEDIUM' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, [profileId]);

  const fetchTodos = async () => {
    try {
      const response = await todoAPI.getAll(profileId);
      setTodos(response.data.todos);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await todoAPI.create({
        ...newTodo,
        profileId,
      });
      setNewTodo({ title: '', description: '', priority: 'MEDIUM' });
      setShowForm(false);
      fetchTodos();
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const handleToggleStatus = async (todo: Todo) => {
    const newStatus = todo.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';
    try {
      await todoAPI.update(todo.id, { status: newStatus });
      fetchTodos();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await todoAPI.delete(id);
      fetchTodos();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const priorityColor = {
    LOW: 'text-green-600 bg-green-50',
    MEDIUM: 'text-yellow-600 bg-yellow-50',
    HIGH: 'text-red-600 bg-red-50',
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading todos...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">StepOut - Todo List</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Todo
        </button>
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleAddTodo} className="space-y-3">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              className="input"
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              className="input"
              rows={2}
            />
            <select
              value={newTodo.priority}
              onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
              className="input"
            >
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
            </select>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 btn-primary">
                Add Todo
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {todos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No todos yet. Create one to get started!
        </div>
      ) : (
        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`card flex items-start gap-3 ${
                todo.status === 'COMPLETED' ? 'bg-gray-50' : ''
              }`}
            >
              <button
                onClick={() => handleToggleStatus(todo)}
                className="mt-1 text-primary hover:text-primary/80 flex-shrink-0"
              >
                {todo.status === 'COMPLETED' ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    todo.status === 'COMPLETED'
                      ? 'line-through text-gray-500'
                      : 'text-gray-800'
                  }`}
                >
                  {todo.title}
                </p>
                {todo.description && (
                  <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
                )}
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColor[todo.priority]}`}>
                    {todo.priority}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700 flex-shrink-0 mt-1"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
