import React, { useState, useEffect } from 'react';
import { useGetQuery, usePostMutation } from '../../api/apiCall';
import API_ENDPOINTS from '../../api/apiEndpoint';

const AppointmentBooking = () => {
  // State for form data using the new structure
  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    patientDetails: {
      name: "",
      mobile: "",
      email: "", // Keeping email for notification purposes
      address: "",
      gender: "",
      bloodGroup: "",
      allergies: ""
    },
    consultationFee: "",
    serviceCharge: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Use React Query to fetch doctors data
  const { 
    data: doctorsData, 
    isLoading: loading, 
    error: doctorsError 
  } = useGetQuery('/api/v1/doctors', ['doctors'], {
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      console.error('Error fetching doctors:', error);
    }
  });

  // Extract doctors array from the response
  const doctors = doctorsData?.data || [];
  console.log('Doctors:', doctors);
  
  // Use mutation for booking appointment
  const bookAppointment = usePostMutation(API_ENDPOINTS.BOOKINGS?.BOOK_APPOINTMENT || 'api/v1/bookings/book/appointment/receptionist', {
    onSuccess: () => {
      setSubmitSuccess(true);
      // Reset form
      setFormData({
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        patientDetails: {
          name: "",
          mobile: "",
          email: "",
          address: "",
          gender: "",
          bloodGroup: "",
          allergies: ""
        },
        consultationFee: "",
        serviceCharge: ""
      });
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    },
    onError: (error) => {
      console.error('Error booking appointment:', error);
      // Handle error (could set an error state here to show to user)
    }
  });

  // Handle input changes for top-level fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
    
    // Update fees if doctor is selected
    if (name === 'doctorId' && value) {
      const selectedDoctor = doctors.find(doctor => doctor.id === value);
      if (selectedDoctor) {
        setFormData({
          ...formData,
          doctorId: value,
          consultationFee: selectedDoctor.fee.toString(),
          serviceCharge: selectedDoctor.serviceCharge.toString()
        });
      }
    }
  };

  // Handle input changes for nested patient details
  const handlePatientDetailChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      patientDetails: {
        ...formData.patientDetails,
        [name]: value
      }
    });
    
    // Clear error when field is edited
    if (formErrors[`patientDetails.${name}`]) {
      setFormErrors({ ...formErrors, [`patientDetails.${name}`]: '' });
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!formData.patientDetails.name.trim()) {
      errors['patientDetails.name'] = 'Patient name is required';
    }
    
    if (!formData.patientDetails.mobile.trim()) {
      errors['patientDetails.mobile'] = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.patientDetails.mobile)) {
      errors['patientDetails.mobile'] = 'Please enter a valid 10-digit mobile number';
    }
    
    if (formData.patientDetails.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.patientDetails.email)) {
      errors['patientDetails.email'] = 'Please enter a valid email address';
    }
    
    if (!formData.patientDetails.address.trim()) {
      errors['patientDetails.address'] = 'Address is required';
    }
    
    if (!formData.patientDetails.gender) {
      errors['patientDetails.gender'] = 'Please select gender';
    }
    
    if (!formData.doctorId) {
      errors.doctorId = 'Please select a doctor';
    }
    
    if (!formData.appointmentDate) {
      errors.appointmentDate = 'Please select appointment date';
    }
    
    if (!formData.appointmentTime) {
      errors.appointmentTime = 'Please select preferred time';
    }
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Format the data for the API
    const appointmentData = {
      doctorId: formData.doctorId, // Send the MongoDB _id directly
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      patientDetails: {
        ...formData.patientDetails,
        mobile: formData.patientDetails.mobile ? parseInt(formData.patientDetails.mobile) : ''
      },
      consultationFee: parseFloat(formData.consultationFee),
      serviceCharge: parseFloat(formData.serviceCharge)
    };
    
    // Submit data using the mutation
    bookAppointment.mutate(appointmentData);
  };

  // Get selected doctor info
  const getSelectedDoctor = () => {
    if (!formData.doctorId) return null;
    return doctors.find(doctor => doctor.id === formData.doctorId);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state if doctors couldn't be loaded
  if (doctorsError) {
    return (
      <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>Unable to load doctors. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Book an Appointment</h2>
      
      {submitSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          Appointment booked successfully!
        </div>
      )}

      {bookAppointment.isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>There was an error booking the appointment. Please try again.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Select Doctor & Appointment Time</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Doctor Selection - Modified to show only name and fee */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Select Doctor *</label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${formErrors.doctorId ? 'border-red-500' : 'border-gray-300'}`}
                disabled={bookAppointment.isLoading}
              >
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - ₹{doctor.fee}
                  </option>
                ))}
              </select>
              {formErrors.doctorId && (
                <p className="text-red-500 text-sm mt-1">{formErrors.doctorId}</p>
              )}
            </div>
            
            {/* Doctor Fee Display */}
            {getSelectedDoctor() && (
              <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                <h4 className="font-medium text-gray-800">Fee Details</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Consultation Fee:</span>
                    <span className="font-medium">₹ {formData.consultationFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Charge:</span>
                    <span className="font-medium">₹ {formData.serviceCharge}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-200 font-semibold">
                    <span>Total:</span>
                    <span>₹ {parseInt(formData.consultationFee || 0) + parseInt(formData.serviceCharge || 0)}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Time availability display */}
            {getSelectedDoctor() && (
              <div className="md:col-span-2 bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-700">
                  Dr. {getSelectedDoctor().name} is available from {getSelectedDoctor().startTime} to {getSelectedDoctor().endTime}
                </p>
              </div>
            )}
            
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Appointment Date *</label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${formErrors.appointmentDate ? 'border-red-500' : 'border-gray-300'}`}
                min={new Date().toISOString().split('T')[0]}
                disabled={bookAppointment.isLoading}
              />
              {formErrors.appointmentDate && (
                <p className="text-red-500 text-sm mt-1">{formErrors.appointmentDate}</p>
              )}
            </div>
            
            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Preferred Time *</label>
              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${formErrors.appointmentTime ? 'border-red-500' : 'border-gray-300'}`}
                disabled={bookAppointment.isLoading}
                min={getSelectedDoctor()?.startTime || ''}
                max={getSelectedDoctor()?.endTime || ''}
              />
              {formErrors.appointmentTime && (
                <p className="text-red-500 text-sm mt-1">{formErrors.appointmentTime}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Patient Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patient Name */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Patient Name *</label>
              <input
                type="text"
                name="name"
                value={formData.patientDetails.name}
                onChange={handlePatientDetailChange}
                className={`w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${formErrors['patientDetails.name'] ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Full Name"
                disabled={bookAppointment.isLoading}
              />
              {formErrors['patientDetails.name'] && (
                <p className="text-red-500 text-sm mt-1">{formErrors['patientDetails.name']}</p>
              )}
            </div>
            
            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Mobile Number *</label>
              <input
                type="tel"
                name="mobile"
                value={formData.patientDetails.mobile}
                onChange={handlePatientDetailChange}
                className={`w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${formErrors['patientDetails.mobile'] ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="10-digit mobile number"
                disabled={bookAppointment.isLoading}
              />
              {formErrors['patientDetails.mobile'] && (
                <p className="text-red-500 text-sm mt-1">{formErrors['patientDetails.mobile']}</p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Email (Optional)</label>
              <input
                type="email"
                name="email"
                value={formData.patientDetails.email}
                onChange={handlePatientDetailChange}
                className={`w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${formErrors['patientDetails.email'] ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="For appointment confirmation"
                disabled={bookAppointment.isLoading}
              />
              {formErrors['patientDetails.email'] && (
                <p className="text-red-500 text-sm mt-1">{formErrors['patientDetails.email']}</p>
              )}
            </div>
            
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Gender *</label>
              <select
                name="gender"
                value={formData.patientDetails.gender}
                onChange={handlePatientDetailChange}
                className={`w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${formErrors['patientDetails.gender'] ? 'border-red-500' : 'border-gray-300'}`}
                disabled={bookAppointment.isLoading}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {formErrors['patientDetails.gender'] && (
                <p className="text-red-500 text-sm mt-1">{formErrors['patientDetails.gender']}</p>
              )}
            </div>
            
            {/* Blood Group */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.patientDetails.bloodGroup}
                onChange={handlePatientDetailChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={bookAppointment.isLoading}
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            
            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">Address *</label>
              <textarea
                name="address"
                value={formData.patientDetails.address}
                onChange={handlePatientDetailChange}
                className={`w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${formErrors['patientDetails.address'] ? 'border-red-500' : 'border-gray-300'}`}
                rows="2"
                placeholder="Full address"
                disabled={bookAppointment.isLoading}
              ></textarea>
              {formErrors['patientDetails.address'] && (
                <p className="text-red-500 text-sm mt-1">{formErrors['patientDetails.address']}</p>
              )}
            </div>
            
            {/* Allergies */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">Allergies/Medical Conditions</label>
              <textarea
                name="allergies"
                value={formData.patientDetails.allergies}
                onChange={handlePatientDetailChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows="2"
                placeholder="List any allergies or relevant medical conditions"
                disabled={bookAppointment.isLoading}
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md ${
              bookAppointment.isLoading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white transition-colors'
            }`}
            disabled={bookAppointment.isLoading}
          >
            {bookAppointment.isLoading ? 'Processing...' : 'Book Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentBooking;