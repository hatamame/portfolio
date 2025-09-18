
import { ComponentType } from 'react';

export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  image: string;
}

export interface Skill {
  icon: ComponentType<{ className?: string }>;
  name: string;
  items: string[];
}

export interface CareerEvent {
  icon: ComponentType<{ className?: string }>;
  date: string;
  title: string;
  company: string;
  description: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export type FileSystemNode = File | Directory;

export interface File {
  type: 'file';
  isProtected?: boolean;
  password?: string;
  content: string;
  unlockEffect?: 'matrix';
}

export interface Directory {
  type: 'directory';
  children: { [key: string]: FileSystemNode };
}
