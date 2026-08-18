'use client';

import { useEffect, useState } from 'react';
import { todoAPI } from '@/lib/api';
import { CheckCircle, Circle } from 'lucide-react';

interface Todo {
  id: string;
  title: string;
  description?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export default function ChildTodoPanel({ profileId }: { profileId: string }) {
  const [todos, setTodos] = useState<Todo[]>([]);
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

  const handleToggleStatus = async (todo: Todo) => {
    const newStatus = todo.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';
    try {
      await todoAPI.update(todo.id, { status: newStatus });
      fetchTodos();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading your tasks...</div>;
  }

  const completedCount = todos.filter((t) => t.status === 'COMPLETED').length;
  const progressPercentage = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">My Daily Tasks</h2>

      {todos.length > 0 && (
        <div className="card">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-bold text-primary">{completedCount}/{todos.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {todos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tasks yet. Parents will assign tasks to you!
        </div>
      ) : (
        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`card flex items-start gap-3 cursor-pointer hover:shadow-lg transition-all ${
                todo.status === 'COMPLETED' ? 'bg-green-50' : ''
              }`}
              onClick={() => handleToggleStatus(todo)}
            >
              <div className="mt-1 text-primary flex-shrink-0 text-2xl">
                {todo.status === 'COMPLETED' ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`font-medium text-lg ${
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
