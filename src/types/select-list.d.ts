import { Network } from "@/types/network";

export interface SelectItem {
  id: number;
  name: string;
  image?: string;
}

export interface NetworkSelectItem {
  id: Network;
  name: string;
  image?: string;
}
