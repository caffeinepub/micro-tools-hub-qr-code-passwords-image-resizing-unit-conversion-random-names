import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { WrappingTabsHeader } from '@/components/WrappingTabsHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Pause, RotateCcw, Copy, Printer, Bell, Clock } from 'lucide-react';
import { copyToClipboard } from '@/lib/clipboard';
import {
  formatDuration,
  calculateCountdown,
  formatStopwatch,
  calculatePomodoroState,
  checkAlarmTrigger,
  getTimeZoneOffset,
  generateCalendar,
  calculateShiftHours,
  TIME_ZONES,
  type PomodoroPhase,
} from '@/lib/dailyUtilities';

export default function DailyUtilitiesPage() {
  const [activeTab, setActiveTab] = useState('countdown');

  // Countdown Timer State
  const [countdownTarget, setCountdownTarget] = useState('');
  const [countdownRunning, setCountdownRunning] = useState(false);
  const [countdownRemaining, setCountdownRemaining] = useState(0);

  // Stopwatch State
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchElapsed, setStopwatchElapsed] = useState(0);
  const [stopwatchStart, setStopwatchStart] = useState<number | null>(null);

  // Pomodoro State
  const [pomodoroWorkMinutes, setPomodoroWorkMinutes] = useState(25);
  const [pomodoroBreakMinutes, setPomodoroBreakMinutes] = useState(5);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroPhase, setPomodoroPhase] = useState<PomodoroPhase>('work');
  const [pomodoroRemaining, setPomodoroRemaining] = useState(0);
  const [pomodoroStart, setPomodoroStart] = useState<number | null>(null);

  // Alarm State
  const [alarmTime, setAlarmTime] = useState('');
  const [alarmDate, setAlarmDate] = useState('');
  const [alarmSet, setAlarmSet] = useState(false);
  const [alarmTriggered, setAlarmTriggered] = useState(false);

  // Time Zone State
  const [timeZone1, setTimeZone1] = useState('America/New_York');
  const [timeZone2, setTimeZone2] = useState('Europe/London');
  const [timeZoneResult, setTimeZoneResult] = useState('');

  // Calendar State
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarOutput, setCalendarOutput] = useState('');

  // Shift Calculator State
  const [shiftStart, setShiftStart] = useState('');
  const [shiftEnd, setShiftEnd] = useState('');
  const [shiftBreak, setShiftBreak] = useState('0');
  const [shiftResult, setShiftResult] = useState('');
  const [shiftError, setShiftError] = useState('');

  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);

  const tabs = [
    { value: 'countdown', label: 'Countdown' },
    { value: 'stopwatch', label: 'Stopwatch' },
    { value: 'pomodoro', label: 'Pomodoro' },
    { value: 'alarm', label: 'Alarm' },
    { value: 'timezone', label: 'Time Zones' },
    { value: 'calendar', label: 'Calendar' },
    { value: 'shift', label: 'Shift Calculator' },
  ];

  // Countdown Timer Effect
  useEffect(() => {
    if (!countdownRunning || !countdownTarget) return;

    const interval = setInterval(() => {
      const remaining = calculateCountdown(countdownTarget);
      setCountdownRemaining(remaining);
      if (remaining <= 0) {
        setCountdownRunning(false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [countdownRunning, countdownTarget]);

  // Stopwatch Effect
  useEffect(() => {
    if (!stopwatchRunning) return;

    const interval = setInterval(() => {
      if (stopwatchStart) {
        setStopwatchElapsed(Date.now() - stopwatchStart);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [stopwatchRunning, stopwatchStart]);

  // Pomodoro Effect
  useEffect(() => {
    if (!pomodoroRunning || !pomodoroStart) return;

    const interval = setInterval(() => {
      const state = calculatePomodoroState(
        pomodoroStart,
        pomodoroWorkMinutes,
        pomodoroBreakMinutes,
        pomodoroPhase
      );
      setPomodoroPhase(state.phase);
      setPomodoroRemaining(state.remaining);

      if (state.remaining <= 0) {
        const newPhase: PomodoroPhase = state.phase === 'work' ? 'break' : 'work';
        setPomodoroPhase(newPhase);
        setPomodoroStart(Date.now());
      }
    }, 100);

    return () => clearInterval(interval);
  }, [pomodoroRunning, pomodoroStart, pomodoroWorkMinutes, pomodoroBreakMinutes, pomodoroPhase]);

  // Alarm Effect
  useEffect(() => {
    if (!alarmSet || alarmTriggered) return;

    const interval = setInterval(() => {
      const triggered = checkAlarmTrigger(alarmTime, alarmDate);
      if (triggered) {
        setAlarmTriggered(true);
        if (alarmAudioRef.current) {
          alarmAudioRef.current.play().catch(() => {});
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [alarmSet, alarmTime, alarmDate, alarmTriggered]);

  const startCountdown = () => {
    if (!countdownTarget) return;
    setCountdownRunning(true);
  };

  const resetCountdown = () => {
    setCountdownRunning(false);
    setCountdownRemaining(0);
    setCountdownTarget('');
  };

  const startStopwatch = () => {
    if (!stopwatchRunning) {
      setStopwatchStart(Date.now() - stopwatchElapsed);
    }
    setStopwatchRunning(!stopwatchRunning);
  };

  const resetStopwatch = () => {
    setStopwatchRunning(false);
    setStopwatchElapsed(0);
    setStopwatchStart(null);
  };

  const startPomodoro = () => {
    if (!pomodoroRunning) {
      setPomodoroStart(Date.now());
      setPomodoroRemaining(pomodoroPhase === 'work' ? pomodoroWorkMinutes * 60 * 1000 : pomodoroBreakMinutes * 60 * 1000);
    }
    setPomodoroRunning(!pomodoroRunning);
  };

  const resetPomodoro = () => {
    setPomodoroRunning(false);
    setPomodoroPhase('work');
    setPomodoroRemaining(0);
    setPomodoroStart(null);
  };

  const setAlarm = () => {
    if (!alarmTime) return;
    setAlarmSet(true);
    setAlarmTriggered(false);
  };

  const clearAlarm = () => {
    setAlarmSet(false);
    setAlarmTriggered(false);
    setAlarmTime('');
    setAlarmDate('');
  };

  const dismissAlarm = () => {
    setAlarmTriggered(false);
    setAlarmSet(false);
  };

  const calculateTimeZones = () => {
    const result = getTimeZoneOffset(timeZone1, timeZone2);
    setTimeZoneResult(result);
  };

  const clearTimeZones = () => {
    setTimeZone1('America/New_York');
    setTimeZone2('Europe/London');
    setTimeZoneResult('');
  };

  const generateCalendarOutput = () => {
    const output = generateCalendar(calendarMonth, calendarYear);
    setCalendarOutput(output);
  };

  const printCalendar = () => {
    if (!calendarOutput) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Calendar - ${calendarMonth}/${calendarYear}</title>
            <style>
              body { font-family: monospace; padding: 20px; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <pre>${calendarOutput}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const calculateShift = () => {
    if (!shiftStart || !shiftEnd) {
      setShiftError('Please enter both start and end times');
      setShiftResult('');
      return;
    }

    const result = calculateShiftHours(shiftStart, shiftEnd, parseFloat(shiftBreak));
    if (result.error) {
      setShiftError(result.error);
      setShiftResult('');
    } else {
      setShiftError('');
      setShiftResult(result.summary);
    }
  };

  const clearShift = () => {
    setShiftStart('');
    setShiftEnd('');
    setShiftBreak('0');
    setShiftResult('');
    setShiftError('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Daily Utilities</h1>
        <p className="text-muted-foreground">
          Essential time management and productivity tools
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <WrappingTabsHeader tabs={tabs} />

        <TabsContent value="countdown" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Countdown Timer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="countdown-target">Target Date & Time</Label>
                <Input
                  id="countdown-target"
                  type="datetime-local"
                  value={countdownTarget}
                  onChange={(e) => setCountdownTarget(e.target.value)}
                  disabled={countdownRunning}
                />
              </div>

              {countdownRunning && (
                <div className="text-center py-8">
                  <div className="text-5xl font-bold font-mono">
                    {formatDuration(countdownRemaining)}
                  </div>
                  <p className="text-muted-foreground mt-2">remaining</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={startCountdown}
                  disabled={countdownRunning || !countdownTarget}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
                <Button onClick={resetCountdown} variant="outline" className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stopwatch" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Stopwatch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <div className="text-5xl font-bold font-mono">
                  {formatStopwatch(stopwatchElapsed)}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={startStopwatch} className="flex-1">
                  {stopwatchRunning ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                <Button onClick={resetStopwatch} variant="outline" className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pomodoro" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pomodoro Timer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="work-minutes">Work Minutes</Label>
                  <Input
                    id="work-minutes"
                    type="number"
                    min="1"
                    max="60"
                    value={pomodoroWorkMinutes}
                    onChange={(e) => setPomodoroWorkMinutes(parseInt(e.target.value) || 25)}
                    disabled={pomodoroRunning}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="break-minutes">Break Minutes</Label>
                  <Input
                    id="break-minutes"
                    type="number"
                    min="1"
                    max="30"
                    value={pomodoroBreakMinutes}
                    onChange={(e) => setPomodoroBreakMinutes(parseInt(e.target.value) || 5)}
                    disabled={pomodoroRunning}
                  />
                </div>
              </div>

              <div className="text-center py-8">
                <div className="text-2xl font-semibold mb-2 capitalize">
                  {pomodoroPhase === 'work' ? '🎯 Work Time' : '☕ Break Time'}
                </div>
                <div className="text-5xl font-bold font-mono">
                  {formatDuration(pomodoroRemaining || (pomodoroPhase === 'work' ? pomodoroWorkMinutes * 60 * 1000 : pomodoroBreakMinutes * 60 * 1000))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={startPomodoro} className="flex-1">
                  {pomodoroRunning ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                <Button onClick={resetPomodoro} variant="outline" className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alarm" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alarm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alarmTriggered && (
                <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/30">
                  <Bell className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span className="font-semibold">🔔 Alarm triggered!</span>
                    <Button size="sm" onClick={dismissAlarm}>
                      Dismiss
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="alarm-time">Time</Label>
                <Input
                  id="alarm-time"
                  type="time"
                  value={alarmTime}
                  onChange={(e) => setAlarmTime(e.target.value)}
                  disabled={alarmSet}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alarm-date">Date (optional)</Label>
                <Input
                  id="alarm-date"
                  type="date"
                  value={alarmDate}
                  onChange={(e) => setAlarmDate(e.target.value)}
                  disabled={alarmSet}
                />
              </div>

              {alarmSet && !alarmTriggered && (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Alarm set for {alarmTime} {alarmDate && `on ${alarmDate}`}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button onClick={setAlarm} disabled={alarmSet || !alarmTime} className="flex-1">
                  <Bell className="h-4 w-4 mr-2" />
                  Set Alarm
                </Button>
                <Button onClick={clearAlarm} variant="outline" className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>

              <audio ref={alarmAudioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXvzn0pBSh+zPDajzsKElyx6OyrWBUIQ5zd8sFuJAUuhM/z24k2CBdju+zooVARC0yl4fG5ZRwFNo3V7859KQUofszw2o87ChJcsejsq1gVCEOc3fLBbiQFLoTP89uJNggXY7vs6KFQEQtMpeHxuWUcBTaN1e/OfSkFKH7M8NqPOws=" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timezone" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Time Zone Difference Checker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tz1">Time Zone 1</Label>
                  <Select value={timeZone1} onValueChange={setTimeZone1}>
                    <SelectTrigger id="tz1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_ZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tz2">Time Zone 2</Label>
                  <Select value={timeZone2} onValueChange={setTimeZone2}>
                    <SelectTrigger id="tz2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_ZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {timeZoneResult && (
                <div className="bg-muted p-4 rounded-md">
                  <pre className="whitespace-pre-wrap font-mono text-sm">{timeZoneResult}</pre>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={calculateTimeZones} className="flex-1">
                  Calculate
                </Button>
                <Button onClick={clearTimeZones} variant="outline" className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                {timeZoneResult && (
                  <Button onClick={() => copyToClipboard(timeZoneResult)} variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Simple Calendar Printer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cal-month">Month</Label>
                  <Select value={String(calendarMonth)} onValueChange={(v) => setCalendarMonth(parseInt(v))}>
                    <SelectTrigger id="cal-month">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <SelectItem key={m} value={String(m)}>
                          {new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cal-year">Year</Label>
                  <Input
                    id="cal-year"
                    type="number"
                    min="1900"
                    max="2100"
                    value={calendarYear}
                    onChange={(e) => setCalendarYear(parseInt(e.target.value) || new Date().getFullYear())}
                  />
                </div>
              </div>

              {calendarOutput && (
                <div className="bg-muted p-4 rounded-md">
                  <pre className="whitespace-pre-wrap font-mono text-sm">{calendarOutput}</pre>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={generateCalendarOutput} className="flex-1">
                  Generate
                </Button>
                {calendarOutput && (
                  <>
                    <Button onClick={printCalendar} variant="outline">
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                    <Button onClick={() => copyToClipboard(calendarOutput)} variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shift" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Shift / Rota Hours Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shift-start">Start Date & Time</Label>
                <Input
                  id="shift-start"
                  type="datetime-local"
                  value={shiftStart}
                  onChange={(e) => setShiftStart(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shift-end">End Date & Time</Label>
                <Input
                  id="shift-end"
                  type="datetime-local"
                  value={shiftEnd}
                  onChange={(e) => setShiftEnd(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shift-break">Break (minutes)</Label>
                <Input
                  id="shift-break"
                  type="number"
                  min="0"
                  value={shiftBreak}
                  onChange={(e) => setShiftBreak(e.target.value)}
                />
              </div>

              {shiftError && (
                <Alert variant="destructive">
                  <AlertDescription>{shiftError}</AlertDescription>
                </Alert>
              )}

              {shiftResult && (
                <div className="bg-muted p-4 rounded-md">
                  <pre className="whitespace-pre-wrap font-mono text-sm">{shiftResult}</pre>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={calculateShift} className="flex-1">
                  Calculate
                </Button>
                <Button onClick={clearShift} variant="outline" className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                {shiftResult && (
                  <Button onClick={() => copyToClipboard(shiftResult)} variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
