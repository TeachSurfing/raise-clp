export class LearningPlan {
  constructor(public id: number, public chapters: Chapter[]) {}
}

export class Chapter {
  constructor(
    public id: number,
    public title: string,
    public units: Unit[],
    public rule: any | undefined,
    public open = false
  ) {}
}

export class Unit {
  constructor(
    public id: number,
    public title: string,
    public rule: any | undefined
  ) {}
}
