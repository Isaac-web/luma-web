import { UsersFilters } from '@/components/users/users-filters';
import UsersTable from '@/components/users/users-table';
import { getQueryClient } from '@/components/providers/query-provider/get-query-client';
import { usersQueryOptions } from '@/lib/queries/users.query';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

const UsersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) => {
  const { name } = await searchParams;
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery(usersQueryOptions({ name }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-2">
            Manage system users, view their details, and assign administrative
            roles.
          </p>
        </div>

        <UsersFilters />

        <UsersTable />
      </div>
    </HydrationBoundary>
  );
};

export default UsersPage;
