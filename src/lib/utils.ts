import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "@visx/vendor/d3-format";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isProduction = import.meta.env.MODE === "production";

export function percentage(value: number, total: number): number {
  return (value / total) * 100;
}

export const oneDecimalFormat = format(".1f");
export const twoDecimalFormat = format(".2f");
