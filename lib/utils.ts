import { clsx, type ClassValue } from 'clsx';
import { DotGothic16 } from 'next/font/google';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dotgothic16 = DotGothic16({
  weight: "400",
  subsets: ["latin"],
  display: "swap", 
});