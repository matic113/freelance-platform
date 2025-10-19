import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { useLocalization } from '@/hooks/useLocalization';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List, 
  FolderOpen, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  Download, 
  Eye, 
  Trash2, 
  Share2, 
  MoreVertical,
  Plus,
  Folder,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FilePdf,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  Cloud,
  CloudOff,
  RefreshCw,
  Settings,
  Star,
  Clock,
  User,
  Tag,
  Calendar,
  HardDrive,
  Database,
  Server,
  Wifi,
  WifiOff,
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Zap,
  Shield,
  Globe,
  Lock,
  Unlock
} from 'lucide-react';
import FileUpload, { FileUploadItem, FileUploadConfig } from '@/components/ui/FileUpload';

export default function FileManagementPage() {
  const { isRTL, toggleLanguage } = useLocalization();
  const [activeTab, setActiveTab] = useState('upload');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Mock file data
  const [files, setFiles] = useState<FileUploadItem[]>([
    {
      id: '1',
      file: new File([''], 'project-proposal.pdf'),
      name: 'project-proposal.pdf',
      size: 2048576,
      type: 'application/pdf',
      status: 'completed',
      progress: 100,
      url: '#',
      uploadedAt: new Date('2025-01-15'),
      metadata: { pages: 15 }
    },
    {
      id: '2',
      file: new File([''], 'design-mockup.png'),
      name: 'design-mockup.png',
      size: 1536000,
      type: 'image/png',
      status: 'completed',
      progress: 100,
      url: '#',
      uploadedAt: new Date('2025-01-14'),
      metadata: { width: 1920, height: 1080 }
    },
    {
      id: '3',
      file: new File([''], 'presentation.pptx'),
      name: 'presentation.pptx',
      size: 5242880,
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      status: 'completed',
      progress: 100,
      url: '#',
      uploadedAt: new Date('2025-01-13'),
      metadata: { pages: 25 }
    },
    {
      id: '4',
      file: new File([''], 'video-demo.mp4'),
      name: 'video-demo.mp4',
      size: 52428800,
      type: 'video/mp4',
      status: 'completed',
      progress: 100,
      url: '#',
      uploadedAt: new Date('2025-01-12'),
      metadata: { duration: 300, width: 1920, height: 1080 }
    },
    {
      id: '5',
      file: new File([''], 'code-snippet.js'),
      name: 'code-snippet.js',
      size: 8192,
      type: 'application/javascript',
      status: 'completed',
      progress: 100,
      url: '#',
      uploadedAt: new Date('2025-01-11'),
      metadata: {}
    }
  ]);

  const [folders, setFolders] = useState([
    {
      id: '1',
      name: isRTL ? 'مشاريع العمل' : 'Work Projects',
      fileCount: 12,
      size: 52428800,
      createdAt: new Date('2025-01-10'),
      isStarred: true
    },
    {
      id: '2',
      name: isRTL ? 'المراجع' : 'References',
      fileCount: 8,
      size: 15728640,
      createdAt: new Date('2025-01-09'),
      isStarred: false
    },
    {
      id: '3',
      name: isRTL ? 'النسخ الاحتياطية' : 'Backups',
      fileCount: 5,
      size: 104857600,
      createdAt: new Date('2025-01-08'),
      isStarred: false
    }
  ]);

  const uploadConfig: FileUploadConfig = {
    maxFiles: 20,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      'image/*',
      'application/pdf',
      'text/*',
      'video/*',
      'audio/*',
      'application/vnd.openxmlformats-officedocument.*',
      'application/vnd.ms-office.*'
    ],
    allowedExtensions: [
      '.jpg', '.jpeg', '.png', '.gif', '.svg',
      '.pdf',
      '.txt', '.md', '.doc', '.docx',
      '.mp4', '.avi', '.mov', '.wmv',
      '.mp3', '.wav', '.flac',
      '.zip', '.rar', '.7z',
      '.xlsx', '.xls', '.pptx', '.ppt',
      '.js', '.ts', '.html', '.css', '.json'
    ],
    multiple: true,
    dragAndDrop: true,
    showPreview: true,
    showProgress: true,
    autoUpload: false,
    chunkSize: 1024 * 1024, // 1MB
    retryAttempts: 3
  };

  const getFileIcon = (fileType: string, fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (fileType.startsWith('image/')) {
      return <FileImage className="h-8 w-8 text-green-500" />;
    } else if (fileType.startsWith('video/')) {
      return <FileVideo className="h-8 w-8 text-purple-500" />;
    } else if (fileType.startsWith('audio/')) {
      return <FileAudio className="h-8 w-8 text-blue-500" />;
    } else if (fileType === 'application/pdf') {
      return <FilePdf className="h-8 w-8 text-red-500" />;
    } else if (fileType.includes('spreadsheet') || extension === 'xlsx' || extension === 'xls') {
      return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
    } else if (fileType.includes('code') || extension === 'js' || extension === 'ts' || extension === 'html' || extension === 'css') {
      return <FileCode className="h-8 w-8 text-orange-500" />;
    } else if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) {
      return <FileArchive className="h-8 w-8 text-yellow-500" />;
    } else {
      return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (fileType: string) => {
    if (fileType.startsWith('image/')) return isRTL ? 'صورة' : 'Image';
    if (fileType.startsWith('video/')) return isRTL ? 'فيديو' : 'Video';
    if (fileType.startsWith('audio/')) return isRTL ? 'صوت' : 'Audio';
    if (fileType === 'application/pdf') return 'PDF';
    if (fileType.includes('spreadsheet')) return isRTL ? 'جدول بيانات' : 'Spreadsheet';
    if (fileType.includes('code')) return isRTL ? 'كود' : 'Code';
    if (fileType.includes('zip')) return isRTL ? 'أرشيف' : 'Archive';
    return isRTL ? 'مستند' : 'Document';
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || getFileType(file.type) === typeFilter;
    const matchesStatus = statusFilter === 'all' || file.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleFilesChange = (newFiles: FileUploadItem[]) => {
    setFiles(newFiles);
  };

  const handleUpload = async (filesToUpload: FileUploadItem[]) => {
    // Simulate upload process
    console.log('Uploading files:', filesToUpload);
    // In a real app, this would upload to a server
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };

  const handleRemove = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleRetry = (fileId: string) => {
    console.log('Retrying upload for file:', fileId);
  };

  const getStorageStats = () => {
    const totalFiles = files.length;
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const completedFiles = files.filter(f => f.status === 'completed').length;
    const errorFiles = files.filter(f => f.status === 'error').length;
    
    return {
      totalFiles,
      totalSize,
      completedFiles,
      errorFiles,
      usedSpace: totalSize,
      availableSpace: 100 * 1024 * 1024 * 1024 - totalSize // 100GB - used
    };
  };

  const stats = getStorageStats();

  return (
    <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
            {isRTL ? "إدارة الملفات" : "File Management"}
          </h1>
          <p className="text-muted-foreground">
            {isRTL 
              ? "رفع وإدارة ملفاتك مع إمكانية التنظيم والمشاركة" 
              : "Upload and manage your files with organization and sharing capabilities"
            }
          </p>
        </div>

        {/* Storage Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "إجمالي الملفات" : "Total Files"}
                  </p>
                  <p className="text-2xl font-bold text-[#0A2540]">{stats.totalFiles}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    +12 {isRTL ? "هذا الشهر" : "this month"}
                  </p>
                </div>
                <File className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "المساحة المستخدمة" : "Used Space"}
                  </p>
                  <p className="text-2xl font-bold text-green-600">{formatFileSize(stats.usedSpace)}</p>
                  <p className="text-xs text-green-600 mt-1">
                    +2.3GB {isRTL ? "من الشهر الماضي" : "from last month"}
                  </p>
                </div>
                <HardDrive className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "ملفات مكتملة" : "Completed Files"}
                  </p>
                  <p className="text-2xl font-bold text-purple-600">{stats.completedFiles}</p>
                  <p className="text-xs text-purple-600 mt-1">
                    {Math.round((stats.completedFiles / stats.totalFiles) * 100)}% {isRTL ? "نجح" : "success"}
                  </p>
                </div>
                <Cloud className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "معدل الاستخدام" : "Usage Rate"}
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.round((stats.usedSpace / (100 * 1024 * 1024 * 1024)) * 100)}%
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round((stats.usedSpace / (100 * 1024 * 1024 * 1024)) * 100)}%` }}
                    />
                  </div>
                </div>
                <Database className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <TabsList className="grid w-full md:w-auto grid-cols-4">
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                {isRTL ? "رفع الملفات" : "Upload Files"}
              </TabsTrigger>
              <TabsTrigger value="files">
                <FileText className="h-4 w-4 mr-2" />
                {isRTL ? "الملفات" : "Files"}
              </TabsTrigger>
              <TabsTrigger value="folders">
                <FolderOpen className="h-4 w-4 mr-2" />
                {isRTL ? "المجلدات" : "Folders"}
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                {isRTL ? "التحليلات" : "Analytics"}
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isRTL ? "البحث في الملفات..." : "Search files..."}
                  className={cn("pl-9 w-64", isRTL && "pr-9 text-right")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={isRTL ? "النوع" : "Type"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                  <SelectItem value="Image">{isRTL ? "صورة" : "Image"}</SelectItem>
                  <SelectItem value="Video">{isRTL ? "فيديو" : "Video"}</SelectItem>
                  <SelectItem value="Audio">{isRTL ? "صوت" : "Audio"}</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="Document">{isRTL ? "مستند" : "Document"}</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <FileUpload
              config={uploadConfig}
              files={files}
              onFilesChange={handleFilesChange}
              onUpload={handleUpload}
              onRemove={handleRemove}
              onRetry={handleRetry}
              isRTL={isRTL}
              placeholder={isRTL 
                ? "اسحب الملفات هنا أو انقر لاختيار الملفات. الحد الأقصى 20 ملف، 50 ميجابايت لكل ملف"
                : "Drag files here or click to select files. Maximum 20 files, 50MB per file"
              }
            />
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="space-y-6">
            {filteredFiles.length > 0 ? (
              <div className={cn(
                "space-y-4",
                viewMode === 'grid' && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              )}>
                {filteredFiles.map((file) => (
                  <Card key={file.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {getFileIcon(file.type, file.name)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate mb-1">
                            {file.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>{getFileType(file.type)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{file.uploadedAt?.toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isRTL ? "لا توجد ملفات" : "No Files Found"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {isRTL 
                      ? "لم نجد أي ملفات تطابق معايير البحث المحددة"
                      : "No files match your search criteria"
                    }
                  </p>
                  <Button onClick={() => setActiveTab('upload')}>
                    <Upload className="h-4 w-4 mr-2" />
                    {isRTL ? "رفع ملفات جديدة" : "Upload New Files"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Folders Tab */}
          <TabsContent value="folders" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {folders.map((folder) => (
                <Card key={folder.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Folder className="h-8 w-8 text-blue-500" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-sm truncate">
                            {folder.name}
                          </h3>
                          {folder.isStarred && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>{folder.fileCount} {isRTL ? "ملف" : "files"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <HardDrive className="h-3 w-3" />
                            <span>{formatFileSize(folder.size)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{folder.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
              <CardContent className="p-8 text-center">
                <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isRTL ? "إنشاء مجلد جديد" : "Create New Folder"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {isRTL 
                    ? "أنشئ مجلداً جديداً لتنظيم ملفاتك"
                    : "Create a new folder to organize your files"
                  }
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {isRTL ? "إنشاء مجلد" : "Create Folder"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* File Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    {isRTL ? "توزيع أنواع الملفات" : "File Type Distribution"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: isRTL ? "صور" : "Images", count: 45, percentage: 35, color: "bg-green-500" },
                      { type: isRTL ? "مستندات" : "Documents", count: 32, percentage: 25, color: "bg-blue-500" },
                      { type: isRTL ? "فيديوهات" : "Videos", count: 28, percentage: 22, color: "bg-purple-500" },
                      { type: isRTL ? "أصوات" : "Audio", count: 15, percentage: 12, color: "bg-yellow-500" },
                      { type: isRTL ? "أخرى" : "Others", count: 8, percentage: 6, color: "bg-gray-500" }
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{item.type}</span>
                          <span className="font-medium">{item.count} ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${item.color} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Storage Usage Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {isRTL ? "اتجاهات استخدام التخزين" : "Storage Usage Trends"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {isRTL ? "آخر 6 أشهر" : "Last 6 months"}
                      </span>
                      <Badge variant="outline">+15%</Badge>
                    </div>
                    <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 text-sm">
                        {isRTL ? "رسم بياني للاتجاهات" : "Trend chart visualization"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">{isRTL ? "متوسط شهري" : "Monthly Average"}</p>
                        <p className="font-semibold">2.3GB</p>
                      </div>
                      <div>
                        <p className="text-gray-600">{isRTL ? "أعلى استخدام" : "Peak Usage"}</p>
                        <p className="font-semibold">4.1GB</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {isRTL ? "نشاط الرفع" : "Upload Activity"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { day: isRTL ? "اليوم" : "Today", uploads: 8, size: "156MB" },
                      { day: isRTL ? "أمس" : "Yesterday", uploads: 12, size: "234MB" },
                      { day: isRTL ? "هذا الأسبوع" : "This Week", uploads: 45, size: "1.2GB" },
                      { day: isRTL ? "هذا الشهر" : "This Month", uploads: 156, size: "4.3GB" }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{item.day}</p>
                          <p className="text-xs text-gray-600">{item.uploads} {isRTL ? "رفع" : "uploads"}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{item.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* File Security Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {isRTL ? "حالة الأمان" : "Security Status"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
                      <p className="text-sm text-gray-600">
                        {isRTL ? "ملفات آمنة" : "Secure Files"}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{isRTL ? "آمن" : "Secure"}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }} />
                          </div>
                          <span className="text-sm font-medium">98%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{isRTL ? "مشكوك فيه" : "Suspicious"}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '2%' }} />
                          </div>
                          <span className="text-sm font-medium">2%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        {isRTL ? "فحص الأمان" : "Security Scan"}
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        {isRTL ? "تحسين" : "Optimize"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* File Sharing Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {isRTL ? "إحصائيات المشاركة" : "Sharing Analytics"}
                </CardTitle>
                <CardDescription>
                  {isRTL ? "إحصائيات مشاركة الملفات والوصول" : "File sharing and access statistics"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">24</div>
                    <p className="text-sm text-gray-600">
                      {isRTL ? "ملفات مشتركة" : "Shared Files"}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">156</div>
                    <p className="text-sm text-gray-600">
                      {isRTL ? "مرات التحميل" : "Downloads"}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">89%</div>
                    <p className="text-sm text-gray-600">
                      {isRTL ? "معدل الوصول" : "Access Rate"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
