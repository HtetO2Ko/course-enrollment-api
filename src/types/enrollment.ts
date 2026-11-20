export type TCreateEnrollment = {
  batchid: string;
};

export type TEnrollmentResponse = {
  enrollmentid: string;
  isWaiting: boolean;
  approved: boolean;
  batchid: string;
  enrolledBy: string;
  createdAt: Date;
};
