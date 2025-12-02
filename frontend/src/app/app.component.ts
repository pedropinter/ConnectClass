import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CalendarComponent } from "@schedule-x/angular";
import { FormsModule } from '@angular/forms';
import { createCalendar, viewWeek, createViewMonthGrid,createViewWeek,createViewList } from "@schedule-x/calendar";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { SchoolEvent, DifficultyType } from './models/event.model';

type FilterType = DifficultyType;
type TimeFilter = 'today' | 'week' | 'all'; 
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
    difficulty: 'basic',
    location: '001',
  };
  
  tasks: SchoolEvent[] = [];

  rooms: { id: number, label: string, code: string }[] = []; 
  selectedRoomCode: string | null = null;

  async ngOnInit() {
    await this.loadRoomsFromDb();
  }

  async loadRoomsFromDb() {
    const res = await fetch("http://localhost:3000/rooms");
    const data = await res.json();

    this.rooms = data.map((r: any) => ({
      id: r.id,
      label: r.label,
      code: r.code
    }));

    if (this.rooms.length > 0) {
      this.selectedRoomCode = this.rooms[0].code;
      await this.loadTasksFromDb(this.selectedRoomCode);
    }
  }

  async loadTasksFromDb(roomCode: string) {
    const res = await fetch(`http://localhost:3000/events/${roomCode}`);
    const events = await res.json();

    this.tasks = events.map((e: any) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      start: e.start,
      end: e.end,
      difficulty: e.difficulty,
      location: e.location,
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

      if (this.miniCalendar?.events?.set) {
        this.miniCalendar.events.set(events);
      } else if (typeof (this.miniCalendar as any).setEvents === 'function') {
        (this.miniCalendar as any).setEvents(events);
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

    const room = this.rooms.find(r => r.code === this.selectedRoomCode);

    if (!room) {
      alert("Sala não encontrada. Selecione uma sala válida.");
      return;
    }

    const payload = {
      title: this.taskForm.title,
      description: this.taskForm.description,
      start: this.taskForm.start,
      end: this.taskForm.end,
      difficulty: this.taskForm.difficulty,
      location: this.taskForm.location,
      roomId: room.id 
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

    await this.loadTasksFromDb(this.selectedRoomCode!);
    this.closeTaskModal();
  }

  async deleteTask(id: number | null) {
    if (!id) return;
    if (!confirm("Deseja realmente excluir?")) return;

    await fetch(`http://localhost:3000/events/${id}`, {
      method: "DELETE"
    });

    await this.loadTasksFromDb(this.selectedRoomCode!);
    this.closeTaskModal();
  }

  onRoomChange() {
    this.loadTasksFromDb(this.selectedRoomCode!);
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
        difficulty: 'basic',
        location: '001',
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
        id: event.id!.toString(),
        title: event.title,
        description: event.description,
        start: this.formatDateForCalendar(event.start),
        end: this.formatDateForCalendar(event.end),
        color: this.getColorByDifficulty(event.difficulty),
        difficulty: event.difficulty 
      }));
  }
  activeTimeFilter: TimeFilter = 'today';
  setTimeFilter(filter: TimeFilter) {
    this.activeTimeFilter = filter;
  }
  private isToday(dateString: string): boolean {
    const today = new Date();
    const taskDate = new Date(dateString);
    return today.toDateString() === taskDate.toDateString();
  }
  private isThisWeek(dateString: string): boolean {
    const today = new Date();
    const taskDate = new Date(dateString);
    
    const endOfWeek = new Date();
    endOfWeek.setDate(today.getDate() + 7);

    return taskDate >= today && taskDate <= endOfWeek;
  }
  searchTerm: string = '';
  get filteredTaskList(): SchoolEvent[] {
    const term = this.searchTerm.toLowerCase().trim();

    return this.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(term);
      
      const matchesFilter = this.filters[task.difficulty];

      let matchesTime: boolean = true;

      if (this.activeTimeFilter === 'today') {
        matchesTime = this.isToday(task.end);
      } else if (this.activeTimeFilter === 'week') {
        matchesTime = this.isThisWeek(task.end);
      }

      return matchesSearch && matchesFilter && matchesTime;
    });
  }

 private formatDateForCalendar(dateTime: string): string {
       const d = new Date(dateTime);

       const year = d.getFullYear();
       const month = String(d.getMonth()+1).padStart(2,'0');
       const day = String(d.getDate()).padStart(2,'0');

       const hours = String(d.getHours()).padStart(2,'0');
       const minutes = String(d.getMinutes()).padStart(2,'0');

       return `${year}-${month}-${day} ${hours}:${minutes}`

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
      end: '19:00'
    },
    weekOptions: {
      gridHeight: 500,
      nDays: 7,
      eventWidth: 100,
      timeAxisFormatOptions: { hour: '2-digit', minute: '2-digit' },
      eventOverlap: true
    },
    events: [],
    views: [createViewWeek() ,createViewList(),createViewMonthGrid()],
    plugins: [createEventModalPlugin(), createDragAndDropPlugin()],
  });

  miniCalendar = createCalendar({
    locale: 'pt-BR',
    isDark: true,
    views: [createViewMonthGrid()],
    events: [],
  });
}
