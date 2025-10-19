import React, { useState, useEffect } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useToast } from '@/hooks/use-toast';
import { useLocalization } from '@/hooks/useLocalization';
import { config } from '@/config/env';
import { AddPortfolioRequest, PortfolioItem } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, ExternalLink, Github, Calendar, Star, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export const PortfolioManager = () => {
  const { isRTL } = useLocalization();
  const { toast } = useToast();
  const { 
    portfolio, 
    loading, 
    error, 
    addPortfolioItem, 
    updatePortfolioItem, 
    deletePortfolioItem 
  } = usePortfolio();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [viewingItem, setViewingItem] = useState<PortfolioItem | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const [addForm, setAddForm] = useState<AddPortfolioRequest>({
    title: '',
    description: '',
    imageUrls: [],
    projectUrl: '',
    githubUrl: '',
    technologies: '',
    projectDate: '',
    isFeatured: false
  });

  const handleAddPortfolioItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Adding portfolio item with data:', addForm);
      
      // First, upload images if any
      let imageUrls: string[] = [];
      if (uploadedImages.length > 0) {
        console.log('Uploading images...');
        const uploadPromises = uploadedImages.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('category', 'portfolio');
          
           const response = await fetch(`${config.apiBaseUrl}/files/upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error(`Failed to upload ${file.name}`);
          }
          
          const result = await response.json();
          // Construct full URL for the uploaded file
           const baseUrl = config.apiBaseUrl.replace('/api', '');
           return `${baseUrl}${result.fileUrl}`;
        });
        
        imageUrls = await Promise.all(uploadPromises);
        console.log('Uploaded image URLs:', imageUrls);
      }
      
      // Create portfolio item with uploaded image URLs
      const portfolioData = {
        ...addForm,
        imageUrls: imageUrls
      };
      
      await addPortfolioItem(portfolioData);
      toast({
        title: isRTL ? "تمت إضافة المشروع بنجاح" : "Portfolio item added successfully",
        description: isRTL ? "تم إضافة المشروع إلى ملفك الشخصي" : "Portfolio item has been added to your profile",
      });
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      toast({
        title: isRTL ? "خطأ في إضافة المشروع" : "Failed to add portfolio item",
        description: isRTL ? "حدث خطأ أثناء إضافة المشروع" : "An error occurred while adding the portfolio item",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePortfolioItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    
    try {
      await updatePortfolioItem(editingItem.id, addForm);
      toast({
        title: isRTL ? "تم تحديث المشروع بنجاح" : "Portfolio item updated successfully",
        description: isRTL ? "تم تحديث المشروع في ملفك الشخصي" : "Portfolio item has been updated in your profile",
      });
      setIsEditDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في تحديث المشروع" : "Failed to update portfolio item",
        description: isRTL ? "حدث خطأ أثناء تحديث المشروع" : "An error occurred while updating the portfolio item",
        variant: "destructive",
      });
    }
  };

  const handleDeletePortfolioItem = async (itemId: string) => {
    try {
      await deletePortfolioItem(itemId);
      toast({
        title: isRTL ? "تم حذف المشروع بنجاح" : "Portfolio item deleted successfully",
        description: isRTL ? "تم حذف المشروع من ملفك الشخصي" : "Portfolio item has been deleted from your profile",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في حذف المشروع" : "Failed to delete portfolio item",
        description: isRTL ? "حدث خطأ أثناء حذف المشروع" : "An error occurred while deleting the portfolio item",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (item: PortfolioItem) => {
    setEditingItem(item);
    setAddForm({
      title: item.title,
      description: item.description,
      imageUrls: item.imageUrls || [],
      projectUrl: item.projectUrl || '',
      githubUrl: item.githubUrl || '',
      technologies: item.technologies || '',
      projectDate: item.projectDate || '',
      isFeatured: item.isFeatured
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (item: PortfolioItem) => {
    setViewingItem(item);
    setIsViewDialogOpen(true);
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    if (viewingItem?.imageUrls) {
      const index = viewingItem.imageUrls.findIndex(url => url === imageUrl);
      setCurrentImageIndex(index >= 0 ? index : 0);
    }
    setIsImageModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
  };

  const goToPreviousImage = () => {
    if (viewingItem?.imageUrls && viewingItem.imageUrls.length > 0) {
      const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : viewingItem.imageUrls.length - 1;
      setCurrentImageIndex(newIndex);
      setSelectedImage(viewingItem.imageUrls[newIndex]);
    }
  };

  const goToNextImage = () => {
    if (viewingItem?.imageUrls && viewingItem.imageUrls.length > 0) {
      const newIndex = currentImageIndex < viewingItem.imageUrls.length - 1 ? currentImageIndex + 1 : 0;
      setCurrentImageIndex(newIndex);
      setSelectedImage(viewingItem.imageUrls[newIndex]);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isImageModalOpen) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPreviousImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNextImage();
          break;
        case 'Escape':
          event.preventDefault();
          setIsImageModalOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isImageModalOpen, currentImageIndex, viewingItem]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles = files.slice(0, 3 - uploadedImages.length); // Limit to 3 images total
    
    if (newFiles.length === 0) return;
    
    const newUploadedImages = [...uploadedImages, ...newFiles];
    setUploadedImages(newUploadedImages);
    
    // Create preview URLs
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    
    // Don't store file names in the form - we'll upload them when submitting
  };

  const removeImage = (index: number) => {
    const newUploadedImages = uploadedImages.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    
    setUploadedImages(newUploadedImages);
    setImagePreviewUrls(newPreviewUrls);
    
    // Don't modify form imageUrls - we handle uploads separately
  };

  const resetForm = () => {
    setAddForm({
      title: '',
      description: '',
      imageUrls: [],
      projectUrl: '',
      githubUrl: '',
      technologies: '',
      projectDate: '',
      isFeatured: false
    });
    setUploadedImages([]);
    setImagePreviewUrls([]);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? "معرض الأعمال" : "Portfolio"}</CardTitle>
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
            <CardTitle>{isRTL ? "معرض الأعمال" : "Portfolio"}</CardTitle>
            <CardDescription>
              {isRTL ? "عرض مشاريعك وإنجازاتك" : "Showcase your projects and achievements"}
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {isRTL ? "إضافة مشروع" : "Add Project"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{isRTL ? "إضافة مشروع جديد" : "Add New Project"}</DialogTitle>
                <DialogDescription>
                  {isRTL ? "أضف مشروع جديد إلى معرض أعمالك" : "Add a new project to your portfolio"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddPortfolioItem} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">{isRTL ? "عنوان المشروع" : "Project Title"}</Label>
                    <Input
                      id="title"
                      value={addForm.title}
                      onChange={(e) => setAddForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder={isRTL ? "أدخل عنوان المشروع" : "Enter project title"}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectDate">{isRTL ? "تاريخ المشروع" : "Project Date"}</Label>
                    <Input
                      id="projectDate"
                      type="date"
                      value={addForm.projectDate}
                      onChange={(e) => setAddForm(prev => ({ ...prev, projectDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">{isRTL ? "وصف المشروع" : "Project Description"}</Label>
                  <Textarea
                    id="description"
                    value={addForm.description}
                    onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={isRTL ? "وصف مفصل للمشروع" : "Detailed project description"}
                    required
                  />
                </div>
                <div>
                  <Label>{isRTL ? "صور المشروع" : "Project Images"}</Label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="imageUpload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Plus className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">{isRTL ? "انقر لرفع الصور" : "Click to upload images"}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {isRTL ? "PNG, JPG, GIF (حد أقصى 3 صور)" : "PNG, JPG, GIF (max 3 images)"}
                          </p>
                        </div>
                        <input
                          id="imageUpload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadedImages.length >= 3}
                        />
                      </label>
                    </div>
                    
                    {/* Image Previews */}
                    {imagePreviewUrls.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {uploadedImages.length >= 3 && (
                      <p className="text-sm text-orange-600">
                        {isRTL ? "تم الوصول للحد الأقصى من الصور (3)" : "Maximum images reached (3)"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectUrl">{isRTL ? "رابط المشروع" : "Project URL"}</Label>
                    <Input
                      id="projectUrl"
                      value={addForm.projectUrl}
                      onChange={(e) => setAddForm(prev => ({ ...prev, projectUrl: e.target.value }))}
                      placeholder={isRTL ? "رابط المشروع المباشر" : "Live project URL"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="githubUrl">{isRTL ? "رابط GitHub" : "GitHub URL"}</Label>
                    <Input
                      id="githubUrl"
                      value={addForm.githubUrl}
                      onChange={(e) => setAddForm(prev => ({ ...prev, githubUrl: e.target.value }))}
                      placeholder={isRTL ? "رابط مستودع GitHub" : "GitHub repository URL"}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="technologies">{isRTL ? "التقنيات المستخدمة" : "Technologies Used"}</Label>
                  <Input
                    id="technologies"
                    value={addForm.technologies}
                    onChange={(e) => setAddForm(prev => ({ ...prev, technologies: e.target.value }))}
                    placeholder={isRTL ? "React, Node.js, MongoDB..." : "React, Node.js, MongoDB..."}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFeatured"
                    checked={addForm.isFeatured}
                    onCheckedChange={(checked) => setAddForm(prev => ({ ...prev, isFeatured: checked }))}
                  />
                  <Label htmlFor="isFeatured">{isRTL ? "مشروع مميز" : "Featured Project"}</Label>
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
        {portfolio.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {isRTL ? "لا توجد مشاريع مضافة بعد" : "No portfolio items added yet"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item) => {
              console.log('Rendering portfolio item:', item);
              return (
              <Card key={item.id} className="overflow-hidden">
                {item.imageUrls && item.imageUrls.length > 0 && (
                  <div className="aspect-video bg-gray-100 relative">
                    <img
                      src={item.imageUrls[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image failed to load:', item.imageUrls[0]);
                        console.log('Portfolio item:', item);
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', item.imageUrls[0]);
                      }}
                    />
                    {item.imageUrls.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        +{item.imageUrls.length - 1}
                      </div>
                    )}
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      {item.isFeatured && (
                        <Badge variant="default" className="mt-2">
                          <Star className="h-3 w-3 mr-1" />
                          {isRTL ? "مميز" : "Featured"}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openViewDialog(item)}
                        title={isRTL ? "عرض التفاصيل" : "View Details"}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(item)}
                        title={isRTL ? "تعديل" : "Edit"}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePortfolioItem(item.id)}
                        title={isRTL ? "حذف" : "Delete"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {item.description}
                  </CardDescription>
                  
                  {item.technologies && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {item.technologies.split(',').map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    {item.projectDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(item.projectDate)}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {item.projectUrl && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={item.projectUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {item.githubUrl && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={item.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isRTL ? "تعديل المشروع" : "Edit Project"}</DialogTitle>
              <DialogDescription>
                {isRTL ? "تعديل تفاصيل المشروع" : "Update project details"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdatePortfolioItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editTitle">{isRTL ? "عنوان المشروع" : "Project Title"}</Label>
                  <Input
                    id="editTitle"
                    value={addForm.title}
                    onChange={(e) => setAddForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editProjectDate">{isRTL ? "تاريخ المشروع" : "Project Date"}</Label>
                  <Input
                    id="editProjectDate"
                    type="date"
                    value={addForm.projectDate}
                    onChange={(e) => setAddForm(prev => ({ ...prev, projectDate: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editDescription">{isRTL ? "وصف المشروع" : "Project Description"}</Label>
                <Textarea
                  id="editDescription"
                  value={addForm.description}
                  onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>{isRTL ? "صور المشروع" : "Project Images"}</Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="editImageUpload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Plus className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">{isRTL ? "انقر لرفع الصور" : "Click to upload images"}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {isRTL ? "PNG, JPG, GIF (حد أقصى 3 صور)" : "PNG, JPG, GIF (max 3 images)"}
                        </p>
                      </div>
                      <input
                        id="editImageUpload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadedImages.length >= 3}
                      />
                    </label>
                  </div>
                  
                  {/* Image Previews */}
                  {imagePreviewUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {uploadedImages.length >= 3 && (
                    <p className="text-sm text-orange-600">
                      {isRTL ? "تم الوصول للحد الأقصى من الصور (3)" : "Maximum images reached (3)"}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editProjectUrl">{isRTL ? "رابط المشروع" : "Project URL"}</Label>
                  <Input
                    id="editProjectUrl"
                    value={addForm.projectUrl}
                    onChange={(e) => setAddForm(prev => ({ ...prev, projectUrl: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editGithubUrl">{isRTL ? "رابط GitHub" : "GitHub URL"}</Label>
                  <Input
                    id="editGithubUrl"
                    value={addForm.githubUrl}
                    onChange={(e) => setAddForm(prev => ({ ...prev, githubUrl: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editTechnologies">{isRTL ? "التقنيات المستخدمة" : "Technologies Used"}</Label>
                <Input
                  id="editTechnologies"
                  value={addForm.technologies}
                  onChange={(e) => setAddForm(prev => ({ ...prev, technologies: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="editIsFeatured"
                  checked={addForm.isFeatured}
                  onCheckedChange={(checked) => setAddForm(prev => ({ ...prev, isFeatured: checked }))}
                />
                <Label htmlFor="editIsFeatured">{isRTL ? "مشروع مميز" : "Featured Project"}</Label>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {isRTL ? "حفظ التغييرات" : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Details Modal */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {viewingItem?.title}
                {viewingItem?.isFeatured && (
                  <Badge variant="default" className="bg-blue-500">
                    <Star className="h-3 w-3 mr-1" />
                    {isRTL ? "مميز" : "Featured"}
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            
            {viewingItem && (
              <div className="space-y-6">
                {/* Images Gallery */}
                {viewingItem.imageUrls && viewingItem.imageUrls.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{isRTL ? "الصور" : "Images"}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {viewingItem.imageUrls.map((imageUrl, index) => (
                        <div key={index} className="relative group cursor-pointer">
                          <img
                            src={imageUrl}
                            alt={`${viewingItem.title} - Image ${index + 1}`}
                            className="w-full h-64 object-cover rounded-lg border"
                            onClick={() => openImageModal(imageUrl)}
                            onError={(e) => {
                              console.error('Image failed to load in modal:', imageUrl);
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              onClick={() => openImageModal(imageUrl)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              {isRTL ? "عرض بالحجم الكامل" : "View Full Size"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{isRTL ? "تفاصيل المشروع" : "Project Details"}</h3>
                  
                  <div>
                    <h4 className="font-medium mb-2">{isRTL ? "الوصف" : "Description"}</h4>
                    <p className="text-gray-600 leading-relaxed">{viewingItem.description}</p>
                  </div>

                  {viewingItem.technologies && (
                    <div>
                      <h4 className="font-medium mb-2">{isRTL ? "التقنيات المستخدمة" : "Technologies Used"}</h4>
                      <div className="flex flex-wrap gap-2">
                        {viewingItem.technologies.split(',').map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {tech.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {viewingItem.projectDate && (
                    <div>
                      <h4 className="font-medium mb-2">{isRTL ? "تاريخ المشروع" : "Project Date"}</h4>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {formatDate(viewingItem.projectDate)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Links */}
                {(viewingItem.projectUrl || viewingItem.githubUrl) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{isRTL ? "الروابط" : "Links"}</h3>
                    <div className="flex flex-wrap gap-3">
                      {viewingItem.projectUrl && (
                        <Button variant="outline" asChild>
                          <a href={viewingItem.projectUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            {isRTL ? "عرض المشروع" : "View Project"}
                          </a>
                        </Button>
                      )}
                      {viewingItem.githubUrl && (
                        <Button variant="outline" asChild>
                          <a href={viewingItem.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-2" />
                            {isRTL ? "عرض الكود" : "View Code"}
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {isRTL ? "تم الإنشاء:" : "Created:"} {viewingItem.createdAt ? formatDate(viewingItem.createdAt) : 'N/A'}
                    </span>
                    {viewingItem.updatedAt && viewingItem.updatedAt !== viewingItem.createdAt && (
                      <span>
                        {isRTL ? "آخر تحديث:" : "Last updated:"} {formatDate(viewingItem.updatedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Image Lightbox Modal */}
        <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
          <DialogContent className="max-w-7xl max-h-[95vh] p-0 bg-black/95 border-none">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={() => setIsImageModalOpen(false)}
              >
                ✕
              </Button>
              
              {/* Navigation Arrows - Only show if there are multiple images */}
              {viewingItem?.imageUrls && viewingItem.imageUrls.length > 1 && (
                <>
                  {/* Previous Button */}
                  <Button
                    variant="ghost"
                    size="lg"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20 p-3"
                    onClick={goToPreviousImage}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  
                  {/* Next Button */}
                  <Button
                    variant="ghost"
                    size="lg"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20 p-3"
                    onClick={goToNextImage}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}
              
              {/* Full Size Image */}
              <img
                src={selectedImage}
                alt="Full size view"
                className="max-w-full max-h-[90vh] object-contain"
                onError={(e) => {
                  console.error('Image failed to load in lightbox:', selectedImage);
                }}
              />
              
              {/* Image Info */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm">
                      {isRTL ? "اضغط خارج الصورة للإغلاق" : "Click outside image to close"}
                    </span>
                    {viewingItem?.imageUrls && viewingItem.imageUrls.length > 1 && (
                      <span className="text-sm">
                        {currentImageIndex + 1} / {viewingItem.imageUrls.length}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => window.open(selectedImage, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {isRTL ? "فتح في تبويب جديد" : "Open in New Tab"}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
