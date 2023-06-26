const mapping: Record<string, string> = {
  platforms: 'platform',
  subscribers: 'subscriber',
  'subscription-plans': 'subscription_plan',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
