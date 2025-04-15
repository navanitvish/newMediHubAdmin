// import React, { useState, useEffect } from 'react';
// import Table from '../components/UI/Table';
// import AppointmentBooking from './AppointmentBooking';
// import Loader from '../components/UI/Loader';
// const Appointment = () => {
//     const [appointments, setAppointments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showBookingForm, setShowBookingForm] = useState(false);

//     useEffect(() => {
//         // In a real app, this would be an API call
//         // Example: fetchAppointments().then(data => setAppointments(data))
        
//         // Mock data for demonstration
//         setTimeout(() => {
//             const mockAppointments = [
//                 { id: 1, patientName: 'John Doe', doctorName: 'Dr. Smith', date: '2025-03-25', time: '09:00 AM', status: 'Confirmed' },
//                 { id: 2, patientName: 'Jane Smith', doctorName: 'Dr. Johnson', date: '2025-03-25', time: '10:30 AM', status: 'Pending' },
//                 { id: 3, patientName: 'Robert Brown', doctorName: 'Dr. Williams', date: '2025-03-26', time: '02:00 PM', status: 'Confirmed' },
//             ]; 
//             setAppointments(mockAppointments);
//             setLoading(false);
//         }, 500);
//     }, []);

//     const columns = [
//         { key: 'id', title: 'ID' },
//         { key: 'patientName', title: 'Patient' },
//         { key: 'doctorName', title: 'Doctor' },
//         { key: 'date', title: 'Date' },
//         { key: 'time', title: 'Time' },
//         { key: 'status', title: 'Status' },
//     ];

//     const handleRowClick = (appointment) => {
//         console.log('Appointment selected:', appointment);
//         // Handle appointment selection, e.g., open detail view
//     };

//     // Placeholder functions for Table actions
//     const handleAddNew = () => {
//         toggleBookingForm();
//     };

//     const handleView = (appointment) => {
//         console.log('View appointment:', appointment);
//         // Implement view logic
//     };

//     const handleEdit = (appointment) => {
//         console.log('Edit appointment:', appointment);
//         // Implement edit logic
//     };

//     const handleDelete = (appointment) => {
//         console.log('Delete appointment:', appointment);
//         // Implement delete logic
//     };

//     const toggleBookingForm = () => {
//         setShowBookingForm(!showBookingForm);
//     };

//     if (loading) {
//         return <div className="flex justify-center items-center h-screen">
//         <Loader size={100} color="#4B82F6" className="text-center" />
//     </div>;
//     }

//     return (
//         <div className="p-4">

//             {showBookingForm ? (
//                 <AppointmentBooking />
//             ) : (
//                 <Table
//                     title="Appointments"
//                     addButtonText="Book New Appointment"
//                     columns={columns}
//                     data={appointments}
//                     onAddNew={handleAddNew}
//                     onView={handleView}
//                     onEdit={handleEdit}
//                     onDelete={handleDelete}
//                     handleRowClick={handleRowClick}
//                 />
//             )}
//         </div>
//     );
// };

// export default Appointment;


import React, { useState } from 'react';
import { useGetQuery } from '../../api/apiCall';
import  API_ENDPOINTS  from '../../api/apiEndpoint';
import Table from '../../components/UI/Table';
import AppointmentBooking from './AppointmentBooking';
import Loader from '../../components/UI/Loader';
import { useNavigate } from 'react-router-dom';
const Appointment = () => {
    const [showBookingForm, setShowBookingForm] = useState(false);
    const navigate = useNavigate();
    // Use the GET_APPOINTMENTS endpoint with React Query
    const { 
        data: appointmentsResponse = [], 
        isLoading, 
        error, 
        refetch 
    } = useGetQuery(
        API_ENDPOINTS.BOOKINGS.GET_APPOINTMENTS, 
        ['appointments'],
        {
            retry: 2,
            select: (response) => {
                // Assuming the API returns an array of appointments
                // If the response has a 'data' property, use response.data
                const appointments = Array.isArray(response) ? response : response.result || [];
                
                console.log('Appointments:', appointments);
                return appointments.map(appointment => ({
                    id: appointment._id,
                    patientName: appointment.userId?.name || 'N/A',
                    doctorName: appointment.doctorId?.name || 'N/A',
                    date: new Date(appointment.appointmentDate).toLocaleDateString(),
                    time: appointment.appointmentTime,
                    status: appointment.bookingStatus,
                    consultationFee: appointment.consultationFee,
                    totalAmount: appointment.totalAmount
                }));
            }
        }
    );

    const columns = [
        { key: 'id', title: 'Booking ID' },
        { key: 'patientName', title: 'Patient' },
        { key: 'doctorName', title: 'Doctor' },
        { key: 'date', title: 'Date' },
        { key: 'time', title: 'Time' },
        { key: 'status', title: 'Status' },
        { key: 'consultationFee', title: 'Consultation Fee' },
        { key: 'totalAmount', title: 'Total Amount' },
    ];

    const handleRowClick = (appointment) => {
        console.log('Appointment selected:', appointment);
        navigate(`/appointments/view/${appointment.id}`);
        // Handle appointment selection, e.g., open detail view
    };

    const handleAddNew = () => {
        toggleBookingForm();
    };

    const handleView = (appointment) => {
        console.log('View appointment:', appointment);
        navigate(`/appointments/view/${appointment.id}`);
        // Implement view logic
    };

    const handleEdit = (appointment) => {
        console.log('Edit appointment:', appointment);
        // Implement edit logic
    };

    const handleDelete = (appointment) => {
        console.log('Delete appointment:', appointment);
        // Implement delete logic
    };

    const toggleBookingForm = () => {
        setShowBookingForm(!showBookingForm);
    };

    // Handle loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader size={100} color="#4B82F6" className="text-center" />
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className="p-4 text-red-500">
                Error loading appointments: {error.message}
                <button 
                    onClick={() => refetch()} 
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-4">
            {showBookingForm ? (
                <AppointmentBooking 
                    onBookingComplete={() => {
                        // Refetch appointments after booking
                        refetch();
                        toggleBookingForm();
                    }}
                />
            ) : (
                <Table
                    title="Appointments"
                    addButtonText="Book New Appointment"
                    columns={columns}
                    data={appointmentsResponse}
                    onAddNew={handleAddNew}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    handleRowClick={handleRowClick}
                />
            )}
        </div>
    );
};

export default Appointment;