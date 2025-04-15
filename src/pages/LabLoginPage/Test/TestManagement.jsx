import React, { useState, useEffect } from 'react';
import Table from '../../../components/UI/Table';
import TestView from './TestView';
import TestAddEdit from './TestAddEdit';
import { useGetQuery } from '../../../api/apiCall';
import API_ENDPOINTS from '../../../api/apiEndpoint';
import Loader from '../../../components/UI/Loader';

const TestManagement = () => {
    const [labs, setLabs] = useState([]);
    const [selectedLab, setSelectedLab] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);

    // Use the GET_ALL endpoint for labs
    const { 
        data: labData, 
        isLoading, 
        error 
    } = useGetQuery(API_ENDPOINTS.LAB.GET_ALL);

    // Update labs when data is fetched
    useEffect(() => {
        if (labData && labData.result) {
            setLabs(labData.result);
        }
    }, [labData]);

    console.log(labs, "labs");

    const columns = [
    //image  
        { key: 'image', title: 'Image' , render: (labs) => <img src={labs.image} alt="Lab Image" /> },
        { key: 'labId', title: 'Lab ID' },
        {key:'address', title:'Address'}, 
        { key: 'name', title: 'Lab Name' },
        { key: 'email', title: 'Email' },
        { key: 'mobile', title: 'Mobile' },
        { key: 'role', title: 'Role' }
    ];

    const handleView = (lab) => {
        setSelectedLab(lab);
        setIsViewModalOpen(true);
    };
 

    const handleEdit = (lab) => {
        setSelectedLab(lab);
        setIsAddEditModalOpen(true);
    };

    const handleDelete = (labToDelete) => {
        setLabs(labs.filter(lab => lab._id !== labToDelete._id));
    };

    const handleAddNew = () => {
        setSelectedLab(null);
        setIsAddEditModalOpen(true);
    };

    const handleSave = (lab) => {
        if (lab._id) {
            // Editing existing lab
            setLabs(labs.map(l => l._id === lab._id ? lab : l));
        } else {
            // Adding new lab
            setLabs([...labs, { ...lab, _id: Date.now().toString() }]);
        }
        setIsAddEditModalOpen(false);
    };

    // Handle loading state
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
        <Loader size={100} color="#3B82F6" className="text-center" />
    </div>;
    }

    // Handle error state
    if (error) {
        return <div>Error loading labs: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <Table
                title="Lab Management"
                addButtonText="Create New Lab"
                columns={columns}
                data={labs}
                onAddNew={handleAddNew}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {isViewModalOpen && (
                <TestView
                    test={selectedLab}
                    onClose={() => setIsViewModalOpen(false)}
                />
            )}

            {isAddEditModalOpen && (
                <TestAddEdit
                    test={selectedLab}
                    onSave={handleSave}
                    onClose={() => setIsAddEditModalOpen(false)}
                />
            )}
        </div>
    );
};

export default TestManagement;