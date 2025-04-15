import React, { useState } from 'react';
import HealthDataForm from './HealthDataForm';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetQuery } from '../../../api/apiCall';
import API_ENDPOINTS from '../../../api/apiEndpoint';
import Loader from '../../../components/UI/Loader';
    
const TestPrescriptionDetail = () => {
  const [selectedTests, setSelectedTests] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
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
        const appointmentData = response || response;
        return appointmentData;
      }
    }
  );

  console.log('Appointment test:', appointment);

  const [openhealthDetail, setopenHealthDetail] = useState(false);
 
  // Function to handle test selection
  const handleTestSelection = (testId) => {
    setSelectedTests(prevTests => 
      prevTests.includes(testId)
        ? prevTests.filter(t => t !== testId)
        : [...prevTests, testId]
    );
  };

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

  // Get lab tests from the appointment object
  const labTests = appointment?.labTest || [];
  console.log('Lab Tests:', labTests);

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Test Prescription Details
      </h2>

      {/* Patient and Doctor Information */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <strong className="text-gray-600">Patient:</strong> {appointment.result?.patientId?.name}
          <div className="text-sm text-gray-500">
            Age: {appointment.patientId?.age} | Gender: {appointment.result?.patientId?.gender}
          </div>
        </div>
        <div>
          <strong className="text-gray-600">Doctor:</strong> {appointment.result?.doctorId?.name}
          <div className="text-sm text-gray-500">
            {appointment.result?.doctorId?.specialization}
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <strong>Booking ID:</strong> {appointment._id}
        </div>
        <div>
          <strong>Date:</strong> {appointment.result?.appointmentDate}
        </div>
        <div>
          <strong>Time:</strong> {appointment.result?.appointmentTime}
        </div>
        <div>
          <strong>Status:</strong>
          <span className={`
            px-2 py-1 rounded ml-2
            ${appointment.result?.bookingStatus === 'confirmed'
              ? 'bg-green-200 text-green-800'
              : 'bg-yellow-200 text-yellow-800'
            }
          `}>
            {appointment.result?.bookingStatus}
          </span>
        </div>
        <div>
          <strong>Consultation Fee:</strong> ₹{appointment.result?.consultationFee}
        </div>
        <div>
          <strong>Total Amount:</strong> ₹{appointment.result?.totalAmount}
        </div>
      </div>

      {/* Test Prescription Section */}
      <div className="bg-white p-4 rounded-lg shadow-inner">
        <h3 className="text-lg  md:text-xl  font-bold mb-3 text-gray-700">Prescribed Tests</h3>
        {labTests.length > 0 ? (
          <div className="space-y-3">
            {labTests.map((test) => (
              <div key={test._id} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={test._id}
                    checked={selectedTests.includes(test._id)}
                    onChange={() => handleTestSelection(test._id)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={test._id} className="text-gray-700">
                    {test.testName}
                  </label>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-gray-600 font-semibold">
                    ₹{test.price || 0}
                  </span>
                  <span className="text-sm text-gray-500">
                    Paid: ₹{test.totalPaid || 0} | Due: ₹{test.due || 0}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Payment Details */}
            <div className="mt-4 border-t pt-3">
              <h4 className="font-semibold mb-2">Payment History</h4>
              {labTests.map(test => (
                test.paidAmounts && test.paidAmounts.length > 0 ? (
                  <div key={`payments-${test._id}`} className="mb-3">
                    <p className="font-medium">{test.testName} Payments:</p>
                    {test.paidAmounts.map((payment, idx) => (
                      <div key={idx} className="text-sm text-gray-600 ml-4">
                        ₹{payment.amount || 0} on {new Date(payment.date).toLocaleDateString()}
                      </div>
                    ))}
                  </div>
                ) : null
              ))}
            </div>
            
            {/* Total Test Price */}
            <div className="mt-4 text-right">
              <div className="text-gray-700">
                <span>Total Price: ₹{labTests.reduce((sum, test) => sum + (test.price || 0), 0)}</span>
              </div>
              <div className="text-gray-700">
                <span>Total Paid: ₹{labTests.reduce((sum, test) => sum + (test.totalPaid || 0), 0)}</span>
              </div>
              <strong className="text-lg text-red-600">
                Total Due: ₹{labTests.reduce((sum, test) => sum + (test.due || 0), 0)}
              </strong>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No tests prescribed</p>
        )}
      </div>

      {/* Pay Remaining Button */}
      {labTests.length > 0 && labTests.some(test => test.due > 0) && (
        <div className="mt-4 flex justify-end">
          <button 
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Pay Remaining Amount
          </button>
        </div>
      )}

      {/* Health Data Form module */}
      <div className="mt-6">
        <button 
          onClick={() => setopenHealthDetail(!openhealthDetail)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          {openhealthDetail ? 'Hide Health Data Form' : 'Show Health Data Form'}
        </button>
        {openhealthDetail && <HealthDataForm />}
      </div>
    </div>
  );
};

export default TestPrescriptionDetail;