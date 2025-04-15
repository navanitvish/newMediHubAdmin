import React, { useState, useEffect, useRef } from 'react';
import { Upload, File, Trash2, Plus } from 'lucide-react';
import { usePostMutation } from '../../../api/apiCall';
import API_ENDPOINTS from '../../../api/apiEndpoint';

const PatientTestReportUpload = ({ patientId }) => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const fileInputRef = useRef(null);
  
  // Unified form data state
  const [formData, setFormData] = useState({
    reportName: '',
    reportDescription: '',
    reportFile: null,
  });

  // Fix: Use the correct endpoint format
  // Instead of calling LAB_REPORT as a function, access it properly according to your API structure
  const labReportEndpoint = `${API_ENDPOINTS.LAB.LAB_REPORT}/${patientId}`;
  // Alternative approach if the patientId should be part of the URL:
  // const labReportEndpoint = API_ENDPOINTS.LAB.LAB_REPORT.replace(':patientId', patientId);

  // Use the uploadReport mutation hook with the fixed endpoint
  const uploadReport = usePostMutation(labReportEndpoint, {
    onSuccess: (data) => {
      console.log('Report uploaded successfully:', data);
      // Add the new report to the list
      const newReport = {
        id: reports.length + 1, // In production, use ID from server response
        name: formData.reportName,
        description: formData.reportDescription,
        size: formData.reportFile ? `${(formData.reportFile.size / 1024).toFixed(1)} KB` : '0 KB',
        uploadDate: new Date().toISOString().split('T')[0]
      };
      
      setReports([...reports, newReport]);
      resetUploadForm();
    },
    onError: (error) => {
      console.error('Error uploading report:', error);
      setError('Failed to upload report. Please try again.'); 
    },
  });

  // Fetch existing reports
  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        // Simulate API call - In production, replace with actual API call
        const mockReports = [
          { id: 1, name: 'Blood Test 2024-03-15.pdf', description: 'Complete blood count analysis', size: '256 KB', uploadDate: '2024-03-15' },
          { id: 2, name: 'X-Ray Scan.jpg', description: 'Chest X-ray', size: '1.2 MB', uploadDate: '2024-03-10' }
        ];
        setReports(mockReports);
      } catch (err) {
        setError('Failed to fetch reports');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [patientId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setFormData({
      ...formData,
      reportFile: file,
      reportName: formData.reportName || file.name, // Use existing name or default to file name
    });
  };

  // File upload handler
  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!formData.reportFile) {
      setError('Please select a file to upload');
      return;
    }

    if (!formData.reportName.trim()) {
      setError('Please provide a report name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create FormData object for file upload
      const uploadFormData = new FormData();
      uploadFormData.append('reportName', formData.reportName);
      uploadFormData.append('reportDescription', formData.reportDescription);
      uploadFormData.append('reportFile', formData.reportFile);
      
      // Call the mutation with FormData
      uploadReport.mutate(uploadFormData);
    } catch (err) {
      setError('File upload failed');
      setIsLoading(false);
    }
  };

  // Reset the upload form
  const resetUploadForm = () => {
    setFormData({
      reportName: '',
      reportDescription: '',
      reportFile: null,
    });
    setShowUploadForm(false);
    setIsLoading(false);
  };

  // File deletion handler
  const handleFileDelete = async (reportId) => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, make API call to delete the file
      // For now, simulate file deletion
      const updatedReports = reports.filter(report => report.id !== reportId);
      setReports(updatedReports);
    } catch (err) {
      setError('File deletion failed');
    } finally {
      setIsLoading(false);
    }
  };

  // File download handler (simulated)
  const handleFileDownload = (report) => {
    alert(`Downloading: ${report.name}`);
    // In a real implementation, trigger actual file download
  };

  // Open file dialog when clicking the component
  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Patient Test Reports</h2>
        <button 
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showUploadForm ? 'Cancel' : (
            <>
              <Plus className="mr-1" size={18} />
              Add Report
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* File Upload Form - Shown/Hidden based on state */}
      {showUploadForm && (
        <form onSubmit={handleFileUpload} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-3">Upload New Report</h3>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Report Name</label>
            <input 
              type="text" 
              name="reportName"
              className="w-full border rounded p-2" 
              placeholder="Enter report name"
              value={formData.reportName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Report Description</label>
            <textarea 
              name="reportDescription"
              className="w-full border rounded p-2" 
              placeholder="Enter report description"
              value={formData.reportDescription}
              onChange={handleInputChange}
              rows="2"
            />
          </div>
          
          <div className="mb-4">
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            
            <div className="flex items-center mb-2">
              <button 
                type="button"
                onClick={openFileDialog}
                className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                <Upload className="mr-2" size={18} />
                Select File
              </button>
              {formData.reportFile && (
                <span className="ml-3 text-sm">
                  Selected: {formData.reportFile.name} ({(formData.reportFile.size / 1024).toFixed(1)} KB)
                </span>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              type="button"
              onClick={resetUploadForm}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={isLoading || !formData.reportFile}
            >
              {isLoading ? 'Uploading...' : 'Upload Report'}
            </button>
          </div>
        </form>
      )}

      {/* Reports List */}
      <div className="mt-2">
        <h3 className="font-medium mb-2 text-gray-700">
          {reports.length} {reports.length === 1 ? 'Report' : 'Reports'}
        </h3>
        
        {isLoading && !showUploadForm ? (
          <div className="text-center text-gray-500 py-4">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="text-center text-gray-500 py-8 bg-gray-50 rounded border border-dashed">
            No reports available. Click "Add Report" to upload.
          </div>
        ) : (
          <div className="space-y-2">
            {reports.map((report) => (
              <div 
                key={report.id} 
                className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 border border-gray-200"
              >
                <div className="flex items-center">
                  <File className="mr-3 text-blue-500 flex-shrink-0" size={24} />
                  <div className="min-w-0">
                    <div className="font-medium truncate">{report.name}</div>
                    {report.description && (
                      <div className="text-sm text-gray-600 truncate">{report.description}</div>
                    )}
                    <div className="text-xs text-gray-500">
                      {report.size} • Uploaded on {report.uploadDate}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3 ml-4">
                  <button 
                    onClick={() => handleFileDownload(report)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Download
                  </button>
                  <button 
                    onClick={() => handleFileDelete(report.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientTestReportUpload;