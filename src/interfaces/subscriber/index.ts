import { UserInterface } from 'interfaces/user';
import { SubscriptionPlanInterface } from 'interfaces/subscription-plan';
import { GetQueryInterface } from 'interfaces';

export interface SubscriberInterface {
  id?: string;
  user_id?: string;
  subscription_plan_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  subscription_plan?: SubscriptionPlanInterface;
  _count?: {};
}

export interface SubscriberGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  subscription_plan_id?: string;
}
