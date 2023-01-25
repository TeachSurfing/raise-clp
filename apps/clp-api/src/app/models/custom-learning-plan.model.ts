export class CustomLearningPlan {
  chapters: {
    title: string;
    recommendation: boolean;
    lessonId: number;
  }[] = [];
}
