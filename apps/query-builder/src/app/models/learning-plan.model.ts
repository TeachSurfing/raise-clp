export interface LearningPlan {
  id: number;
  title: string;
  course_id: number;
  description: string;
  items: Unit[];
}

export interface Unit {
  id: number;
  type: string;
  title: string;
}
