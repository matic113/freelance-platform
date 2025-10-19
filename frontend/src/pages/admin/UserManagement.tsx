import { useMemo, useState, type ElementType } from 'react';
import { useAdminUsers } from '@/hooks/useAdmin';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Clock, Filter, ShieldCheck, ShieldAlert, UserCog, Users } from 'lucide-react';
import { UserResponse, UserType } from '@/types/api';
import { cn } from '@/lib/utils';

const formatDate = (value: string | undefined) => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

type RoleBadgeMeta = {
  label: string;
  variant: 'default' | 'outline' | 'secondary' | 'destructive';
  icon: ElementType;
};

const roleBadges: Partial<Record<UserType, RoleBadgeMeta>> = {
  [UserType.CLIENT]: { label: 'Client', variant: 'secondary', icon: Users },
  [UserType.FREELANCER]: { label: 'Freelancer', variant: 'outline', icon: UserCog },
  [UserType.ADMIN]: { label: 'Admin', variant: 'default', icon: ShieldCheck },
  [UserType.SUPER_ADMIN]: { label: 'Super Admin', variant: 'default', icon: ShieldAlert },
  [UserType.MODERATOR]: { label: 'Moderator', variant: 'secondary', icon: ShieldCheck },
  [UserType.SUPPORT]: { label: 'Support', variant: 'secondary', icon: CheckCircle2 },
  [UserType.ANALYST]: { label: 'Analyst', variant: 'outline', icon: Clock },
};

const USER_TYPES_ORDER: Array<UserType | 'ALL'> = ['ALL', ...Object.values(UserType)];

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRole, setSelectedRole] = useState<UserType | 'ALL'>('ALL');

  const { data, isLoading, isFetching, refetch } = useAdminUsers(
    {
      page,
      size: pageSize,
      searchTerm: debouncedSearch.trim().length > 0 ? debouncedSearch : undefined,
    },
    {
      keepPreviousData: true,
    }
  );

  const filteredUsers = useMemo(() => {
    if (!data?.content) {
      return [];
    }

    if (selectedRole === 'ALL') {
      return data.content;
    }

    return data.content.filter((user) => user.roles.includes(selectedRole));
  }, [data?.content, selectedRole]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    window.clearTimeout((handleSearchChange as { timer?: number }).timer);
    (handleSearchChange as { timer?: number }).timer = window.setTimeout(() => {
      setDebouncedSearch(value);
      setPage(0);
    }, 400);
  };

  const renderRoleBadges = (roles: UserType[]) => (
    <div className="flex flex-wrap gap-2">
      {roles.map((role) => {
        const roleMeta = roleBadges[role];
        if (!roleMeta) {
          return null;
        }

        const Icon = roleMeta.icon;
        return (
          <Badge key={`${role}`} variant={roleMeta.variant} className="text-xs flex items-center gap-1">
            <Icon className="h-3 w-3" />
            {roleMeta.label}
          </Badge>
        );
      })}
    </div>
  );

  const renderTable = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: pageSize }).map((_, index) => (
            <div key={`loading-row-${index}`} className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr] gap-4 p-4 border rounded-md">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      );
    }

    if (!filteredUsers || filteredUsers.length === 0) {
      return (
        <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          {searchTerm || selectedRole !== 'ALL'
            ? 'No users match the current filters.'
            : 'No users found yet.'}
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user: UserResponse) => (
            <TableRow key={user.id} className={cn(isFetching ? 'opacity-70' : '')}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">{`${user.firstName} ${user.lastName}`}</span>
                  <span className="text-xs text-muted-foreground">{user.id}</span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{renderRoleBadges(user.roles)}</TableCell>
              <TableCell>
                <Badge variant={user.isActive ? 'default' : 'destructive'} className="text-xs">
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <Card className="border-border shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-foreground">User Management</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Search, filter, and manage platform users across roles and statuses.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Input
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name or email"
              className="max-w-sm"
            />
            <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {USER_TYPES_ORDER.map((role) => {
              if (role === 'ALL') {
                return (
                  <Button
                    key="all"
                    variant={selectedRole === 'ALL' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedRole('ALL')}
                  >
                    All Roles
                  </Button>
                );
              }

              const roleMeta = roleBadges[role];
              if (!roleMeta) {
                return null;
              }

              return (
                <Button
                  key={role}
                  variant={selectedRole === role ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRole(role)}
                >
                  {roleMeta.label}
                </Button>
              );
            })}
          </div>
        </CardContent>

        <CardContent>{renderTable()}</CardContent>

        <CardFooter className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {data?.totalElements ?? 0} users
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Rows per page
              <Input
                type="number"
                min={5}
                max={50}
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(0);
                }}
                className="h-9 w-20"
              />
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={page + 1 >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserManagement;
