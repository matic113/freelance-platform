import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Calendar,
  DollarSign,
  AlertCircle,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { ContractResponse, MilestoneResponse } from '@/types/contract';
import { cn } from '@/lib/utils';
import { contractService } from '@/services/contract.service';

interface ContractCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: ContractResponse | null;
  onSendToFreelancer: (contractId: string) => Promise<void>;
  isRTL?: boolean;
}

export const ContractCreationModal: React.FC<ContractCreationModalProps> = ({
  isOpen,
  onClose,
  contract,
  onSendToFreelancer,
  isRTL = false,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<MilestoneResponse | null>(null);
  const [milestones, setMilestones] = useState<MilestoneResponse[]>([]);
  const [isAddMilestoneExpanded, setIsAddMilestoneExpanded] = useState(false);
  const [milestoneErrors, setMilestoneErrors] = useState<{
    title?: string;
    description?: string;
    amount?: string;
    dueDate?: string;
  }>({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    totalAmount: 0,
  });

  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    amount: '',
    dueDate: '',
  });

  useEffect(() => {
    if (contract && isOpen) {
      setFormData({
        title: contract.title,
        description: contract.description,
        startDate: contract.startDate,
        endDate: contract.endDate,
        totalAmount: contract.totalAmount,
      });
      setMilestones(contract.milestones || []);
      setIsEditing(false);
    }
  }, [contract, isOpen]);

  const validateMilestone = () => {
    const errors: {
      title?: string;
      description?: string;
      amount?: string;
      dueDate?: string;
    } = {};
    if (!newMilestone.title.trim()) {
      errors.title = isRTL ? 'العنوان مطلوب' : 'Title is required';
    }
    if (!newMilestone.description.trim()) {
      errors.description = isRTL ? 'الوصف مطلوب' : 'Description is required';
    }
    if (!newMilestone.amount || parseFloat(newMilestone.amount) <= 0) {
      errors.amount = isRTL ? 'المبلغ مطلوب وأكبر من صفر' : 'Amount is required and must be greater than 0';
    }
    if (!newMilestone.dueDate) {
      errors.dueDate = isRTL ? 'الموعد مطلوب' : 'Due Date is required';
    }
    return errors;
  };

  const handleAddMilestone = async () => {
    const errors = validateMilestone();
    setMilestoneErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    if (!contract) return;

    try {
      const milestone = await contractService.createMilestone(contract.id, {
        title: newMilestone.title,
        description: newMilestone.description,
        amount: parseFloat(newMilestone.amount),
        dueDate: newMilestone.dueDate,
        orderIndex: milestones.length + 1,
      });

      setMilestones([...milestones, milestone]);
      setNewMilestone({
        title: '',
        description: '',
        amount: '',
        dueDate: '',
      });
      setMilestoneErrors({});
    } catch (error) {
      console.error('Error adding milestone:', error);
    }
  };

  const handleUpdateMilestone = async (milestone: MilestoneResponse) => {
    if (!contract) return;

    try {
      const updated = await contractService.updateMilestone(contract.id, milestone.id, {
        title: milestone.title,
        description: milestone.description,
        amount: milestone.amount,
        dueDate: milestone.dueDate,
        orderIndex: milestone.orderIndex,
      });

      setMilestones(milestones.map((m) => (m.id === updated.id ? updated : m)));
      setEditingMilestone(null);
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    if (!contract) return;

    try {
      await contractService.deleteMilestone(contract.id, milestoneId);
      setMilestones(milestones.filter((m) => m.id !== milestoneId));
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };

  const handleSendToFreelancer = async () => {
    if (!contract) return;

    setIsSending(true);
    try {
      await onSendToFreelancer(contract.id);
    } finally {
      setIsSending(false);
    }
  };

  const totalMilestonesAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
  const amountDifference = formData.totalAmount - totalMilestonesAmount;

  if (!contract) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isRTL ? 'إنشاء العقد' : 'Create Contract'}
          </DialogTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">
              {isRTL ? 'حالة: مسودة' : 'Status: Draft'}
            </Badge>
            <Badge>
              {contract.freelancerName}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">
                {isRTL ? 'نظرة عامة' : 'Overview'}
              </TabsTrigger>
              <TabsTrigger value="milestones">
                {isRTL ? 'المراحل' : 'Milestones'} ({milestones.length})
              </TabsTrigger>
              <TabsTrigger value="preview">
                {isRTL ? 'معاينة' : 'Preview'}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {isRTL ? 'تفاصيل العقد' : 'Contract Details'}
                    </CardTitle>
                    <Button
                      size="sm"
                      variant={isEditing ? 'default' : 'outline'}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {isRTL ? 'تم' : 'Done'}
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          {isRTL ? 'تعديل' : 'Edit'}
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contractTitle">
                      {isRTL ? 'عنوان العقد' : 'Contract Title'}
                    </Label>
                    <Input
                      id="contractTitle"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder={isRTL ? 'أدخل عنوان العقد' : 'Enter contract title'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contractDescription">
                      {isRTL ? 'وصف العقد' : 'Contract Description'}
                    </Label>
                    <Textarea
                      id="contractDescription"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder={isRTL ? 'أدخل وصف العقد' : 'Enter contract description'}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">
                        {isRTL ? 'تاريخ البدء' : 'Start Date'}
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({ ...formData, startDate: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">
                        {isRTL ? 'تاريخ الانتهاء' : 'End Date'}
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalAmount">
                        {isRTL ? 'الإجمالي' : 'Total Amount'}
                      </Label>
                      <Input
                        id="totalAmount"
                        type="number"
                        value={formData.totalAmount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            totalAmount: parseFloat(e.target.value) || 0,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className={cn("text-sm font-medium mb-2", isRTL && "text-right")}>
                      {isRTL ? 'معلومات الطرفين' : 'Party Information'}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">{isRTL ? 'العميل' : 'Client'}</p>
                        <p className="font-semibold">{contract.clientName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">{isRTL ? 'المستقل' : 'Freelancer'}</p>
                        <p className="font-semibold">{contract.freelancerName}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

             {/* Milestones Tab */}
             <TabsContent value="milestones" className="space-y-4">
               <Card>
                 <CardHeader>
                   <CardTitle>
                     {isRTL ? 'إدارة المراحل' : 'Manage Milestones'}
                   </CardTitle>
                   <CardDescription>
                     {isRTL
                       ? 'أضف وعدّل المراحل التي تشكل العقد'
                       : 'Add and edit the milestones that make up the contract'}
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   {/* Milestones List */}
                   <div className="space-y-3">
                     {milestones.length === 0 ? (
                       <div className={cn("text-center py-8 text-gray-500", isRTL && "text-right")}>
                         <p>{isRTL ? 'لا توجد مراحل بعد' : 'No milestones yet'}</p>
                       </div>
                     ) : (
                       milestones.map((milestone, index) => (
                         <div
                           key={milestone.id}
                           className={cn(
                             "p-3 border rounded-lg hover:bg-gray-50 transition-colors",
                             isRTL && "text-right"
                           )}
                         >
                           {editingMilestone?.id === milestone.id ? (
                             <div className="space-y-3">
                               <Input
                                 value={editingMilestone.title}
                                 onChange={(e) =>
                                   setEditingMilestone({
                                     ...editingMilestone,
                                     title: e.target.value,
                                   })
                                 }
                                 placeholder="Title"
                               />
                               <Textarea
                                 value={editingMilestone.description}
                                 onChange={(e) =>
                                   setEditingMilestone({
                                     ...editingMilestone,
                                     description: e.target.value,
                                   })
                                 }
                                 placeholder="Description"
                                 rows={2}
                               />
                               <div className="grid grid-cols-2 gap-2">
                                 <Input
                                   type="number"
                                   value={editingMilestone.amount}
                                   onChange={(e) =>
                                     setEditingMilestone({
                                       ...editingMilestone,
                                       amount: parseFloat(e.target.value) || 0,
                                     })
                                   }
                                   placeholder="Amount"
                                 />
                                 <Input
                                   type="date"
                                   value={editingMilestone.dueDate}
                                   onChange={(e) =>
                                     setEditingMilestone({
                                       ...editingMilestone,
                                       dueDate: e.target.value,
                                     })
                                   }
                                 />
                               </div>
                               <div className="flex gap-2">
                                 <Button
                                   size="sm"
                                   onClick={() => handleUpdateMilestone(editingMilestone)}
                                   className="flex-1"
                                 >
                                   {isRTL ? 'حفظ' : 'Save'}
                                 </Button>
                                 <Button
                                   size="sm"
                                   variant="outline"
                                   onClick={() => setEditingMilestone(null)}
                                   className="flex-1"
                                 >
                                   {isRTL ? 'إلغاء' : 'Cancel'}
                                 </Button>
                               </div>
                             </div>
                           ) : (
                             <div className="flex items-start justify-between">
                               <div className="flex-1 min-w-0">
                                 <div className={cn("flex items-center gap-2 mb-1", isRTL && "flex-row-reverse")}>
                                   <Badge variant="outline" className="text-xs">
                                     {isRTL ? 'المرحلة' : 'Stage'} {index + 1}
                                   </Badge>
                                   <h5 className="font-semibold text-sm">{milestone.title}</h5>
                                 </div>
                                 <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                                 <div className={cn("flex gap-4 text-xs text-gray-500", isRTL && "flex-row-reverse")}>
                                   <span className="flex items-center gap-1">
                                     <DollarSign className="h-3 w-3" />
                                     {milestone.amount} {contract.currency}
                                   </span>
                                   <span className="flex items-center gap-1">
                                     <Calendar className="h-3 w-3" />
                                     {milestone.dueDate}
                                   </span>
                                 </div>
                               </div>
                               <div className="flex gap-1 ml-2">
                                 <Button
                                   size="sm"
                                   variant="ghost"
                                   onClick={() => setEditingMilestone(milestone)}
                                 >
                                   <Edit className="h-3 w-3" />
                                 </Button>
                                 <Button
                                   size="sm"
                                   variant="ghost"
                                   onClick={() => handleDeleteMilestone(milestone.id)}
                                 >
                                   <Trash2 className="h-3 w-3 text-red-600" />
                                 </Button>
                               </div>
                             </div>
                           )}
                         </div>
                       ))
                     )}
                   </div>

                   <Separator />

                   {/* Add Milestone Form - Collapsed */}
                   <div className="space-y-3">
                     <button
                       onClick={() => setIsAddMilestoneExpanded(!isAddMilestoneExpanded)}
                       className={cn(
                         "w-full flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors",
                         isRTL && "flex-row-reverse"
                       )}
                     >
                       <h4 className="font-semibold">
                         {isRTL ? 'إضافة مرحلة جديدة' : 'Add New Milestone'}
                       </h4>
                       <ChevronDown
                         className={cn(
                           "h-5 w-5 transition-transform",
                           isAddMilestoneExpanded && "rotate-180"
                         )}
                       />
                     </button>

                     {isAddMilestoneExpanded && (
                       <div className={cn("p-4 border rounded-lg bg-gray-50", isRTL && "text-right")}>
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="milestoneTitle" className="text-sm font-medium">
                                {isRTL ? 'العنوان' : 'Title'} <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="milestoneTitle"
                                value={newMilestone.title}
                                onChange={(e) =>
                                  setNewMilestone({
                                    ...newMilestone,
                                    title: e.target.value,
                                  })
                                }
                                placeholder={isRTL ? 'عنوان المرحلة' : 'Milestone title'}
                                className={cn(milestoneErrors.title && 'border-red-500 focus:border-red-500')}
                              />
                              {milestoneErrors.title && (
                                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                                  <AlertCircle className="h-3 w-3" />
                                  <span>{milestoneErrors.title}</span>
                                </div>
                              )}
                            </div>

                            <div>
                              <Label htmlFor="milestoneDescription" className="text-sm font-medium">
                                {isRTL ? 'الوصف' : 'Description'} <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="milestoneDescription"
                                value={newMilestone.description}
                                onChange={(e) =>
                                  setNewMilestone({
                                    ...newMilestone,
                                    description: e.target.value,
                                  })
                                }
                                placeholder={isRTL ? 'وصف المرحلة' : 'Milestone description'}
                                rows={2}
                                className={cn(milestoneErrors.description && 'border-red-500 focus:border-red-500')}
                              />
                              {milestoneErrors.description && (
                                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                                  <AlertCircle className="h-3 w-3" />
                                  <span>{milestoneErrors.description}</span>
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor="milestoneAmount" className="text-sm font-medium">
                                  {isRTL ? 'المبلغ' : 'Amount'} <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="milestoneAmount"
                                  type="number"
                                  value={newMilestone.amount}
                                  onChange={(e) =>
                                    setNewMilestone({
                                      ...newMilestone,
                                      amount: e.target.value,
                                    })
                                  }
                                  placeholder={isRTL ? 'المبلغ' : 'Amount'}
                                  className={cn(milestoneErrors.amount && 'border-red-500 focus:border-red-500')}
                                />
                                {milestoneErrors.amount && (
                                  <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                                    <AlertCircle className="h-3 w-3" />
                                    <span>{milestoneErrors.amount}</span>
                                  </div>
                                )}
                              </div>

                              <div>
                                <Label htmlFor="milestoneDueDate" className="text-sm font-medium">
                                  {isRTL ? 'الموعد' : 'Due Date'} <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="milestoneDueDate"
                                  type="date"
                                  value={newMilestone.dueDate}
                                  onChange={(e) =>
                                    setNewMilestone({
                                      ...newMilestone,
                                      dueDate: e.target.value,
                                    })
                                  }
                                  className={cn(milestoneErrors.dueDate && 'border-red-500 focus:border-red-500')}
                                />
                                {milestoneErrors.dueDate && (
                                  <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                                    <AlertCircle className="h-3 w-3" />
                                    <span>{milestoneErrors.dueDate}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                           <Button
                             onClick={handleAddMilestone}
                             className="w-full"
                             disabled={
                               !newMilestone.title ||
                               !newMilestone.description ||
                               !newMilestone.amount ||
                               !newMilestone.dueDate
                             }
                           >
                             <Plus className="h-4 w-4 mr-2" />
                             {isRTL ? 'إضافة مرحلة' : 'Add Milestone'}
                           </Button>
                         </div>
                       </div>
                     )}
                   </div>

                  {/* Amount Summary */}
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className={cn("flex justify-between text-sm", isRTL && "flex-row-reverse")}>
                      <span>{isRTL ? 'إجمالي المراحل' : 'Total Milestones'}</span>
                      <span className="font-semibold">
                        {totalMilestonesAmount} {contract.currency}
                      </span>
                    </div>
                    <div className={cn("flex justify-between text-sm", isRTL && "flex-row-reverse")}>
                      <span>{isRTL ? 'إجمالي العقد' : 'Contract Total'}</span>
                      <span className="font-semibold">
                        {formData.totalAmount} {contract.currency}
                      </span>
                    </div>
                    {amountDifference !== 0 && (
                      <div
                        className={cn(
                          "flex justify-between text-sm p-2 rounded bg-yellow-50",
                          amountDifference > 0 ? 'text-yellow-700' : 'text-orange-700',
                          isRTL && "flex-row-reverse"
                        )}
                      >
                        <span>{isRTL ? 'الفرق' : 'Difference'}</span>
                        <span className="font-semibold">
                          {amountDifference > 0 ? '+' : ''}{amountDifference} {contract.currency}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'معاينة العقد' : 'Contract Preview'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={cn("space-y-3", isRTL && "text-right")}>
                    <div>
                      <p className="text-sm text-gray-600">{isRTL ? 'العنوان' : 'Title'}</p>
                      <p className="font-semibold">{formData.title}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">{isRTL ? 'الوصف' : 'Description'}</p>
                      <p className="text-sm whitespace-pre-wrap">{formData.description}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">{isRTL ? 'البدء' : 'Start'}</p>
                        <p className="font-semibold">{formData.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{isRTL ? 'الانتهاء' : 'End'}</p>
                        <p className="font-semibold">{formData.endDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{isRTL ? 'الإجمالي' : 'Total'}</p>
                        <p className="font-semibold">
                          {formData.totalAmount} {contract.currency}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className={cn("font-semibold mb-3", isRTL && "text-right")}>
                      {isRTL ? 'المراحل' : 'Milestones'}
                    </h4>
                    <div className="space-y-2">
                      {milestones.map((milestone, index) => (
                        <div
                          key={milestone.id}
                          className={cn("p-3 bg-gray-50 rounded-lg", isRTL && "text-right")}
                        >
                          <div className={cn("flex justify-between items-start mb-1", isRTL && "flex-row-reverse")}>
                            <div>
                              <p className="text-sm font-semibold">{milestone.title}</p>
                              <p className="text-xs text-gray-600">{milestone.description}</p>
                            </div>
                            <Badge variant="outline">#{index + 1}</Badge>
                          </div>
                          <div className={cn("flex justify-between text-xs text-gray-600 mt-2", isRTL && "flex-row-reverse")}>
                            <span>{milestone.dueDate}</span>
                            <span className="font-semibold">
                              {milestone.amount} {contract.currency}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {amountDifference !== 0 && (
                    <div className={cn("p-3 rounded-lg bg-yellow-50 border border-yellow-200", isRTL && "text-right")}>
                      <div className="flex gap-2 items-start">
                        <AlertCircle className="h-4 w-4 text-yellow-700 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-yellow-700">
                          {amountDifference > 0
                            ? isRTL
                              ? `تحذير: يوجد ${amountDifference} ${contract.currency} غير مخصصة في المراحل`
                              : `Warning: ${amountDifference} ${contract.currency} is not allocated to milestones`
                            : isRTL
                            ? `تحذير: المراحل تتجاوز الإجمالي بـ ${Math.abs(amountDifference)} ${contract.currency}`
                            : `Warning: Milestones exceed total by ${Math.abs(amountDifference)} ${contract.currency}`}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t justify-between">
            <Button variant="outline" onClick={onClose}>
              {isRTL ? 'إغلاق' : 'Close'}
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
              >
                {isRTL ? 'حفظ كمسودة' : 'Save as Draft'}
              </Button>
              <Button
                onClick={handleSendToFreelancer}
                disabled={isSending || milestones.length === 0 || amountDifference !== 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isRTL ? 'جاري الإرسال...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    {isRTL ? 'إرسال للمستقل' : 'Send to Freelancer'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
