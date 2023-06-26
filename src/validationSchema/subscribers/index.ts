import * as yup from 'yup';

export const subscriberValidationSchema = yup.object().shape({
  user_id: yup.string().nullable(),
  subscription_plan_id: yup.string().nullable(),
});
