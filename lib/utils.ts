import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatTime(timeString: string): string {
  try {
    if (timeString.includes(":")) {
      const [hours, minutes] = timeString.split(":");
      const h = parseInt(hours, 10);
      const ampm = h >= 12 ? "PM" : "AM";
      const formattedHours = h % 12 || 12;
      return `${formattedHours}:${minutes.padStart(2, "0")} ${ampm}`;
    }
    return timeString;
  } catch {
    return timeString;
  }
}

export function calculateAge(dobString: string): number {
  try {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return isNaN(age) ? 0 : Math.max(0, age);
  } catch {
    return 0;
  }
}

export function generateId(prefix: string): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}
