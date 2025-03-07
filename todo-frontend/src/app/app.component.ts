import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskService, Task } from './services/task.service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'todo-frontend';

  taskService = inject(TaskService);

  // Access readonly signals from TaskService
  tasks = this.taskService.getTasks();
  error = this.taskService.getError();

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
}
