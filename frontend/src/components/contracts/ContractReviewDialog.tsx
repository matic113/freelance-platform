import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalization } from '@/hooks/useLocalization';
import { useToast } from '@/hooks/use-toast';
import { 
  useCreateMilestone, 
  useUpdateMilestone, 
  useDeleteMilestone 
} from '@/hooks/useContracts';
import { ContractResponse, MilestoneResponse } from '@/types/contract';
import { 
  Calendar, 
  DollarSign, 
  Edit2, 
  Trash2, 
  Plus, 
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContractReviewDialogProps {
  open: boolean;
  contract: ContractResponse | null;
  onClose?: () => void;
}

export function ContractReviewDialog({ open, contract, onClose }: ContractReviewDialogProps) {
  const { isRTL } = useLocalization();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [milestones, setMilestones] = useState<MilestoneResponse[]>([]);
  const [editingMilestone, setEditingMilestone] = useState<MilestoneResponse | null>(null);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    amount: '',
    dueDate: '',
  });

  const createMilestoneMutation = useCreateMilestone();
  const updateMilestoneMutation = useUpdateMilestone();
  const deleteMilestoneMutation = useDeleteMilestone();

  useEffect(() => {
    if (contract?.milestones) {
      setMilestones(contract.milestones);
    }
  }, [contract]);

  const totalMilestoneAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
  const isAmountValid = Math.abs(totalMilestoneAmount - (contract?.totalAmount || 0)) < 0.01;

  const handleAddMilestone = async () => {
    if (!contract?.id || !newMilestone.title || !newMilestone.amount || !newMilestone.dueDate) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      await createMilestoneMutation.mutateAsync({
        contractId: contract.id,
        request: {
          title: newMilestone.title,
          description: newMilestone.description,
          amount: parseFloat(newMilestone.amount),
          dueDate: newMilestone.dueDate,
          orderIndex: milestones.length + 1
        }
      });

      toast({
        title: isRTL ? 'نجح' : 'Success',
        description: isRTL ? 'تمت إضافة المعلم بنجاح' : 'Milestone added successfully',
      });

      setNewMilestone({ title: '', description: '', amount: '', dueDate: '' });
      setShowAddMilestone(false);
    } catch (error) {
      console.error('Error adding milestone:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في إضافة المعلم' : 'Failed to add milestone',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateMilestone = async (milestone: MilestoneResponse) => {
    if (!contract?.id) return;

    try {
      await updateMilestoneMutation.mutateAsync({
        contractId: contract.id,
        milestoneId: milestone.id,
        request: {
          title: milestone.title,
          description: milestone.description,
          amount: milestone.amount,
          dueDate: milestone.dueDate,
        }
      });

      toast({
        title: isRTL ? 'نجح' : 'Success',
        description: isRTL ? 'تم تحديث المعلم بنجاح' : 'Milestone updated successfully',
      });

      setEditingMilestone(null);
    } catch (error) {
      console.error('Error updating milestone:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحديث المعلم' : 'Failed to update milestone',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    if (!contract?.id) return;

    try {
      await deleteMilestoneMutation.mutateAsync({
        contractId: contract.id,
        milestoneId
      });

      toast({
        title: isRTL ? 'نجح' : 'Success',
        description: isRTL ? 'تم حذف المعلم بنجاح' : 'Milestone deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting milestone:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في حذف المعلم' : 'Failed to delete milestone',
        variant: 'destructive'
      });
    }
  };

  const handleReviewContract = () => {
    if (!isAmountValid) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL 
          ? 'إجمالي مبالغ المعالم يجب أن يساوي إجمالي مبلغ العقد' 
          : 'Total milestone amounts must equal the contract total amount',
        variant: 'destructive'
      });
      return;
    }

    navigate(`/contracts?contractId=${contract?.id}`);
    if (onClose) onClose();
  };

  if (!contract) return null;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className={cn(
        "max-w-4xl max-h-[90vh] overflow-y-auto",
        isRTL && "rtl"
      )}>
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            {isRTL ? 'مراجعة العقد والمعالم' : 'Review Contract & Milestones'}
          </DialogTitle>
          <DialogDescription>
            {isRTL 
              ? 'يرجى مراجعة تفاصيل العقد والمعالم المُنشأة تلقائيًا. يمكنك تحريرها قبل المتابعة.' 
              : 'Please review the auto-generated contract details and milestones. You can edit them before proceeding.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Contract Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'ملخص العقد' : 'Contract Summary'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">
                    {isRTL ? 'العنوان' : 'Title'}
                  </Label>
                  <p className="font-medium">{contract.title}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">
                    {isRTL ? 'المبلغ الإجمالي' : 'Total Amount'}
                  </Label>
                  <p className="font-medium flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {contract.totalAmount.toLocaleString()} {contract.currency}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">
                    {isRTL ? 'تاريخ البداية' : 'Start Date'}
                  </Label>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(contract.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">
                    {isRTL ? 'تاريخ الانتهاء' : 'End Date'}
                  </Label>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(contract.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">
                  {isRTL ? 'الوصف' : 'Description'}
                </Label>
                <p className="text-sm">{contract.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Milestones Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{isRTL ? 'المعالم' : 'Milestones'}</CardTitle>
                  <CardDescription>
                    {isRTL 
                      ? `إجمالي: ${totalMilestoneAmount.toLocaleString()} ${contract.currency}` 
                      : `Total: ${totalMilestoneAmount.toLocaleString()} ${contract.currency}`}
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowAddMilestone(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isRTL ? 'إضافة معلم' : 'Add Milestone'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Amount Validation Warning */}
              {!isAmountValid && milestones.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <p className="text-sm text-amber-800">
                    {isRTL 
                      ? `إجمالي المعالم (${totalMilestoneAmount}) لا يساوي إجمالي العقد (${contract.totalAmount})` 
                      : `Milestone total (${totalMilestoneAmount}) doesn't match contract total (${contract.totalAmount})`}
                  </p>
                </div>
              )}

              {isAmountValid && milestones.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-green-800">
                    {isRTL ? 'المبالغ متطابقة ✓' : 'Amounts match ✓'}
                  </p>
                </div>
              )}

              {/* Existing Milestones */}
              <div className="space-y-3">
                {milestones.map((milestone, index) => (
                  <Card key={milestone.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      {editingMilestone?.id === milestone.id ? (
                        <div className="space-y-3">
                          <Input
                            value={editingMilestone.title}
                            onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                            placeholder={isRTL ? 'عنوان المعلم' : 'Milestone title'}
                          />
                          <Textarea
                            value={editingMilestone.description}
                            onChange={(e) => setEditingMilestone({ ...editingMilestone, description: e.target.value })}
                            placeholder={isRTL ? 'الوصف' : 'Description'}
                            rows={2}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              type="number"
                              step="0.01"
                              value={editingMilestone.amount}
                              onChange={(e) => setEditingMilestone({ ...editingMilestone, amount: parseFloat(e.target.value) })}
                              placeholder={isRTL ? 'المبلغ' : 'Amount'}
                            />
                            <Input
                              type="date"
                              value={editingMilestone.dueDate}
                              onChange={(e) => setEditingMilestone({ ...editingMilestone, dueDate: e.target.value })}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateMilestone(editingMilestone)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {isRTL ? 'حفظ' : 'Save'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingMilestone(null)}
                            >
                              {isRTL ? 'إلغاء' : 'Cancel'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline">{isRTL ? `معلم ${index + 1}` : `Milestone ${index + 1}`}</Badge>
                                <h4 className="font-semibold">{milestone.title}</h4>
                              </div>
                              <p className="text-sm text-gray-600">{milestone.description}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingMilestone(milestone)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteMilestone(milestone.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 font-medium text-green-600">
                              <DollarSign className="h-3 w-3" />
                              {milestone.amount.toLocaleString()} {contract.currency}
                            </span>
                            <span className="flex items-center gap-1 text-gray-600">
                              <Calendar className="h-3 w-3" />
                              {isRTL ? 'الاستحقاق:' : 'Due:'} {new Date(milestone.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Add New Milestone Form */}
              {showAddMilestone && (
                <Card className="border-2 border-dashed border-blue-300">
                  <CardContent className="pt-4 space-y-3">
                    <h4 className="font-semibold">{isRTL ? 'معلم جديد' : 'New Milestone'}</h4>
                    <Input
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                      placeholder={isRTL ? 'عنوان المعلم' : 'Milestone title'}
                    />
                    <Textarea
                      value={newMilestone.description}
                      onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                      placeholder={isRTL ? 'الوصف' : 'Description'}
                      rows={2}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>{isRTL ? 'المبلغ' : 'Amount'}</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newMilestone.amount}
                          onChange={(e) => setNewMilestone({ ...newMilestone, amount: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>{isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}</Label>
                        <Input
                          type="date"
                          value={newMilestone.dueDate}
                          onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleAddMilestone}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isRTL ? 'إضافة' : 'Add'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowAddMilestone(false);
                          setNewMilestone({ title: '', description: '', amount: '', dueDate: '' });
                        }}
                      >
                        {isRTL ? 'إلغاء' : 'Cancel'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {milestones.length === 0 && !showAddMilestone && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{isRTL ? 'لا توجد معالم. أضف واحدة للبدء.' : 'No milestones yet. Add one to get started.'}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              size="lg"
              onClick={handleReviewContract}
              disabled={!isAmountValid || milestones.length === 0}
              className="bg-blue-600 hover:bg-blue-700 min-w-[200px]"
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              {isRTL ? 'مراجعة العقد' : 'Review Contract'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

