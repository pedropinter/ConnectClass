import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalendarComponent } from "@schedule-x/angular";
import { createCalendar, viewWeek } from "@schedule-x/calendar";
import '@schedule-x/theme-default/dist/calendar.css';
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";

type FilterType = 'other' | 'basic' | 'relative' | 'important';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CalendarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'connectclass';

  filters: Record<FilterType, boolean> = {
    other: true,
    basic: true,
    relative: true,
    important: true,
  };

  toggleFilter(type: FilterType) {
    this.filters[type] = !this.filters[type];
    console.log('Filtros atualizados:', this.filters);
  }

  calendarApp = createCalendar({
    locale: 'pt-BR',
    firstDayOfWeek: 0, // domingo
    isDark: false,

    dayBoundaries: {
      start: '06:00',
      end: '13:00'
    },

    weekOptions: {
      gridHeight: 500,  
      nDays: 7,               // Seg - Sáb
      eventWidth: 100,
      timeAxisFormatOptions: { hour: '2-digit', minute: '2-digit' },
      eventOverlap: true
    },

    views: [viewWeek],
    isResponsive: true,

    events: [
      {
        id: '1',
        title: 'Portuguese — Class about essay writing',
        start: '2025-11-17 07:30',
        end: '2025-11-17 10:30',
        color: '#6b5bd6'
      },
      {
        id: '2',
        title: 'Break — Teachers break',
        start: '2025-11-22 09:30',
        end: '2025-11-22 10:00',
        color: '#c59bff'
      },
      {
        id: '3',
        title: 'History — Group Work',
        start: '2025-11-22 11:00',
        end: '2025-11-22 11:30',
        color: '#ff8a00'
      },
    ],

    plugins: [
      createEventModalPlugin(),
      createDragAndDropPlugin()
    ],
  });
}
