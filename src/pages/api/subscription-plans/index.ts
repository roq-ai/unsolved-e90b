import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { subscriptionPlanValidationSchema } from 'validationSchema/subscription-plans';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getSubscriptionPlans();
    case 'POST':
      return createSubscriptionPlan();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSubscriptionPlans() {
    const data = await prisma.subscription_plan
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'subscription_plan'));
    return res.status(200).json(data);
  }

  async function createSubscriptionPlan() {
    await subscriptionPlanValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.subscriber?.length > 0) {
      const create_subscriber = body.subscriber;
      body.subscriber = {
        create: create_subscriber,
      };
    } else {
      delete body.subscriber;
    }
    const data = await prisma.subscription_plan.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
