// Percentage calculations
export function calculatePercentageOf(percent: number, value: number): number {
  return (percent / 100) * value;
}

export function calculateWhatPercentOf(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

export function calculatePercentChange(from: number, to: number): number {
  if (from === 0) return to === 0 ? 0 : 100;
  return ((to - from) / from) * 100;
}

// Tip calculator
export interface TipResult {
  tip: number;
  total: number;
  split: number;
  perPersonTip: number;
  perPersonTotal: number;
}

export function calculateTip(bill: number, tipPercent: number, split: number = 1): TipResult {
  const tip = (bill * tipPercent) / 100;
  const total = bill + tip;
  const splitCount = Math.max(1, split);
  
  return {
    tip,
    total,
    split: splitCount,
    perPersonTip: tip / splitCount,
    perPersonTotal: total / splitCount,
  };
}

// Split bill calculator
export interface SplitBillResult {
  subtotal: number;
  taxAmount: number;
  finalTotal: number;
  perPerson: number;
}

export function calculateSplitBill(total: number, people: number, taxPercent: number = 0): SplitBillResult {
  const peopleCount = Math.max(1, people);
  const taxAmount = (total * taxPercent) / 100;
  const finalTotal = total + taxAmount;
  
  return {
    subtotal: total,
    taxAmount,
    finalTotal,
    perPerson: finalTotal / peopleCount,
  };
}

// Age calculator
export interface AgeResult {
  years: number;
  months: number;
  days: number;
  error?: string;
}

export function calculateAge(dob: string, asOf: string): AgeResult {
  const dobDate = new Date(dob);
  const asOfDate = new Date(asOf);
  
  if (isNaN(dobDate.getTime()) || isNaN(asOfDate.getTime())) {
    return { years: 0, months: 0, days: 0, error: 'Invalid date format' };
  }
  
  if (dobDate > asOfDate) {
    return { years: 0, months: 0, days: 0, error: 'Date of birth cannot be after the as-of date' };
  }
  
  let years = asOfDate.getFullYear() - dobDate.getFullYear();
  let months = asOfDate.getMonth() - dobDate.getMonth();
  let days = asOfDate.getDate() - dobDate.getDate();
  
  if (days < 0) {
    months--;
    const prevMonth = new Date(asOfDate.getFullYear(), asOfDate.getMonth(), 0);
    days += prevMonth.getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months, days };
}

// Date difference calculator
export interface DateDifferenceResult {
  days: number;
  direction: string;
  error?: string;
}

export function calculateDateDifference(start: string, end: string): DateDifferenceResult {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return { days: 0, direction: '', error: 'Invalid date format' };
  }
  
  const diffMs = Math.abs(endDate.getTime() - startDate.getTime());
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  const direction = startDate <= endDate ? 'Start is before end' : 'End is before start';
  
  return { days, direction };
}

// Time duration calculator
export interface TimeDurationResult {
  totalSeconds: number;
  formatted: string;
  error?: string;
}

export function parseTimeString(timeStr: string): number | null {
  const parts = timeStr.trim().split(':');
  
  if (parts.length < 2 || parts.length > 3) {
    return null;
  }
  
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  const seconds = parts.length === 3 ? parseInt(parts[2]) : 0;
  
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    return null;
  }
  
  if (hours < 0 || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) {
    return null;
  }
  
  return hours * 3600 + minutes * 60 + seconds;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function calculateTimeDuration(start: string, end: string): TimeDurationResult {
  const startSeconds = parseTimeString(start);
  const endSeconds = parseTimeString(end);
  
  if (startSeconds === null || endSeconds === null) {
    return { totalSeconds: 0, formatted: '', error: 'Invalid time format. Use HH:MM or HH:MM:SS' };
  }
  
  const duration = Math.abs(endSeconds - startSeconds);
  
  return {
    totalSeconds: duration,
    formatted: formatDuration(duration),
  };
}

// Base converter
export interface BaseConversionResult {
  binary: string;
  decimal: string;
  hex: string;
}

export interface BaseValidation {
  valid: boolean;
  error?: string;
}

export function validateBaseInput(input: string, base: 2 | 10 | 16): BaseValidation {
  if (!input || input.trim() === '') {
    return { valid: false, error: 'Input is required' };
  }
  
  const trimmed = input.trim().toUpperCase();
  
  switch (base) {
    case 2:
      if (!/^[01]+$/.test(trimmed)) {
        return { valid: false, error: 'Binary numbers can only contain 0 and 1' };
      }
      break;
    case 10:
      if (!/^\d+$/.test(trimmed)) {
        return { valid: false, error: 'Decimal numbers can only contain digits 0-9' };
      }
      break;
    case 16:
      if (!/^[0-9A-F]+$/.test(trimmed)) {
        return { valid: false, error: 'Hexadecimal numbers can only contain 0-9 and A-F' };
      }
      break;
  }
  
  return { valid: true };
}

export function convertBase(input: string, fromBase: 2 | 10 | 16): BaseConversionResult {
  const trimmed = input.trim().toUpperCase();
  const decimal = parseInt(trimmed, fromBase);
  
  return {
    binary: decimal.toString(2),
    decimal: decimal.toString(10),
    hex: decimal.toString(16).toUpperCase(),
  };
}

// Currency converter
export function convertCurrency(amount: number, rate: number): number {
  return amount * rate;
}

// Random number generator
export function generateRandomNumbers(min: number, max: number, count: number, unique: boolean): number[] {
  const results: number[] = [];
  
  if (unique) {
    const available = new Set<number>();
    for (let i = min; i <= max; i++) {
      available.add(i);
    }
    
    for (let i = 0; i < count && available.size > 0; i++) {
      const arr = Array.from(available);
      const randomIndex = Math.floor(Math.random() * arr.length);
      const num = arr[randomIndex];
      results.push(num);
      available.delete(num);
    }
  } else {
    for (let i = 0; i < count; i++) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      results.push(num);
    }
  }
  
  return results;
}
