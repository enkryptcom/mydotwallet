export interface CrowdloanItem {
  id: number;
  name: string;
  link: string;
  image: string;
  percent: number;
  amount: number;
  contributions: number;
  tokens: string;
  isContribute: boolean;
}
