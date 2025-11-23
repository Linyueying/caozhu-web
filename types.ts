
export enum View {
  HOME = 'HOME',
  WORKS = 'WORKS',
  ACTIVITIES = 'ACTIVITIES',
  READING = 'READING', // Dedicated reading view
  ACTIVITY_DETAIL = 'ACTIVITY_DETAIL' // Added dedicated activity detail view
}

export interface LiteraryWork {
  id: string;
  title: string;
  author: string;
  category: 'Poetry' | 'Prose' | 'Fiction';
  excerpt: string;
  fullText?: string;
  date: string;
  imageUrl?: string;
}

export interface Activity {
  id: string;
  title: string;
  date: string;
  location?: string; // Added location field
  description: string;
  content?: string; // Added full content for AI analysis
  image: string;
  status: 'Upcoming' | 'Past';
}

export enum AIMode {
  SUMMARY = 'SUMMARY',    // 概述
  KEYPOINTS = 'KEYPOINTS', // 总结 (要点)
  ANALYSIS = 'ANALYSIS',   // 赏析
  RECOMMENDATION = 'RECOMMENDATION' // 推荐
}

export interface AIMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}
