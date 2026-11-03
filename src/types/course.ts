import type { Level } from "../../prisma/generated/prisma/enums";

export interface TCourse {
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
