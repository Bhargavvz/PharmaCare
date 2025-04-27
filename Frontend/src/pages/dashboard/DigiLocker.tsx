import React, { useState, useEffect, useMemo } from 'react';
import { Box, Container, Typography, Button, Card, CardContent, TextField, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Chip, LinearProgress, Tooltip, Avatar, Badge } from '@mui/material';
import { Grid } from '@mui/material';
import { 
  Upload as UploadIcon, 
  Delete as DeleteIcon, 
  Visibility as VisibilityIcon, 
  Description as DescriptionIcon, 
  PictureAsPdf, 
  Image as ImageIcon, 
  InsertDriveFile,
  CloudUpload,
  Download,
  Share,
  FilterList,
  Search,
  Sort,
  Folder,
  Add,
  MoreVert,
  Star,
  StarBorder,
  GridView,
  ViewList,
  Info
} from '@mui/icons-material';
import axios, { AxiosInstance } from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const documentTypes = [
  'PRESCRIPTION',
  'LAB_REPORT',
  'XRAY',
  'MRI',
  'CT_SCAN',
  'VACCINATION_CERTIFICATE',
  'OTHER'
] as const;

type DocumentType = typeof documentTypes[number];

interface MedicalDocument {
  id: number;
  documentType: string;
  fileName: string;
  fileType: string;
  description: string;
  uploadDate: string;
}

const DigiLocker: React.FC = () => {
  const { token } = useAuth();
  
  const api = useMemo(() => {
    return axios.create({
      baseURL: 'http://localhost:8080/api',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      withCredentials: true
    });
  }, [token]);

  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>('PRESCRIPTION');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'name'>('date');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    if (token) {
      fetchDocuments();
    }
  }, [token]);

  const fetchDocuments = async () => {
    if (!token) {
      toast.error('Please login to view documents');
      return;
    }
    
    try {
      const response = await api.get('/medical-documents');
      setDocuments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents');
      setDocuments([]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!token) {
      toast.error('Please login to upload documents');
      return;
    }

    if (!selectedFile || !documentType) {
      toast.error('Please select a file and document type');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('documentType', documentType);
    formData.append('description', description);

    try {
      setLoading(true);
      await api.post('/medical-documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });
      toast.success('Document uploaded successfully');
      fetchDocuments();
      setSelectedFile(null);
      setDocumentType('PRESCRIPTION');
      setDescription('');
      setUploadProgress(0);
      setUploadDialogOpen(false);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) {
      toast.error('Please login to delete documents');
      return;
    }
    
    try {
      await api.delete(`/medical-documents/${id}`);
      toast.success('Document deleted successfully');
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handlePreview = async (id: number) => {
    if (!token) {
      toast.error('Please login to preview documents');
      return;
    }
    
    try {
      const response = await api.get(`/medical-documents/${id}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setPreviewUrl(url);
      setPreviewOpen(true);
    } catch (error) {
      console.error('Error viewing document:', error);
      toast.error('Failed to preview document');
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <PictureAsPdf className="h-6 w-6" />;
    if (fileType.includes('image')) return <ImageIcon className="h-6 w-6" />;
    return <InsertDriveFile className="h-6 w-6" />;
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'PRESCRIPTION':
        return 'bg-violet-100 text-violet-600';
      case 'LAB_REPORT':
        return 'bg-sky-100 text-sky-600';
      case 'XRAY':
      case 'MRI':
      case 'CT_SCAN':
        return 'bg-amber-100 text-amber-600';
      case 'VACCINATION_CERTIFICATE':
        return 'bg-emerald-100 text-emerald-600';
      default:
        return 'bg-teal-100 text-teal-600';
    }
  };

  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = documents;
    
    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.documentType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterType !== 'ALL') {
      filtered = filtered.filter(doc => doc.documentType === filterType);
    }
    
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'type':
          return a.documentType.localeCompare(b.documentType);
        case 'name':
          return a.fileName.localeCompare(b.fileName);
        default:
          return 0;
      }
    });
  }, [documents, searchQuery, filterType, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header - Updated to match other pages */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical DigiLocker</h1>
          <p className="mt-1 text-sm text-gray-600">
            Securely store and manage your medical documents
          </p>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setUploadDialogOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
        >
          Upload Document
        </Button>
      </div>

      {/* Stats Cards - Updated with consistent styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6" className="text-white/80">Total Documents</Typography>
                <Typography variant="h4" className="font-bold">{documents.length}</Typography>
              </div>
              <div className="p-3 bg-white/10 rounded-lg">
                <Folder className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6" className="text-white/80">Prescriptions</Typography>
                <Typography variant="h4" className="font-bold">
                  {documents.filter(doc => doc.documentType === 'PRESCRIPTION').length}
                </Typography>
              </div>
              <div className="p-3 bg-white/10 rounded-lg">
                <PictureAsPdf className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6" className="text-white/80">Lab Reports</Typography>
                <Typography variant="h4" className="font-bold">
                  {documents.filter(doc => doc.documentType === 'LAB_REPORT').length}
                </Typography>
              </div>
              <div className="p-3 bg-white/10 rounded-lg">
                <InsertDriveFile className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6" className="text-white/80">Scans</Typography>
                <Typography variant="h4" className="font-bold">
                  {documents.filter(doc => ['XRAY', 'MRI', 'CT_SCAN'].includes(doc.documentType)).length}
                </Typography>
              </div>
              <div className="p-3 bg-white/10 rounded-lg">
                <ImageIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters - Updated with consistent styling */}
      <Card className="shadow-sm border border-gray-200">
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <TextField
              fullWidth
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search className="text-gray-400 mr-2" />
              }}
              className="bg-white"
            />
            <TextField
              select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'type' | 'name')}
              className="min-w-[150px]"
              InputProps={{
                startAdornment: <Sort className="text-gray-400 mr-2" />
              }}
            >
              <MenuItem value="date">Sort by Date</MenuItem>
              <MenuItem value="type">Sort by Type</MenuItem>
              <MenuItem value="name">Sort by Name</MenuItem>
            </TextField>
            <TextField
              select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="min-w-[150px]"
              InputProps={{
                startAdornment: <FilterList className="text-gray-400 mr-2" />
              }}
            >
              <MenuItem value="ALL">All Types</MenuItem>
              {documentTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.replace('_', ' ')}
                </MenuItem>
              ))}
            </TextField>
            <div className="flex items-center gap-2">
              <IconButton 
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'text-teal-600' : 'text-gray-400'}
              >
                <GridView />
              </IconButton>
              <IconButton 
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'text-teal-600' : 'text-gray-400'}
              >
                <ViewList />
              </IconButton>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid/List - Updated with consistent styling */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedDocuments.map((doc) => (
            <Card key={doc.id} className="group hover:shadow-lg transition-shadow duration-200 border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <Avatar className={getDocumentTypeColor(doc.documentType)}>
                      {getFileIcon(doc.fileType)}
                    </Avatar>
                    <div className="ml-3">
                      <Typography variant="subtitle1" className="font-medium text-gray-900">
                        {doc.documentType.replace('_', ' ')}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </Typography>
                    </div>
                  </div>
                  <IconButton size="small" className="text-gray-400 hover:text-gray-600">
                    <MoreVert />
                  </IconButton>
                </div>
                <Typography variant="body2" className="text-gray-600 mb-2 line-clamp-2">
                  {doc.fileName}
                </Typography>
                {doc.description && (
                  <Typography variant="caption" className="text-gray-500 line-clamp-2">
                    {doc.description}
                  </Typography>
                )}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Tooltip title="Preview">
                      <IconButton size="small" onClick={() => handlePreview(doc.id)} className="text-gray-400 hover:text-teal-600">
                        <VisibilityIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton size="small" className="text-gray-400 hover:text-teal-600">
                        <Download className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share">
                      <IconButton size="small" className="text-gray-400 hover:text-teal-600">
                        <Share className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <Tooltip title="Delete">
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(doc.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <DeleteIcon className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-0">
            {filteredAndSortedDocuments.map((doc) => (
              <div 
                key={doc.id} 
                className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <Avatar className={getDocumentTypeColor(doc.documentType)}>
                    {getFileIcon(doc.fileType)}
                  </Avatar>
                  <div>
                    <Typography variant="subtitle1" className="font-medium text-gray-900">
                      {doc.fileName}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      {doc.documentType.replace('_', ' ')} • {new Date(doc.uploadDate).toLocaleDateString()}
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip title="Preview">
                    <IconButton size="small" onClick={() => handlePreview(doc.id)} className="text-gray-400 hover:text-teal-600">
                      <VisibilityIcon className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download">
                    <IconButton size="small" className="text-gray-400 hover:text-teal-600">
                      <Download className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton size="small" className="text-gray-400 hover:text-teal-600">
                      <Share className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(doc.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <DeleteIcon className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog - Updated with consistent styling */}
      <Dialog 
        open={uploadDialogOpen} 
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
          Upload New Document
        </DialogTitle>
        <DialogContent className="pt-6">
          <div className="space-y-4">
            <TextField
              select
              fullWidth
              label="Document Type"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as DocumentType)}
              InputProps={{
                startAdornment: <FilterList className="text-teal-600 mr-2" />
              }}
            >
              {documentTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.replace('_', ' ')}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CloudUpload />}
              className="h-[100px] border-2 border-dashed border-teal-300 hover:border-teal-500"
            >
              {selectedFile ? selectedFile.name : 'Choose File'}
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </Button>
            {selectedFile && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <Typography variant="body2" className="text-gray-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    {uploadProgress}%
                  </Typography>
                </div>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress} 
                  className="h-2 rounded-full"
                  sx={{
                    backgroundColor: 'rgba(20, 184, 166, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'rgb(20, 184, 166)',
                    },
                  }}
                />
              </div>
            )}
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              InputProps={{
                startAdornment: <DescriptionIcon className="text-teal-600 mr-2" />
              }}
            />
          </div>
        </DialogContent>
        <DialogActions className="bg-gray-50 p-4">
          <Button 
            onClick={() => setUploadDialogOpen(false)}
            className="text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile || !documentType || loading}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog - Updated with consistent styling */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
          Document Preview
        </DialogTitle>
        <DialogContent>
          {previewUrl && (
            <Box sx={{ width: '100%', height: '70vh' }}>
              <iframe
                src={previewUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Document Preview"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions className="bg-gray-50 p-4">
          <Button 
            onClick={handleClosePreview}
            className="text-gray-600 hover:bg-gray-100"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DigiLocker;