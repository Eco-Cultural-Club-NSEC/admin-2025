export const REJECTION_REASONS = {
  PAYMENT_NOT_APPROVED: "Payment not approved",
  INCOMPLETE_INFORMATION: "Incomplete or invalid information",
  CAPACITY_FULL: "Event capacity is full",
  ELIGIBILITY_NOT_MET: "Eligibility criteria not met",
  DUPLICATE_REGISTRATION: "Duplicate registration found",
  TECHNICAL_ISSUE: "Technical issues with registration",
  OTHER: "Other reasons",
} as const;

export type RejectionReason = keyof typeof REJECTION_REASONS;
