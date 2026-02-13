# Specification

## Summary
**Goal:** Add a new “Daily Utilities” hub entry and a dedicated Daily Utilities page that provides multiple time/day utility tools in one place.

**Planned changes:**
- Add a new “Daily Utilities” card to the main hub page that navigates via the existing onNavigate(Page) mechanism.
- Extend the app’s Page union and route/render switch to support a new `"daily"` page and ensure back navigation returns to the hub.
- Create a new Daily Utilities page under `frontend/src/pages` with a responsive tabbed interface (wrapping tab header) exposing: Countdown timer, Stopwatch, Pomodoro timer, Alarm, Time zone difference checker, Simple calendar printer, and Shift / rota hours calculator.
- Implement all tool logic on the frontend only, including shared reusable time/timer/calendar/shift calculation utilities in a lib module; add Clear/Reset actions where applicable, Copy actions for text outputs using the existing clipboard helper/toast, and Print via the browser print flow for the calendar.

**User-visible outcome:** Users can open a new “Daily Utilities” section from the hub and use seven utilities (timers, alarm, time zone comparison, calendar printing, and shift hours calculation) within a single tabbed page, with clear/reset and copy/print actions where relevant.
