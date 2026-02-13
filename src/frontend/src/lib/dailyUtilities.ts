// Time zone list
export const TIME_ZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Mexico_City',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Rome',
  'Europe/Madrid',
  'Europe/Moscow',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Asia/Singapore',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Pacific/Auckland',
];

export type PomodoroPhase = 'work' | 'break';

// Format duration in milliseconds to HH:MM:SS
export function formatDuration(ms: number): string {
  if (ms <= 0) return '00:00:00';
  
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Format stopwatch elapsed time in HH:MM:SS.mm
export function formatStopwatch(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
}

// Calculate countdown remaining time
export function calculateCountdown(targetDateTime: string): number {
  const target = new Date(targetDateTime).getTime();
  const now = Date.now();
  return Math.max(0, target - now);
}

// Calculate pomodoro state
export function calculatePomodoroState(
  startTime: number,
  workMinutes: number,
  breakMinutes: number,
  currentPhase: PomodoroPhase
): { phase: PomodoroPhase; remaining: number } {
  const elapsed = Date.now() - startTime;
  const phaseDuration = currentPhase === 'work' ? workMinutes * 60 * 1000 : breakMinutes * 60 * 1000;
  const remaining = Math.max(0, phaseDuration - elapsed);
  
  return {
    phase: currentPhase,
    remaining,
  };
}

// Check if alarm should trigger
export function checkAlarmTrigger(time: string, date?: string): boolean {
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  
  if (date) {
    const targetDate = new Date(date);
    if (
      targetDate.getFullYear() === now.getFullYear() &&
      targetDate.getMonth() === now.getMonth() &&
      targetDate.getDate() === now.getDate() &&
      now.getHours() === hours &&
      now.getMinutes() === minutes &&
      now.getSeconds() === 0
    ) {
      return true;
    }
  } else {
    // Today's alarm
    if (now.getHours() === hours && now.getMinutes() === minutes && now.getSeconds() === 0) {
      return true;
    }
  }
  
  return false;
}

// Get time zone offset and example conversion
export function getTimeZoneOffset(tz1: string, tz2: string): string {
  try {
    const now = new Date();
    
    const formatter1 = new Intl.DateTimeFormat('en-US', {
      timeZone: tz1,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    
    const formatter2 = new Intl.DateTimeFormat('en-US', {
      timeZone: tz2,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    
    const time1 = formatter1.format(now);
    const time2 = formatter2.format(now);
    
    // Calculate offset
    const date1 = new Date(`2000-01-01T${time1}:00`);
    const date2 = new Date(`2000-01-01T${time2}:00`);
    const diffMs = date2.getTime() - date1.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    const offsetText = diffHours >= 0 ? `+${diffHours}` : `${diffHours}`;
    
    return `${tz1}: ${time1}\n${tz2}: ${time2}\n\nTime difference: ${offsetText} hours`;
  } catch (error) {
    return 'Error calculating time zone difference';
  }
}

// Generate calendar for a given month and year
export function generateCalendar(month: number, year: number): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  let calendar = `${monthNames[month - 1]} ${year}\n\n`;
  calendar += 'Su Mo Tu We Th Fr Sa\n';
  
  // Add leading spaces
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendar += '   ';
  }
  
  // Add days
  for (let day = 1; day <= daysInMonth; day++) {
    calendar += String(day).padStart(2, ' ') + ' ';
    
    if ((day + startingDayOfWeek) % 7 === 0) {
      calendar += '\n';
    }
  }
  
  return calendar;
}

// Calculate shift hours
export function calculateShiftHours(
  startDateTime: string,
  endDateTime: string,
  breakMinutes: number
): { summary: string; error?: string } {
  try {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { summary: '', error: 'Invalid date/time format' };
    }
    
    let diffMs = end.getTime() - start.getTime();
    
    // Handle overnight shifts
    if (diffMs < 0) {
      diffMs += 24 * 60 * 60 * 1000; // Add 24 hours
    }
    
    // Subtract break time
    const breakMs = breakMinutes * 60 * 1000;
    const workMs = Math.max(0, diffMs - breakMs);
    
    const totalHours = workMs / (1000 * 60 * 60);
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    
    const summary = `Total shift: ${hours}h ${minutes}m\n` +
                   `Break time: ${breakMinutes} minutes\n` +
                   `Working hours: ${hours}h ${minutes}m`;
    
    return { summary };
  } catch (error) {
    return { summary: '', error: 'Error calculating shift hours' };
  }
}
