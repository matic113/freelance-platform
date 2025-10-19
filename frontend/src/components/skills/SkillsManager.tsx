import React, { useState } from 'react';
import { useSkills } from '@/hooks/useSkills';
import { useToast } from '@/hooks/use-toast';
import { useLocalization } from '@/hooks/useLocalization';
import { AddSkillRequest, UpdateSkillRequest } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Star } from 'lucide-react';

export const SkillsManager = () => {
  const { isRTL } = useLocalization();
  const { toast } = useToast();
  const { 
    userSkills, 
    skills, 
    categories, 
    loading, 
    error, 
    addSkill, 
    updateSkill, 
    removeSkill, 
    searchSkills 
  } = useSkills();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [addForm, setAddForm] = useState<AddSkillRequest>({
    skillName: '',
    proficiencyLevel: 1,
    description: ''
  });

  const [editForm, setEditForm] = useState<UpdateSkillRequest>({
    proficiencyLevel: 1,
    description: ''
  });

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addSkill(addForm);
      toast({
        title: isRTL ? "تمت إضافة المهارة بنجاح" : "Skill added successfully",
        description: isRTL ? "تم إضافة المهارة إلى ملفك الشخصي" : "Skill has been added to your profile",
      });
      setIsAddDialogOpen(false);
      setAddForm({ skillName: '', proficiencyLevel: 1, description: '' });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في إضافة المهارة" : "Failed to add skill",
        description: isRTL ? "حدث خطأ أثناء إضافة المهارة" : "An error occurred while adding the skill",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    
    try {
      await updateSkill(editingSkill.id, editForm);
      toast({
        title: isRTL ? "تم تحديث المهارة بنجاح" : "Skill updated successfully",
        description: isRTL ? "تم تحديث المهارة في ملفك الشخصي" : "Skill has been updated in your profile",
      });
      setIsEditDialogOpen(false);
      setEditingSkill(null);
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في تحديث المهارة" : "Failed to update skill",
        description: isRTL ? "حدث خطأ أثناء تحديث المهارة" : "An error occurred while updating the skill",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    try {
      await removeSkill(skillId);
      toast({
        title: isRTL ? "تم حذف المهارة بنجاح" : "Skill removed successfully",
        description: isRTL ? "تم حذف المهارة من ملفك الشخصي" : "Skill has been removed from your profile",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في حذف المهارة" : "Failed to remove skill",
        description: isRTL ? "حدث خطأ أثناء حذف المهارة" : "An error occurred while removing the skill",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    searchSkills(value);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    // Filter skills by category logic would go here
  };

  const openEditDialog = (skill: any) => {
    setEditingSkill(skill);
    setEditForm({
      proficiencyLevel: skill.proficiencyLevel,
      description: skill.description || ''
    });
    setIsEditDialogOpen(true);
  };

  const getProficiencyStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < level ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? "المهارات" : "Skills"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">{isRTL ? "جاري التحميل..." : "Loading..."}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{isRTL ? "المهارات" : "Skills"}</CardTitle>
            <CardDescription>
              {isRTL ? "إدارة مهاراتك ومستوى الإتقان" : "Manage your skills and proficiency levels"}
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {isRTL ? "إضافة مهارة" : "Add Skill"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isRTL ? "إضافة مهارة جديدة" : "Add New Skill"}</DialogTitle>
                <DialogDescription>
                  {isRTL ? "أضف مهارة جديدة إلى ملفك الشخصي" : "Add a new skill to your profile"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSkill} className="space-y-4">
                <div>
                  <Label htmlFor="skillName">{isRTL ? "اسم المهارة" : "Skill Name"}</Label>
                  <Input
                    id="skillName"
                    value={addForm.skillName}
                    onChange={(e) => setAddForm(prev => ({ ...prev, skillName: e.target.value }))}
                    placeholder={isRTL ? "أدخل اسم المهارة" : "Enter skill name"}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="proficiencyLevel">{isRTL ? "مستوى الإتقان" : "Proficiency Level"}</Label>
                  <Select
                    value={addForm.proficiencyLevel.toString()}
                    onValueChange={(value) => setAddForm(prev => ({ ...prev, proficiencyLevel: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? "اختر مستوى الإتقان" : "Select proficiency level"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{isRTL ? "مبتدئ (1)" : "Beginner (1)"}</SelectItem>
                      <SelectItem value="2">{isRTL ? "متوسط منخفض (2)" : "Low Intermediate (2)"}</SelectItem>
                      <SelectItem value="3">{isRTL ? "متوسط (3)" : "Intermediate (3)"}</SelectItem>
                      <SelectItem value="4">{isRTL ? "متقدم (4)" : "Advanced (4)"}</SelectItem>
                      <SelectItem value="5">{isRTL ? "خبير (5)" : "Expert (5)"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">{isRTL ? "الوصف (اختياري)" : "Description (Optional)"}</Label>
                  <Textarea
                    id="description"
                    value={addForm.description}
                    onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={isRTL ? "وصف مختصر للمهارة" : "Brief description of the skill"}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {isRTL ? "إضافة" : "Add"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder={isRTL ? "البحث في المهارات..." : "Search skills..."}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1"
          />
          <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={isRTL ? "جميع الفئات" : "All Categories"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? "جميع الفئات" : "All Categories"}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Skills List */}
        {userSkills.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {isRTL ? "لا توجد مهارات مضافة بعد" : "No skills added yet"}
          </div>
        ) : (
          <div className="space-y-4">
            {userSkills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{skill.skill.name}</h3>
                    {skill.skill.category && (
                      <Badge variant="secondary">{skill.skill.category}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {getProficiencyStars(skill.proficiencyLevel)}
                    <span className="text-sm text-gray-600">
                      {isRTL ? "مستوى الإتقان" : "Proficiency"}: {skill.proficiencyLevel}/5
                    </span>
                  </div>
                  {skill.description && (
                    <p className="text-sm text-gray-600">{skill.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(skill)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveSkill(skill.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isRTL ? "تعديل المهارة" : "Edit Skill"}</DialogTitle>
              <DialogDescription>
                {isRTL ? "تعديل مستوى الإتقان والوصف" : "Update proficiency level and description"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateSkill} className="space-y-4">
              <div>
                <Label htmlFor="editProficiencyLevel">{isRTL ? "مستوى الإتقان" : "Proficiency Level"}</Label>
                <Select
                  value={editForm.proficiencyLevel.toString()}
                  onValueChange={(value) => setEditForm(prev => ({ ...prev, proficiencyLevel: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? "اختر مستوى الإتقان" : "Select proficiency level"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{isRTL ? "مبتدئ (1)" : "Beginner (1)"}</SelectItem>
                    <SelectItem value="2">{isRTL ? "متوسط منخفض (2)" : "Low Intermediate (2)"}</SelectItem>
                    <SelectItem value="3">{isRTL ? "متوسط (3)" : "Intermediate (3)"}</SelectItem>
                    <SelectItem value="4">{isRTL ? "متقدم (4)" : "Advanced (4)"}</SelectItem>
                    <SelectItem value="5">{isRTL ? "خبير (5)" : "Expert (5)"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editDescription">{isRTL ? "الوصف" : "Description"}</Label>
                <Textarea
                  id="editDescription"
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={isRTL ? "وصف مختصر للمهارة" : "Brief description of the skill"}
                />
              </div>
              <DialogFooter>
                <Button type="submit">
                  {isRTL ? "حفظ التغييرات" : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
