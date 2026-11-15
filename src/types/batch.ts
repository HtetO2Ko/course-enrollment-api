import type { Weekday } from "../../prisma/generated/prisma/enums";

export interface TCreateBatch {
  batchCode: string;
  name: string;
  capacity: number;
  startDate: Date;
  endDate: Date;

  classDays: Weekday[];
  classTime: string;
  timezone: string;

  courseId: string;
}

export type TUpdateBatch = Partial<TCreateBatch>;

export type BatchFilterQuery = {
  search?: string;
  startDate?: string;
  courseid?: string;
};
