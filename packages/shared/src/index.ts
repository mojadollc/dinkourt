export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type BookingFeeSnapshot = {
  feeType: "FIXED" | "PERCENTAGE" | "FIXED_PLUS_PERCENTAGE" | "NONE";
  fixedAmount?: number;
  percentage?: number;
  chargedTo: "PLAYER" | "VENUE";
};

export function calculateBookingFee(
  baseAmount: number,
  snapshot: BookingFeeSnapshot
): number {
  switch (snapshot.feeType) {
    case "FIXED":
      return snapshot.fixedAmount ?? 0;
    case "PERCENTAGE":
      return baseAmount * (snapshot.percentage ?? 0);
    case "FIXED_PLUS_PERCENTAGE":
      return (snapshot.fixedAmount ?? 0) + baseAmount * (snapshot.percentage ?? 0);
    default:
      return 0;
  }
}

export const SAAS_PLANS = {
  BUSINESS: { name: "Business", monthlyPrice: 1699, annualPrice: 16990 },
} as const;
