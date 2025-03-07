import { Injectable, signal, effect, computed } from '@angular/core';

export interface Task {
  id?: number; // Optional ID for new tasks
  title: string; // Task title
  completed: boolean; // Task completion status
}

export type TaskFilter = 'all' | 'completed' | 'pending';

@Injectable({
  providedIn: 'root', // Provides the service globally in the app
})
export class TaskService {
  private readonly apiUrl = 'http://localhost:3000/api/tasks'; // Immutable API endpoint

  // Signals for reactive state management
  private tasks = signal<Task[]>([]);
  private error = signal<string | null>(null);
  private filter = signal<TaskFilter>('all'); // Default filter

  // Effect to log state changes (optional, for debugging)
  constructor() {
    effect(() => {
      console.log('Tasks state updated:', this.tasks());
    });
  }

  // Expose readonly signals for components
  getTasks() {
    return this.tasks.asReadonly();
  }

  getFilteredTasks() {
    return computed(() => {
      const tasks = this.tasks();
      const currentFilter = this.filter();
      switch (currentFilter) {
        case 'completed':
          return tasks.filter((task) => task.completed);
        case 'pending':
          return tasks.filter((task) => !task.completed);
        default:
          return tasks;
      }
    });
  }

  getError() {
    return this.error.asReadonly();
  }

  getFilter() {
    return this.filter.asReadonly();
  }

  setFilter(filter: TaskFilter) {
    this.filter.set(filter);
  }

  // Fetch tasks from the API using modern async/await with fetch
  async loadTasks() {
    try {
      const tasks = await fetch(this.apiUrl).then((res) => res.json());
      this.tasks.set(tasks); // Update tasks signal
      this.error.set(null); // Clear any previous errors
    } catch (err) {
      this.error.set(
        `Failed to load tasks: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    }
  }

  // Add a new task to the API using modern async/await
  async addTask(task: Task) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
      }).then((res) => res.json());
      this.tasks.update((tasks) => [...tasks, response]); // Update tasks signal with new task
      this.error.set(null); // Clear any previous errors
    } catch (err) {
      this.error.set(
        `Failed to add task: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    }
  }

  // Delete a task from the API
  async deleteTask(id: number) {
    try {
      await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      this.tasks.update((tasks) => tasks.filter((task) => task.id !== id)); // Update tasks signal
      this.error.set(null); // Clear any previous errors
    } catch (err) {
      this.error.set(
        `Failed to delete task: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    }
  }

  // Update a task's status (e.g., toggle completed)
  async updateTask(id: number, updates: Partial<Task>) {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: updates }),
      }).then((res) => res.json());
      this.tasks.update((tasks) =>
        tasks.map((task) => (task.id === id ? { ...task, ...response } : task))
      ); // Update tasks signal
      this.error.set(null); // Clear any previous errors
    } catch (err) {
      this.error.set(
        `Failed to update task: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    }
  }
}
