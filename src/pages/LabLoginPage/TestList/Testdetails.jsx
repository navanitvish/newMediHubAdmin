import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { X, ArrowLeft } from 'lucide-react';
import { useGetQuery } from '../../../api/apiCall';
import API_ENDPOINTS from '../../../api/apiEndpoint';
import ReportUploadModal from '../../../components/UI/ReportUploadModal';
import Loader from '../../../components/UI/Loader';

const TestViewPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  
  // Use the API utility for fetching a single test
  const {
    data: fetchedTestData,
    isLoading,
    error,
    refetch
  } = useGetQuery(`${API_ENDPOINTS.LAB.GET_TESTBYID}/${id}`);
  
  // Try to get test data from navigation state first
  useEffect(() => {
    if (location.state?.testData) {
      setTest(location.state.testData);
    } else if (fetchedTestData && fetchedTestData.result) {
      // If no state data, use the data from the query
      setTest(fetchedTestData.result);
    }
  }, [id, location.state, fetchedTestData]);

  const handleaddreport = () => {
    // Just open the modal - no need to set selectedTest since we already have test
    setShowReportModal(true);
  };

  const handleSubmitReport = async (formData) => {
    try {
      // Here you would make an API call to upload the reports
      // For example:
      // await axios.post(API_ENDPOINTS.LAB.UPLOAD_REPORTS, formData);
      
      console.log("Submitting report data:", formData);
      
      // Close modal after submission
      setShowReportModal(false);
      
      // Refresh test data to show new reports
      refetch();
      
      alert("Reports uploaded successfully!");
      
    } catch (error) {
      console.error("Error uploading reports:", error);
      alert("Failed to upload reports. Please try again.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading && !test) {
    return <div className="flex justify-center items-center h-screen">
    <Loader size={100} color="#3B82F6" className="text-center" />
</div>;
  }

  if (error && !test) {
    return <div className="p-6">Error loading test details: {error.message}</div>;
  }

  if (!test) {
    return <div className="p-6">No test data available</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={handleBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Test Details</h1>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleaddreport}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Upload Report
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md">
        {/* Test Information */}
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold mb-4">Test Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-gray-600">Test Name:</span>
                <span className="col-span-2">{test.testName}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-gray-600">Description:</span>
                <span className="col-span-2">{test.test?.description}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-gray-600">Price:</span>
                <span className="col-span-2">₹{test.price}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-gray-600">Payment Status:</span>
                <span className="col-span-2">
                  {test.paid ? 
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">Paid</span> : 
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">Unpaid</span>
                  }
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-gray-600">Total Paid:</span>
                <span className="col-span-2">₹{test.totalPaid}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-gray-600">Due Amount:</span>
                <span className="col-span-2">₹{test.due}</span>
              </div>
            </div>
          </div>
        </div>


        {/* receptionistId Information */}
        <div className="border-b p-6">
            <h2 className="text-xl font-semibold mb-4">Receptionist Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                        {/* image */}
                        <span className="font-semibold text-gray-600">Receptionist Image:</span>
                        <span className="col-span-2">
                            {test.receptionistId?.image && (
                                <img    
                                    src={test.receptionistId?.image}
                                    alt={test.receptionistId?.name}
                                    className="w-12 h-12 rounded-full"
                                />
                            )}
                        </span>
                        <span className="font-semibold text-gray-600">Receptionist Name:</span>
                        <span className="col-span-2">{test.receptionistId?.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <span className="font-semibold text-gray-600">Email:</span> 
                        <span className="col-span-2">{test.receptionistId?.email}</span>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                        <span className="font-semibold text-gray-600">Contact:</span>
                        <span className="col-span-2">{test.receptionistId?.mobile}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <span className="font-semibold text-gray-600">Address:</span>
                        <span className="col-span-2">{test.receptionistId?.address}</span>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Lab Information */}
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold mb-4">Lab Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">

            {/* image */}
            <div className="grid grid-cols-3 gap-2">
                            
                <span className="font-semibold text-gray-600">Lab Image:</span>
                <span className="col-span-2">
                            
                    {test.labId?.image && (
                        <img    
                            src={test.labId?.image}
                            alt={test.labId?.name}
                            className="w-12 h-12 rounded-full"
                        />
                    )}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-gray-600">Lab Name:</span>
                <span className="col-span-2">{test.labId?.name}</span>
              </div>


              
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-gray-600">Email:</span>
                <span className="col-span-2">{test.labId?.email}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-gray-600">Contact:</span>
                <span className="col-span-2">{test.labId?.mobile}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-gray-600">Address:</span>
                <span className="col-span-2">{test.labId?.address}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Patient Information */}
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-gray-600">Patient Name:</span>
                <span className="col-span-2">{test.patientId?.name}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-gray-600">Gender:</span>
                <span className="col-span-2">{test.patientId?.gender}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-gray-600">Contact:</span>
                <span className="col-span-2">{test.patientId?.contactNumber}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-gray-600">Blood Group:</span>
                <span className="col-span-2">{test.patientId?.bloodGroup}</span>
              </div>
            </div>
          </div>
        </div>


        {/* doctor informations */}

        <div className="border-b p-6">
            <h2 className="text-xl font-semibold mb-4">Doctor Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3"> 
                    <div className="grid grid-cols-3 gap-2">
                        <span className="font-semibold text-gray-600">Doctor Name:</span>
                        <span className="col-span-2">{test.doctorId?.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <span className="font-semibold text-gray-600">Email:</span>
                        <span className="col-span-2">{test.doctorId?.email}</span>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                        <span className="font-semibold text-gray-600">Contact:</span>
                        <span className="col-span-2">{test.doctorId?.contactNumber}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <span className="font-semibold text-gray-600">Specialization:</span>

                        <span className="col-span-2">{test.doctorId?.specialization}</span>
                    </div>
                </div>
            </div>
        </div>      
        {/* Payment History */}
        {test.paidAmounts && test.paidAmounts.length > 0 && (
          <div className="border-b p-6">
            <h2 className="text-xl font-semibold mb-4">Payment History</h2>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {test.paidAmounts.map((payment, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-right">
                    ₹{payment.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Reports Section */}
        {test.reports && test.reports.length > 0 && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Reports</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {test.reports.map((report, index) => (
                <div key={index} className="border p-4 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{report.reportName || "Report"}</h3>
                    <span className="text-sm text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {report.reportDescription && (
                    <p className="text-sm text-gray-600 mb-3">{report.reportDescription}</p>
                  )}
                  
                  {report.reportImage && (
                    <div className="mt-3">
                      <span className="font-semibold text-gray-600 block mb-2">Report Image:</span>
                      <a 
                        href={report.reportImage} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img 
                          src={report.reportImage} 
                          alt="Report" 
                          className="max-w-full h-auto rounded-md"
                        />
                      </a>
                    </div>
                  )}
                  
                  {/* If there are multiple files in the report */}
                  {report.reportFiles && report.reportFiles.length > 0 && (
                    <div className="mt-3">
                      <span className="font-semibold text-gray-600 block mb-2">Report Files:</span>
                      <ul className="space-y-1">
                        {report.reportFiles.map((file, fileIndex) => (
                          <li key={fileIndex}>
                            <a 
                              href={file.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm flex items-center"
                            >
                              {file.name || `File ${fileIndex + 1}`}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Report Upload Modal */}
      <ReportUploadModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        selectedTest={test} // Pass the current test instead of selectedTest
        onSubmit={handleSubmitReport}
      />
    </div>
  );
};

export default TestViewPage;