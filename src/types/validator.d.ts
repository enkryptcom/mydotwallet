import { Token } from "@/types/token";

export interface Validator {
  id?: number;
  name?: string;
  image?: string;
  address: string;
  nominators: number;
  commission: number;
  total: number;
  bonded: number;
  returns?: number;
  token: Token;
  isActive: boolean;
  isBlocking: boolean;
  isElected: boolean;
  isNominating: boolean;
  isHighRisk: boolean;
  isOversubscribed: boolean;
}
