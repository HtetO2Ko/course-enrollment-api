export type TCreateEnrollment = {
  batchid: string;
  isWaiting: boolean;
};

export type TEnrollmentResponse = {
  enrollmentid: string;
  isWaiting: boolean;
  approved: boolean;
  batchid: string;
  enrolledBy: string;
  createdAt: Date;
};
