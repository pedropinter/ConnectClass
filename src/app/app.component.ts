import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CalendarComponent } from "@schedule-x/angular";
import { FormsModule } from '@angular/forms';
import { createCalendar, viewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import '@schedule-x/theme-default/dist/calendar.css';
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { SchoolEvent, DifficultyType } from './models/event.model';

type FilterType = DifficultyType;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CalendarComponent, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  taskModalOpen = false;
  editingTask = false;

  taskForm: SchoolEvent = {
    id: null,
    title: '',
    description: '',
    start: '',
    end: '',
    difficulty: 'basic'
  };

  tasks: SchoolEvent[] = [];

  rooms: { id: number, label: string }[] = [];
  selectedRoom: number | null = null;

  async ngOnInit() {
    await this.loadRoomsFromDb();
  }

  async loadRoomsFromDb() {
    const res = await fetch("http://localhost:3000/rooms");
    const data = await res.json();

    this.rooms = data.map((r: any) => ({
      id: r.id,
      label: r.name
    }));

    if (this.rooms.length > 0) {
      this.selectedRoom = this.rooms[0].id;
      await this.loadTasksFromDb(this.selectedRoom);
    }
  }

  async loadTasksFromDb(roomId: number) {
    const res = await fetch(`http://localhost:3000/events/room/${roomId}`);
    const events = await res.json();

    this.tasks = events.map((e: any) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      start: e.start.replace(" ", "T"),
      end: e.end.replace(" ", "T"),
      difficulty: e.difficulty
    }));

    this.updateCalendar();
  }

  updateCalendar() {
    try {
      const events = this.filteredEvents;

      if (this.calendarApp?.events?.set) {
        this.calendarApp.events.set(events);
      } else if (typeof (this.calendarApp as any).setEvents === 'function') {
        (this.calendarApp as any).setEvents(events);
      }
    } catch (err) {
      console.error('Erro ao atualizar calendário:', err);
    }
  }

  async saveTask() {
    if (!this.taskForm.title || !this.taskForm.start || !this.taskForm.end) {
      alert("Preencha título, início e fim");
      return;
    }

    const payload = {
      title: this.taskForm.title,
      description: this.taskForm.description,
      start: this.taskForm.start,
      end: this.taskForm.end,
      difficulty: this.taskForm.difficulty,
      roomId: this.selectedRoom
    };

    if (!this.taskForm.id) {
      await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch(`http://localhost:3000/events/${this.taskForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    await this.loadTasksFromDb(this.selectedRoom!);
    this.closeTaskModal();
  }

  async deleteTask(id: number | null) {
    if (!id) return;

    if (!confirm("Deseja realmente excluir?")) return;

    await fetch(`http://localhost:3000/events/${id}`, {
      method: "DELETE"
    });

    await this.loadTasksFromDb(this.selectedRoom!);
    this.closeTaskModal();
  }

  onRoomChange() {
    this.loadTasksFromDb(this.selectedRoom!);
    this.updateCalendar();
  }

  openTaskModal(task: SchoolEvent | null = null) {
    if (task) {
      this.taskForm = { ...task };
      this.editingTask = true;
    } else {
      this.taskForm = {
        id: null,
        title: '',
        description: '',
        start: '',
        end: '',
        difficulty: 'basic'
      };
      this.editingTask = false;
    }

    this.taskModalOpen = true;
  }

  closeTaskModal() {
    this.taskModalOpen = false;
    this.editingTask = false;
  }

  title = 'connectclass';

  filters: Record<FilterType, boolean> = {
    other: true,
    basic: true,
    relative: true,
    important: true,
  };

  get filteredEvents(): any[] {
    return this.tasks
      .filter(event => this.filters[event.difficulty])
      .map(event => ({
        ...event,
        start: event.start.replace(' ', 'T'),
        end: event.end.replace(' ', 'T'),
        color: this.getColorByDifficulty(event.difficulty)
      }));
  }

  toggleFilter(type: DifficultyType) {
    this.filters[type] = !this.filters[type];
    this.updateCalendar();
  }

  getEventTextColor(type: DifficultyType): string {
    switch (type) {
      case 'important': return '#7a1e1e';
      case 'relative': return '#7a6b1a';
      case 'basic': return '#1a3d7a';
      default: return '#3a3a3a';
    }
  }

  private getColorByDifficulty(type: DifficultyType): string {
    switch (type) {
      case 'basic': return 'rgba(172, 231, 255, 0.75)';
      case 'relative': return 'rgba(255, 245, 186, 0.75)';
      case 'important': return 'rgba(255, 190, 188, 0.75)';
      case 'other':
      default: return 'rgba(158, 158, 158, 0.45)';
    }
  }

  calendarApp = createCalendar({
    locale: 'pt-BR',
    firstDayOfWeek: 0,
    isDark: false,
    dayBoundaries: {
      start: '06:00',
      end: '13:00'
    },
    weekOptions: {
      gridHeight: 500,
      nDays: 7,
      eventWidth: 100,
      timeAxisFormatOptions: { hour: '2-digit', minute: '2-digit' },
      eventOverlap: true
    },
    events: [],
    views: [viewWeek],
    plugins: [createEventModalPlugin(), createDragAndDropPlugin()],
  });

  miniCalendar = createCalendar({
    locale: 'pt-BR',
    isDark: true,
    views: [createViewMonthGrid()],
    events: [],
  });
}
