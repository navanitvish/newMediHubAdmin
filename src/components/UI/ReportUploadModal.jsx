import React, { useState } from 'react';

const ReportUploadModal = ({ isOpen, onClose, selectedTest, onSubmit }) => {
    const [reportFiles, setReportFiles] = useState([]);
    const [reportName, setReportName] = useState('');
    const [reportDescription, setReportDescription] = useState('');

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        // Get the files from the input
        const files = Array.from(e.target.files);
        setReportFiles([...reportFiles, ...files]);
    };
    
    const handleRemoveFile = (index) => {
        const updatedFiles = [...reportFiles];
        updatedFiles.splice(index, 1);
        setReportFiles(updatedFiles);
    };
    
    const handleSubmitReport = async (e) => {
        e.preventDefault();
        
        if (!reportName || reportFiles.length === 0) {
            alert("Please provide a report name and upload at least one file.");
            return;
        }
        
        try {
            // Create a FormData object to send files
            const formData = new FormData();
            formData.append('testId', selectedTest._id);
            formData.append('reportName', reportName);
            formData.append('reportDescription', reportDescription);
            
            // Append each file to the FormData
            reportFiles.forEach((file) => {
                formData.append(`files`, file);
            });
            
            // Call the parent's onSubmit function
            await onSubmit(formData);
            
            // Reset form
            setReportName('');
            setReportDescription('');
            setReportFiles([]);
            
        } catch (error) {
            console.error("Error uploading reports:", error);
            alert("Failed to upload reports. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md border border-blue-500">
                <h2 className="text-2xl font-bold mb-4">Upload Test Reports</h2>
                <p className="mb-4">
                    Test: <span className="font-semibold">{selectedTest?.testName}</span> | 
                    Patient: <span className="font-semibold">{selectedTest?.patientId?.name || 'N/A'}</span>
                </p>
                
                <form onSubmit={handleSubmitReport}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reportName">
                            Report Name *
                        </label>
                        <input
                            id="reportName"
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter report name"
                            value={reportName}
                            onChange={(e) => setReportName(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reportDescription">
                            Report Description
                        </label>
                        <textarea
                            id="reportDescription"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter report description"
                            value={reportDescription}
                            onChange={(e) => setReportDescription(e.target.value)}
                            rows="3"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Upload Reports *
                        </label>
                        <input
                            type="file"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={handleFileChange}
                            multiple
                        />
                    </div>
                    
                    {/* Display selected files */}
                    {reportFiles.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-sm font-bold mb-2">Selected Files:</h3>
                            <ul className="bg-gray-50 p-2 rounded">
                                {reportFiles.map((file, index) => (
                                    <li key={index} className="flex justify-between items-center py-1">
                                        <span className="text-sm">{file.name}</span>
                                        <button
                                            type="button"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleRemoveFile(index)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Upload Reports
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportUploadModal;