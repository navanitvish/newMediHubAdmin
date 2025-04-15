import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetQuery } from '../../api/apiCall';
import API_ENDPOINTS from '../../api/apiEndpoint';
import Loader from '../../components/UI/Loader';
import TestPrescriptionDetail from './Appointment/TestPrescriptionDetail';
import DoctorPrescription from './Appointment/DoctorPrescription';

const AppointmentView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { 
        data: appointment, 
        isLoading, 
        error 
    } = useGetQuery(
        `${API_ENDPOINTS.BOOKINGS.GET_SINGLE}/${id}`, 
        ['appointment', id],
        {
            retry: 2,
            select: (response) => {
                // Assuming the API returns a single appointment object
                const appointmentData = response.result || response;
                return appointmentData;
            }
        }
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader size={100} color="#4B82F6" className="text-center" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-500">
                Error loading appointment details: {error.message}
                <button 
                    onClick={() => navigate(-1)} 
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Appointment Details</h1>
                <button 
                    onClick={() => navigate(-1)} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Back to Appointments
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Patient Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Patient Information</h2>
                    <div className="space-y-2">
                        <p><strong>Name:</strong> {appointment.userId?.name || 'N/A'}</p>
                        <p><strong>Email:</strong> {appointment.userId?.email || 'N/A'}</p>
                        <p><strong>Mobile:</strong> {appointment.userId?.mobile || 'N/A'}</p>
                        <p><strong>Address:</strong> {appointment.userId?.address || 'N/A'}</p>
                    </div>
                </div>

                {/* Doctor Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Doctor Information</h2>
                    <div className="space-y-2">
                        <p><strong>Name:</strong> {appointment.doctorId?.name || 'N/A'}</p>
                        <p><strong>Department:</strong> {appointment.doctorId?.department || 'N/A'}</p>
                        <p><strong>Specialization:</strong> {appointment.doctorId?.specialization || 'N/A'}</p>
                        <p><strong>Contact Number:</strong> {appointment.doctorId?.contactNumber || 'N/A'}</p>
                    </div>
                </div>

                {/* Appointment Details */}
                <div className="bg-gray-50 p-4 rounded-lg col-span-full">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Appointment Details</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <strong>Booking ID:</strong> {appointment._id}
                        </div>
                        <div>
                            <strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}
                        </div>
                        <div>
                            <strong>Time:</strong> {appointment.appointmentTime}
                        </div>
                        <div>
                            <strong>Status:</strong> 
                            <span className={`
                                px-2 py-1 rounded ml-2
                                ${appointment.bookingStatus === 'confirmed' 
                                    ? 'bg-green-200 text-green-800' 
                                    : 'bg-yellow-200 text-yellow-800'
                                }
                            `}>
                                {appointment.bookingStatus}
                            </span>
                        </div>
                        <div>
                            <strong>Consultation Fee:</strong>₹{appointment.consultationFee}
                        </div>
                        <div>
                            <strong>Total Amount:</strong> ₹{appointment.totalAmount}
                        </div>
                    </div>
                </div>

                {/* Doctor priceription  */}

                <DoctorPrescription />


            <TestPrescriptionDetail/>


                
            </div>
        </div>
    );
};

export default AppointmentView;