import { Injectable, signal, effect } from '@angular/core';

// Define the Task interface with modern TypeScript syntax
export interface Task {
  id?: number; // Optional ID for new tasks
  title: string; // Task title
  completed: boolean; // Task completion status
}

@Injectable({
  providedIn: 'root', // Provides the service globally in the app
})
export class TaskService {
  private readonly apiUrl = 'http://localhost:3000/api/tasks'; // Immutable API endpoint

  // Signals for reactive state management
  private tasks = signal<Task[]>([]); // Holds the list of tasks
  private error = signal<string | null>(null); // Holds error messages if any

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

  getError() {
    return this.error.asReadonly();
  }

  // Fetch tasks from the API using modern async/await with HttpClient
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
}
