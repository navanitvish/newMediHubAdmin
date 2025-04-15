import React, { useState, useEffect } from 'react';
import Table from '../../../components/UI/Table';
import { useNavigate } from 'react-router-dom';
import { useGetQuery } from '../../../api/apiCall';
import API_ENDPOINTS from '../../../api/apiEndpoint';
import ReportUploadModal from '../../../components/UI/ReportUploadModal'; // Adjust path as needed
import Loader from '../../../components/UI/Loader';

const TestList = () => {
    const [tests, setTests] = useState([]);
    const navigate = useNavigate();
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    
    // Use the GET_ALL endpoint for tests
    const {
        data: testData,
        isLoading,
        error
    } = useGetQuery(API_ENDPOINTS.LAB.GET_TESTLIST);
    
    // Update tests when data is fetched
    useEffect(() => {
        if (testData && testData.result) {
            setTests(testData.result);
        }
    }, [testData]);
    
    console.log(tests, "tests");
    console.log(testData, "testData");
    
    const columns = [
        {
            key: 'test.image',
            title: 'Image',
            render: (test) => <img src={test.test?.image} alt="Test Image" className="w-12 h-12 rounded-full object-cover" />
        },
        { key: 'testName', title: 'Test Name' },
        {
            key: 'patientId.name',
            title: 'Patient Name',
            render: (test) => test.patientId ? test.patientId.name : 'N/A'
        },
        {
            key: 'price',
            title: 'Price',
            render: (test) => `$${test.price}`
        },
        {
            key: 'paid',
            title: 'Payment Status',
            render: (test) => test.paid ? 
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">Paid</span> : 
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">Unpaid</span>
        },
        {
            key: 'totalPaid',
            title: 'Total Paid',
            render: (test) => `$${test.totalPaid}`
        },
        {
            key: 'createdAt',
            title: 'Created Date',
            render: (test) => new Date(test.createdAt).toLocaleDateString()
        }
    ];
    
    const handleView = (test) => {
        // Navigate to test view page with the test ID
        navigate(`/testlist/view/${test._id}`, { state: { testData: test } });
    };
        
    const handleDelete = (testToDelete) => {
        setTests(tests.filter(test => test._id !== testToDelete._id));
    };

    const handleaddreport = (test) => {
        // Open report modal and set the selected test
        setSelectedTest(test);
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
            
            // You might want to refresh the test list here to show updated reports
            // refreshTests();
            
            alert("Reports uploaded successfully!");
            
        } catch (error) {
            console.error("Error uploading reports:", error);
            alert("Failed to upload reports. Please try again.");
        }
    };
    
    // Handle loading state
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
        <Loader size={100} color="#3B82F6" className="text-center" />
    </div>;
    }
    
    // Handle error state
    if (error) {
        return <div>Error loading tests: {error.message}</div>;
    }
    
    return (
        <div className="container mx-auto p-4">
            <Table
                title="Lab Test Management"
                columns={columns}
                data={tests}
                onDelete={handleDelete}
                onView={handleView}
                onReport={handleaddreport}
            />
            
            <ReportUploadModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                selectedTest={selectedTest}
                onSubmit={handleSubmitReport}
            />
        </div>
    );
};

export default TestList;