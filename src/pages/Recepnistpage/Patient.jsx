import React, { useState, useEffect } from 'react';
import Table from '../../components/UI/Table';
import Loader from '../../components/UI/Loader';
const Patient = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    // Example: fetchPatients().then(data => setPatients(data))
    
    // Mock data for demonstration
    setTimeout(() => {
      const mockPatients = [
        { id: 1, name: 'John Doe', age: 45, gender: 'Male', contact: '555-1111', lastVisit: '2025-03-10' },
        { id: 2, name: 'Jane Smith', age: 32, gender: 'Female', contact: '555-2222', lastVisit: '2025-03-15' },
        { id: 3, name: 'Robert Brown', age: 28, gender: 'Male', contact: '555-3333', lastVisit: '2025-03-18' },
      ];
      setPatients(mockPatients);
      setLoading(false);
    }, 500);
  }, []);

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: 'Name' },
    { key: 'age', title: 'Age' },
    { key: 'gender', title: 'Gender' },
    { key: 'contact', title: 'Contact' },
    { key: 'lastVisit', title: 'Last Visit' },
  ];

  const handleRowClick = (patient) => {
    console.log('Patient selected:', patient);
    // Handle patient selection, e.g., open detail view
  };

  // Placeholder functions for Table actions
  const handleAddNew = () => {
    console.log('Add new patient');
    // Implement add logic
  };

  const handleView = (patient) => {
    console.log('View patient:', patient);
    // Implement view logic
  };

  const handleEdit = (patient) => {
    console.log('Edit patient:', patient);
    // Implement edit logic
  };


  const handleDelete = (patient) => { 
    console.log('Delete patient:', patient);
    // Implement delete logic
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
    <Loader size={100} color="#3B82F6" className="text-center" />
</div>;
  }

  return (
    <div className="p-4">
      
      <Table
                    title="Patients"
                    addButtonText="Add New Patient"
                    columns={columns}
                    data={patients}
                    onAddNew={handleAddNew}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
    </div>
  );
};

export default Patient;