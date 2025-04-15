import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetQuery } from '../../../api/apiCall';
import API_ENDPOINTS from '../../../api/apiEndpoint';

const DoctorPrescription = ({ onSavePrescription }) => {
  const { id } = useParams();
  
  // Fetch prescription data
  const { data: prescriptionData, isLoading, error } = useGetQuery(
    `${API_ENDPOINTS.BOOKINGS.GET_SINGLE}/${id}`, 
    ['prescription', id],
    {
      retry: 2,
      select: (response) => {
        // Assuming the API returns a single appointment object
        const prescriptionData = response || response;
        return prescriptionData;
      }
    }
  );
console.log('Prescription data:', prescriptionData);
  // State for editable fields
  const [editedMedications, setEditedMedications] = useState([]);
  const [editedTests, setEditedTests] = useState([]);
  const [diagnosis, setDiagnosis] = useState('');
  const [patientDetails, setPatientDetails] = useState({});
  const [doctorDetails, setDoctorDetails] = useState({});
  const [prescriptionDate, setPrescriptionDate] = useState(new Date());
  const [followUp, setFollowUp] = useState({ recommended: false });

  // Update state when prescription data is loaded
  useEffect(() => {
    if (prescriptionData) {
      // Format medications from API response format to component format
      const formattedMeds = prescriptionData.prescription.map(med => ({
        name: med.medicineName || '',
        dosage: med.dosage || '',
        frequency: med.frequency || '',
        duration: med.duration || '',
        instructions: med.instructions || ''
      })) || [];
      
      setEditedMedications(formattedMeds);
      setEditedTests(prescriptionData.tests || []);
      setDiagnosis(prescriptionData.diagnosis || '');
      
      // Additional data would come from appointment or patient details
      // This is placeholder until we have the actual data structure
      setPatientDetails({
        name: prescriptionData.patientName || 'patient testing booking appoinment',
        age: prescriptionData.patientAge || '',
        gender: prescriptionData.patientGender || '',
        weight: prescriptionData.patientWeight || '',
        height: prescriptionData.patientHeight || ''
      });
      
      setDoctorDetails({
        name: prescriptionData.doctorName || 'doctor testing',
        specialization: prescriptionData.specialization || '',
        registrationNumber: prescriptionData.registrationNumber || ''
      });
      
      setPrescriptionDate(new Date(prescriptionData.createdAt || Date.now()));
      
      setFollowUp({
        recommended: prescriptionData.followUp?.recommended || false,
        date: prescriptionData.followUp?.date ? new Date(prescriptionData.followUp.date) : new Date(),
        reason: prescriptionData.followUp?.reason || ''
      });
    }
  }, [prescriptionData]);

  // Available test options
  const testOptions = [
    'Blood Test', 'Urine Test', 'X-Ray', 
    'ECG', 'MRI Scan', 'CT Scan', 
    'Lipid Profile', 'Thyroid Function Test'
  ];

  // Function to add a new medication
  const addMedication = () => {
    setEditedMedications([
      ...editedMedications, 
      { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
    ]);
  };

  // Function to update medication
  const updateMedication = (index, field, value) => {
    const updatedMedications = [...editedMedications];
    updatedMedications[index][field] = value;
    setEditedMedications(updatedMedications);
  };

  // Function to remove a medication
  const removeMedication = (index) => {
    setEditedMedications(editedMedications.filter((_, i) => i !== index));
  };

  // Function to toggle test selection
  const toggleTest = (test) => {
    setEditedTests(prevTests => 
      prevTests.includes(test)
        ? prevTests.filter(t => t !== test)
        : [...prevTests, test]
    );
  };

  // Save prescription
  const savePrescription = () => {
    // Format medications to match API expected format
    const formattedMeds = editedMedications.map(med => ({
      medicineName: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      duration: med.duration,
      instructions: med.instructions
    }));
    
    const updatedPrescription = {
      appointmentId: prescriptionData?.appointmentId || id,
      patientId: prescriptionData?.patientId,
      doctorId: prescriptionData?.doctorId,
      medicines: formattedMeds,
      tests: editedTests,
      diagnosis: diagnosis,
      followUp: followUp,
      _id: prescriptionData?._id
    };

    console.log('Updated Prescription:', updatedPrescription);
    
    if (onSavePrescription) {
      onSavePrescription(updatedPrescription);
    }

    alert('Prescription Updated Successfully');
  };

  if (isLoading) return <div className="p-6">Loading prescription data...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading prescription: {error.message}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Patient Information */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Patient Details</h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {patientDetails.name}</p>
            {patientDetails.age && <p><strong>Age:</strong> {patientDetails.age}</p>}
            {patientDetails.gender && <p><strong>Gender:</strong> {patientDetails.gender}</p>}
            {patientDetails.weight && <p><strong>Weight:</strong> {patientDetails.weight} kg</p>}
            {patientDetails.height && <p><strong>Height:</strong> {patientDetails.height}</p>}
          </div>
        </div>

        {/* Doctor Information */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Doctor Details</h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {doctorDetails.name}</p>
            {doctorDetails.specialization && <p><strong>Specialization:</strong> {doctorDetails.specialization}</p>}
            {doctorDetails.registrationNumber && <p><strong>Reg. Number:</strong> {doctorDetails.registrationNumber}</p>}
            <p><strong>Date:</strong> {prescriptionDate.toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Diagnosis */}
      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">
          Diagnosis
        </label>
        <textarea
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows="3"
          placeholder="Enter diagnosis details"
        />
      </div>

      {/* Medications */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Medications
          <button 
            onClick={addMedication}
            className="ml-4 bg-green-500 text-white px-2 py-1 rounded text-sm"
          >
            + Add Medication
          </button>
        </h3>
        {editedMedications.map((med, index) => (
          <div key={index} className="border p-4 rounded-md mb-3">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                value={med.name}
                onChange={(e) => updateMedication(index, 'name', e.target.value)}
                placeholder="Medication Name"
                className="border p-2 rounded"
              />
              <input
                type="text"
                value={med.dosage}
                onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                placeholder="Dosage"
                className="border p-2 rounded"
              />
              <input
                type="text"
                value={med.frequency}
                onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                placeholder="Frequency"
                className="border p-2 rounded"
              />
              <input
                type="text"
                value={med.duration}
                onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                placeholder="Duration"
                className="border p-2 rounded"
              />
            </div>
            <textarea
              value={med.instructions || ''}
              onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
              placeholder="Special Instructions"
              className="w-full p-2 border rounded mt-2"
              rows="2"
            />
            <button 
              onClick={() => removeMedication(index)}
              className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Recommended Tests */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Recommended Tests
        </h3>
        <div className="grid md:grid-cols-3 gap-2">
          {testOptions.map((test) => (
            <label key={test} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={editedTests.includes(test)}
                onChange={() => toggleTest(test)}
                className="form-checkbox"
              />
              <span className="ml-2">{test}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Follow-up Details */}
      {followUp?.recommended && (
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-semibold text-blue-800 mb-2">Follow-up Recommendation</h3>
          <p>
            <strong>Date:</strong> {followUp.date.toLocaleDateString()}
          </p>
          <p>
            <strong>Reason:</strong> {followUp.reason}
          </p>
        </div>
      )}

      {/* Save Prescription Button */}
      <div className="mt-6 flex justify-end">
        <button 
          onClick={savePrescription}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Save Prescription
        </button>
      </div>
    </div>
  );
};

export default DoctorPrescription;