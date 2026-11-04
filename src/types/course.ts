import type { Level } from "../../prisma/generated/prisma/enums";

export interface TCreateCourse {
  title: string;
  level: Level;
  description: string;
  code: string;
  fees: number;
  duration: number;
  outlines: string;
  prerequisite: string;

  imageId: string;
}

export type TUpdateCourse = Partial<TCreateCourse>;
