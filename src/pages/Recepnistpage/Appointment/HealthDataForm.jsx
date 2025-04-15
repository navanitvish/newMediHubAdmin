import React, { useState, useEffect } from 'react';
import { usePostMutation } from '../../../api/apiCall';
import API_ENDPOINTS from '../../../api/apiEndpoint';

const HealthDataForm = () => {
  const [formData, setFormData] = useState({
    patientId: '67e1339a89879f90247d69d9',
    appointment: '67e133da89879f90247d69e2',
    height: '5.8',
    weight: '70',
    bmi: '5.5',
    temperature: '102',
    pulseRate: '90',
    bloodPressure: '110',
    respiratoryRate: '54',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Initialize the API mutation hook
  const vitalBooking = usePostMutation(API_ENDPOINTS.BOOKINGS?.VITAL_BOOKING || '', {
    onSuccess: (data) => {
      setSubmitSuccess(true);
      console.log('Data submitted successfully:', data);
      
      // Reset form after successful submission
      setFormData({
        patientId: '',
        appointment: '',
        height: '',
        weight: '',
        bmi: '',
        temperature: '',
        pulseRate: '',
        bloodPressure: '',
        respiratoryRate: '',
        date: new Date().toISOString().split('T')[0]
      });

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    },
    onError: (error) => {
      console.error('Error submitting data:', error);
      alert('Failed to submit health data. Please try again.');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit data to API
    vitalBooking.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {submitSuccess && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Health data submitted successfully.</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-500 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Patient Vital Signs</h2>
            <p className="text-blue-100 mt-1">
              Enter patient vital measurements for tracking and analysis
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            {/* Hidden Fields */}
            <input type="hidden" name="patientId" value={formData.patientId} />
            <input type="hidden" name="appointment" value={formData.appointment} />
            
            {/* Date Selector */}
            <div className="mb-6">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Measurement
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Measurements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Height */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                  Height <span className="text-xs text-gray-500">(ft)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="height"
                    name="height"
                    placeholder="e.g., 5.8"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">ft</span>
                  </div>
                </div>
              </div>

              {/* Weight */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  Weight <span className="text-xs text-gray-500">(kg)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    placeholder="e.g., 70"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">kg</span>
                  </div>
                </div>
              </div>

              {/* BMI */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <label htmlFor="bmi" className="block text-sm font-medium text-gray-700 mb-2">
                  BMI
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="bmi"
                    name="bmi"
                    placeholder="e.g., 5.5"
                    value={formData.bmi}
                    onChange={handleChange}
                    className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Pulse Rate */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <label htmlFor="pulseRate" className="block text-sm font-medium text-gray-700 mb-2">
                  Pulse Rate <span className="text-xs text-gray-500">(bpm)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="pulseRate"
                    name="pulseRate"
                    placeholder="e.g., 90"
                    value={formData.pulseRate}
                    onChange={handleChange}
                    className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">bpm</span>
                  </div>
                </div>
              </div>

              {/* Temperature */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature <span className="text-xs text-gray-500">(°F)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="temperature"
                    name="temperature"
                    placeholder="e.g., 102"
                    value={formData.temperature}
                    onChange={handleChange}
                    className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">°F</span>
                  </div>
                </div>
              </div>

              {/* Blood Pressure */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <label htmlFor="bloodPressure" className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Pressure <span className="text-xs text-gray-500">(mmHg)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="bloodPressure"
                    name="bloodPressure"
                    placeholder="e.g., 110/70"
                    value={formData.bloodPressure}
                    onChange={handleChange}
                    className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">mmHg</span>
                  </div>
                </div>
              </div>

              {/* Respiratory Rate */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <label htmlFor="respiratoryRate" className="block text-sm font-medium text-gray-700 mb-2">
                  Respiratory Rate <span className="text-xs text-gray-500">(breaths/min)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="respiratoryRate"
                    name="respiratoryRate"
                    placeholder="e.g., 54"
                    value={formData.respiratoryRate}
                    onChange={handleChange}
                    className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">br/min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional information about patient's vital signs..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="mr-4 px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={vitalBooking.isLoading}
              >
                {vitalBooking.isLoading ? 'Saving...' : 'Save Vital Signs'}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Tips Section */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-medium text-blue-500 mb-3">Tips for Accurate Measurements</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>For blood pressure, ensure patient sits quietly for 5 minutes before taking reading.</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Measure temperature consistently - oral, axillary, or tympanic - and note the method.</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Count respiratory rate for a full minute when patient is at rest and unaware of being monitored.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HealthDataForm;