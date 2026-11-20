import type { Weekday } from "../../prisma/generated/prisma/enums";

export interface TCreateBatch {
  batchCode: string;
  capacity: number;
  startDate: Date;

  classDays: Weekday[];
  classTime: string;

  courseId: string;
}

export type TUpdateBatch = Partial<TCreateBatch>;

export type BatchFilterQuery = {
  search?: string;
  startDate?: string;
  courseid?: string;
};
