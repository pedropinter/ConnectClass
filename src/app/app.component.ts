import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalendarComponent } from "@schedule-x/angular";
import { createCalendar, viewWeek,createViewWeek  } from "@schedule-x/calendar";
import '@schedule-x/theme-default/dist/calendar.css';
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CalendarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']   
})
export class AppComponent {
  title = 'angular-example';
  calendarApp = createCalendar({
    events: [
      {
        id: '1',
        title: 'Portugues',
        start: '2025-11-11 01:00',
        end: '2025-11-11 02:00',
      },
    ],
    views: [viewWeek,createViewWeek()],
    plugins: [createEventModalPlugin(), createDragAndDropPlugin()]
  })
}