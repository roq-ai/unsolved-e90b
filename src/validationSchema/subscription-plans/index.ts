import * as yup from 'yup';

export const subscriptionPlanValidationSchema = yup.object().shape({
  name: yup.string().required(),
  price: yup.number().integer().required(),
  platform_id: yup.string().nullable(),
});
