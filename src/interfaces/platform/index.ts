import { SubscriptionPlanInterface } from 'interfaces/subscription-plan';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PlatformInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  subscription_plan?: SubscriptionPlanInterface[];
  user?: UserInterface;
  _count?: {
    subscription_plan?: number;
  };
}

export interface PlatformGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
