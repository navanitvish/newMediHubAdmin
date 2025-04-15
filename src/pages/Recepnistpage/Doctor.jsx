import React, { useState, useEffect } from 'react';
import Table from '../../components/UI/Table';
import Loader from '../../components/UI/Loader';

import { useGetQuery, usePostMutation } from '../../api/apiCall';
import API_ENDPOINTS from '../../api/apiEndpoint'; 
import Doctor from './Doctor';
const DoctorPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

    // Fetch prescription data
    const { data: DoctorData, isLoading, error } = useGetQuery(
      `${API_ENDPOINTS.DOCTORS.GET_ALL_DOCTOR}`, 
      ['DoctorData'],
      {
        retry: 2,
        select: (response) => {
          // Assuming the API returns a single appointment object
          const DoctorData = response.result || response;
          return DoctorData;
        }
      }
    );
  console.log('Prescription doctor:', DoctorData);

  useEffect(() => {
    // In a real app, this would be an API call
    // Example: fetchDoctors().then(data => setDoctors(data))
    // Mock data for demonstration
    setTimeout(() => {
      const doctordata = DoctorData ;
      setDoctors(doctordata);
      setLoading(false);
      
    }, 500);
  }, []);
console.log('Doctor data:', doctors);

  const columns = [
    { key: 'image', title: 'image' },
    { key: 'name', title: 'Name' },
    { key: 'specialty', title: 'Specialty' },
    { key: 'email', title: 'Email' },
    { key: 'mobile', title: 'Mobile' },
    { key: 'status', title: 'Status' },
  ];

  const handleRowClick = (doctor) => {
    console.log('Doctor selected:', doctor);
    // Handle doctor selection, e.g., open detail view
  };

  const handleAddNew = () => {
    console.log('Add new doctor');
    // Implement add logic
  }

  const handleView = (doctor) => {
    console.log('View doctor:', doctor);
    // Implement view logic
  }

  const handleEdit = (doctor) => {
    console.log('Edit doctor:', doctor);
    // Implement edit logic
  }

  const handleDelete = (doctor) => {
    console.log('Delete doctor:', doctor);
    // Implement delete logic
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
    <Loader size={100} color="#3B82F6" className="text-center" />
</div>;
  }

  return (
    <div className="p-4">
      <Table 
        columns={columns} 
        data={doctors} 
        onRowClick={handleRowClick} 
        onAddNew={handleAddNew}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="Doctor"
        addButtonText="Add New Doctor"
      />
    </div>
  );
};

export default DoctorPage;