import React, { useState } from 'react';
import { useAdminContracts, useAdminContractStats } from '@/hooks/useAdminContracts';
import { Contract } from '@/services/adminContract.service';
import { ContractStatus } from '@/types/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const getStatusBadgeClass = (status: ContractStatus) => {
  switch (status) {
    case ContractStatus.ACTIVE:
      return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
    case ContractStatus.COMPLETED:
      return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
    case ContractStatus.CANCELLED:
      return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
    case ContractStatus.TERMINATED:
      return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20';
    case ContractStatus.PENDING:
    default:
      return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
  }
};

export const ContractsTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);

  const { data, isLoading } = useAdminContracts({ page, size: pageSize });
  const { data: stats } = useAdminContractStats();

  const contracts = data?.content || [];
  const totalPages = data?.totalPages || 0;

  return (
    <Card className="w-full">
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold">Contracts</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Monitor all platform contracts
          </p>
          {stats && (
            <div className="flex gap-4 mt-3">
              <div className="text-sm">
                <span className="text-muted-foreground">Total:</span>{' '}
                <strong>{stats.totalContracts}</strong>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Active:</span>{' '}
                <strong className="text-green-600">{stats.activeContracts}</strong>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Disputed:</span>{' '}
                <strong className="text-red-600">{stats.disputedContracts}</strong>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Freelancer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : contracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No contracts found
                  </TableCell>
                </TableRow>
              ) : (
                contracts.map((contract) => (
                  <TableRow key={contract.id} className="hover:bg-muted/50">
                    <TableCell>
                      <p className="font-medium">{contract.projectTitle}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{contract.clientName}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{contract.freelancerName}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">
                        {contract.currency} {contract.totalAmount?.toLocaleString() || 0}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(contract.status)}>
                        {contract.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(contract.startDate), 'MMM d, yyyy')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
