import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CalendarComponent } from "@schedule-x/angular";

import { createCalendar, viewWeek, createViewMonthGrid } from "@schedule-x/calendar";
import '@schedule-x/theme-default/dist/calendar.css';

import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";

import { SchoolEvent, DifficultyType } from './models/event.model';

type FilterType = DifficultyType;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CalendarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'connectclass';

  // FILTROS
  filters: Record<FilterType, boolean> = {
    other: true,
    basic: true,
    relative: true,
    important: true,
  };

  // EVENTOS TIPADOS
  rawEvents: SchoolEvent[] = [
    {
      id: '1',
      title: 'Portuguese — Class about essay writing',
      start: '2025-11-17 07:30',
      end: '2025-11-17 10:30',
      difficulty: 'basic',
    },
    {
      id: '2',
      title: 'Break — Teachers break',
      start: '2025-11-22 09:30',
      end: '2025-11-22 10:00',
      difficulty: 'important',
    },
    {
      id: '3',
      title: 'History — Group Work',
      start: '2025-11-22 11:00',
      end: '2025-11-22 11:30',
      difficulty: 'relative',
    },
  ];

  get filteredEvents(): any[] {
    return this.rawEvents
      .filter(event => this.filters[event.difficulty])
      .map(event => ({
        ...event,
        color: this.getColorByDifficulty(event.difficulty)
      }));
  }

  toggleFilter(type: DifficultyType) {
    this.filters[type] = !this.filters[type];
    this.calendarApp.events.set(this.filteredEvents);
  }

  getEventTextColor(type: DifficultyType): string {
    switch (type) {
      case 'important':
        return '#7a1e1e';
      case 'relative':
        return '#7a6b1a';
      case 'basic':
        return '#1a3d7a';
      default:
        return '#3a3a3a';
    }
  }

  private getColorByDifficulty(type: DifficultyType): string {
    switch (type) {
      case 'basic':
        return 'rgba(172, 231, 255, 0.75)';
      case 'relative':
        return 'rgba(255, 245, 186, 0.75)';
      case 'important':
        return 'rgba(255, 190, 188, 0.75)';
      case 'other':
      default:
        return 'rgba(158, 158, 158, 0.45)';
    }
  }

  // CALENDÁRIO PRINCIPAL
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

    events: this.filteredEvents,

    views: [viewWeek],

    plugins: [
      createEventModalPlugin(),
      createDragAndDropPlugin(),
    ],
  });

  // MINI CALENDÁRIO DA SIDEBAR — agora com selectedDate ✔
  miniCalendar = createCalendar({
    locale: 'pt-BR',
    isDark: true,

    views: [createViewMonthGrid()],

    selectedDate: new Date().toISOString().slice(0, 10) , 

    events: [],
  });

}
