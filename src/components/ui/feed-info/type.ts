import { TOrdersData } from '@utils-types';

export type FeedInfoUIProps = {
  feed: TOrdersData | null;
  readyOrders: number[];
  pendingOrders: number[];
  isLoading?: boolean;
  error?: string | null;
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};
