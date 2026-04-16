import { Component, OnInit, Input, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../shared/data.service';
import { Card } from '../models/card-info';
import { Task } from '../models/task-info';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() item!: Card;
  tasks: Task[] = [];
  showModal = false;
  taskToDelete: Task | null = null;
  newtaskdesc = '';

  editingTitle = false;
  editTitle = '';
  editingDesc = false;
  editDesc = '';

  private dataService = inject(DataService);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showModal) {
      this.hideModal();
    }
  }

  ngOnInit(): void {
    this.dataService.getTasksByCardId(this.item.$key!)
      .subscribe(data => {
        this.tasks = data;
      });
  }

  startEditTitle(): void {
    this.editTitle = this.item.name ?? '';
    this.editingTitle = true;
  }

  saveTitle(): void {
    if (!this.editingTitle) return;
    this.editingTitle = false;
    const trimmed = this.editTitle.trim();
    if (trimmed && trimmed !== this.item.name) {
      this.item.name = trimmed;
      this.dataService.updateCard(this.item.$key!, this.item);
    }
  }

  cancelEditTitle(): void {
    this.editingTitle = false;
  }

  startEditDesc(): void {
    this.editDesc = this.item.description ?? '';
    this.editingDesc = true;
  }

  saveDesc(): void {
    if (!this.editingDesc) return;
    this.editingDesc = false;
    const trimmed = this.editDesc.trim();
    if (trimmed !== this.item.description) {
      this.item.description = trimmed;
      this.dataService.updateCard(this.item.$key!, this.item);
    }
  }

  cancelEditDesc(): void {
    this.editingDesc = false;
  }

  addNewTask(): void {
    const newTask = new Task();
    newTask.cardId = this.item.$key!;
    newTask.description = this.newtaskdesc;
    newTask.isCompleted = false;
    newTask.order = 0;
    newTask.created_at = new Date().toString();
    this.dataService.addTask(newTask)
      .then(() => {
        this.newtaskdesc = '';
      });
  }

  deleteTask(task: Task): void {
    this.taskToDelete = task;
    this.showModal = true;
  }

  hideModal(): void {
    this.showModal = false;
    this.taskToDelete = null;
  }

  confirmDeleteTask(): void {
    if (this.taskToDelete?.$key) {
      this.dataService.deleteTask(this.taskToDelete.$key);
    }
    this.hideModal();
  }

  changeTaskCompleted(task: Task): void {
    this.dataService.updateTask(task.$key!, task);
  }

  clickCarret(): void {
    this.item.isExpanded = !this.item.isExpanded;
    this.dataService.updateCard(this.item.$key!, this.item);
  }
}
