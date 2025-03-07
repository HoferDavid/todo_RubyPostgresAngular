import { Component, OnInit, inject, signal } from '@angular/core';
import { TaskService, Task, TaskFilter } from './services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,              // Enable standalone component
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // Inject TaskService using the new inject() function
  private taskService = inject(TaskService);

  // Access readonly signals from TaskService
  tasks = this.taskService.getFilteredTasks();
  error = this.taskService.getError();
  filter = this.taskService.getFilter();

  // Signal for the new task input
  newTaskTitle = signal('');

  ngOnInit() {
    this.taskService.loadTasks(); // Load initial tasks
  }

  // Add a new task
  addTask() {
    const title = this.newTaskTitle();
    if (title.trim()) {
      const newTask: Task = { title, completed: false };
      this.taskService.addTask(newTask);
      this.newTaskTitle.set(''); // Clear input
    }
  }

  // Delete a task, with type safety for id
  deleteTask(id: number | undefined) {
    if (id !== undefined) {
      this.taskService.deleteTask(id);
    }
  }

  // Toggle the completed status of a task
  toggleCompleted(id: number | undefined, completed: boolean) {
    if (id !== undefined) {
      this.taskService.updateTask(id, { completed: !completed });
    }
  }

  // Set the filter
  setFilter(filter: TaskFilter) {
    this.taskService.setFilter(filter);
  }
}