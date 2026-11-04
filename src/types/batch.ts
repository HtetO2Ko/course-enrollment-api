import type { Weekday } from "../../prisma/generated/prisma/enums";

export interface TCreateBatch {
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

// sample requests
// {
//   "name": "SE-01",
//   "capacity": 30,
//   "startDate": "2026-11-13T00:00:00+06:30",
//   "endDate": "2027-02-13T00:00:00+06:30",
//   "classDays": ["THURSDAY", "FRIDAY", "SATURDAY"],
//   "classTime": "09:15",
//   "timezone": "Asia/Yangon",
//   "courseId": "YOUR_COURSE_UUID"
// }
// {
//   "name": "SE-02",
//   "capacity": 25,
//   "startDate": "2026-11-13T00:00:00+06:30",
//   "endDate": "2027-02-13T00:00:00+06:30",
//   "classDays": ["MONDAY", "WEDNESDAY"],
//   "classTime": "23:00",
//   "timezone": "Asia/Yangon",
//   "courseId": "YOUR_COURSE_UUID"
// }
