import { Token } from "@/types/token";

export interface Validator {
  id: number;
  name: string;
  image: string;
  address: string;
  nominators: number;
  comission: number;
  total: number;
  returns: number;
  token: Token;
  isHightRisk: boolean;
  isOversubscribed: boolean;
}
