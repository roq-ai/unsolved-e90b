import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import {
  Text,
  Box,
  Spinner,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
  Stack,
} from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { FiTrash, FiEdit2, FiEdit3 } from 'react-icons/fi';
import { getSubscriptionPlanById } from 'apiSdk/subscription-plans';
import { Error } from 'components/error';
import { SubscriptionPlanInterface } from 'interfaces/subscription-plan';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteSubscriberById, createSubscriber } from 'apiSdk/subscribers';

function SubscriptionPlanViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SubscriptionPlanInterface>(
    () => (id ? `/subscription-plans/${id}` : null),
    () =>
      getSubscriptionPlanById(id, {
        relations: ['platform', 'subscriber'],
      }),
  );

  const [subscriberUserId, setSubscriberUserId] = useState(null);
  const subscriberHandleCreate = async () => {
    setCreateError(null);
    try {
      await createSubscriber({ subscription_plan_id: id, user_id: subscriberUserId });
      setSubscriberUserId(null);
      await mutate();
    } catch (error) {
      setCreateError(error);
    }
  };
  const subscriberHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteSubscriberById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Flex justifyContent="space-between" mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Subscription Plan Detail View
          </Text>
          {hasAccess('subscription_plan', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
            <NextLink href={`/subscription-plans/edit/${data?.id}`} passHref legacyBehavior>
              <Button
                onClick={(e) => e.stopPropagation()}
                mr={2}
                as="a"
                variant="outline"
                colorScheme="blue"
                leftIcon={<FiEdit2 />}
              >
                Edit
              </Button>
            </NextLink>
          )}
        </Flex>
        {error && (
          <Box mb={4}>
            {' '}
            <Error error={error} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <Stack direction="column" spacing={2} mb={4}>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Name:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.name}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Price:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.price}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Created At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.created_at as unknown as string}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Updated At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.updated_at as unknown as string}
                </Text>
              </Flex>
            </Stack>
            <Box>
              {hasAccess('platform', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Flex alignItems="center" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" as="span">
                    Platform:
                  </Text>
                  <Text fontSize="md" as="span" ml={3}>
                    <Link as={NextLink} href={`/platforms/view/${data?.platform?.id}`}>
                      {data?.platform?.name}
                    </Link>
                  </Text>
                </Flex>
              )}
            </Box>
            <Box>
              <Stack spacing={2} mb={8}>
                <Text fontSize="lg" fontWeight="bold">
                  Subscribers:
                </Text>
                <Flex gap={5} alignItems="flex-end">
                  <Box flex={1}>
                    <UserSelect name={'subscriber_user'} value={subscriberUserId} handleChange={setSubscriberUserId} />
                  </Box>
                  <Button
                    colorScheme="blue"
                    mt="4"
                    mr="4"
                    onClick={subscriberHandleCreate}
                    isDisabled={!subscriberUserId}
                  >
                    Create
                  </Button>
                </Flex>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Email</Th>

                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.subscriber?.map((record) => (
                        <Tr
                          cursor="pointer"
                          onClick={() => router.push(`/users/view/${record?.user?.id}`)}
                          key={record?.user?.id}
                        >
                          <Td>{record?.user?.email}</Td>

                          <Td>
                            {hasAccess('user', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  subscriberHandleDelete(record.id);
                                }}
                                colorScheme="red"
                                variant="outline"
                                aria-label="edit"
                                icon={<FiTrash />}
                              />
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'subscription_plan',
  operation: AccessOperationEnum.READ,
})(SubscriptionPlanViewPage);
