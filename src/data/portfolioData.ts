import { Code2, Database, Cpu, Brain, Briefcase, GraduationCap, Cake } from 'lucide-react';
import type { Project, Skill, CareerEvent } from '../types';

export const projects: Project[] = [
  {
    id: 1,
    title: "sticky-flow",
    description: "オンライン付箋ツール。リアルタイムコラボレーションを搭載。",
    tech: ["React", "Python", "TensorFlow", "D3.js"],
    github: "https://github.com/hatamame/stickey-flow",
    live: "https://stickey-flow.vercel.app/",
    image: "img/sticky-flow.png"
  },
  {
    id: 2,
    title: "SUDOKU",
    description: "オンライン数独ゲーム。デイリーチャレンジによる無限の楽しみ方。",
    tech: ["Solidity", "Web3.js", "React", "Node.js"],
    github: "https://github.com/hatamame/sudoku-game",
    live: "https://sudoku-game-ten-fawn.vercel.app/",
    image: "img/SUDOKU.png"
  },
  {
    id: 3,
    title: "html-practice-course",
    description: "WebSocketを使用したリアルタイムHTML学習プラットフォーム。",
    tech: ["React", "Socket.io", "Node.js", "MongoDB"],
    github: "https://github.com/hatamame/HTML-practice-course",
    live: "https://html-practice-course-nu.vercel.app/",
    image: "img/html-practice-course.png"
  },
  {
    id: 4,
    title: "AI競馬予想アプリ",
    description: "OpenAI APIと機械学習を活用した競馬予想アプリ。",
    tech: ["React", "TypeScript", "OpenAI API", "Tailwind CSS"],
    github: "https://github.com/hatamame/horserace",
    live: "https://horserace-nine.vercel.app/",
    image: "img/keiba-app.png"
  },
  {
    id: 5,
    title: "ポートフォリオサイト",
    description: "ReactとThree.jsを使用した3Dアニメーション搭載のポートフォリオサイト。",
    tech: ["React", "TypeScript", "Three.js", "Tailwind CSS"],
    github: "https://github.com/hatamame/portfolio",
    live: "https://portfolio-three-kappa-62.vercel.app/",
    image: "img/portfolio.png"
  }
];

export const skills: Skill[] = [
  { icon: Code2, name: "Frontend", items: ["React", "TypeScript", "Vue.js", "Next.js"] },
  { icon: Database, name: "Backend", items: ["Node.js", "Python", "PostgreSQL", "supabase", "firebase"] },
  { icon: Cpu, name: "DevOps", items: ["Docker", "AWS", "CI/CD", "Kubernetes"] },
  { icon: Brain, name: "AI/ML", items: ["TensorFlow", "PyTorch", "OpenAI API", "Computer Vision"] },
];

export const careerHistory: CareerEvent[] = [
  {
    icon: Cake,
    date: "2002/04/24",
    title: "誕生",
    company: "千葉県船橋市",
    description: "千葉県船橋市で誕生。\n幼少期からテクノロジーに興味を持つ。",
  },
  {
    icon: GraduationCap,
    date: "2009 - 2015",
    title: "小学校卒業",
    company: "船橋市立船橋小学校",
    description: "地元の小学校で基礎学力と協調性を養う。",
  },
  {
    icon: GraduationCap,
    date: "2015 - 2021",
    title: "中学・高校卒業",
    company: "芝中学・高等学校",
    description: "プログラミングを始め、初めてコードを書く。\nデザインと技術の融合に興味を持つ。",
  },
  {
    icon: GraduationCap,
    date: "2021 - 2025",
    title: "学士(外国研究)取得",
    company: "上智大学",
    description: "ロシア語を専攻しつつ、データ構造、アルゴリズム、ソフトウェア工学の基礎を学ぶ。",
  },
  {
    icon: Briefcase,
    date: "2025 - ",
    title: "現職",
    company: "日本トーター株式会社",
    description: "Webアプリケーションのフロントエンド開発を担当。\nReactとTypeScriptを使用し、UIコンポーネントの実装とテストに従事。",
  },
];