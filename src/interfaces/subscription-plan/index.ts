import { SubscriberInterface } from 'interfaces/subscriber';
import { PlatformInterface } from 'interfaces/platform';
import { GetQueryInterface } from 'interfaces';

export interface SubscriptionPlanInterface {
  id?: string;
  name: string;
  price: number;
  platform_id?: string;
  created_at?: any;
  updated_at?: any;
  subscriber?: SubscriberInterface[];
  platform?: PlatformInterface;
  _count?: {
    subscriber?: number;
  };
}

export interface SubscriptionPlanGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  platform_id?: string;
}
