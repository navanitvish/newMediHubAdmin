import React, { useState } from 'react';
import { Users, FileText, Activity, Eye, ArrowLeft, ChevronDown } from 'lucide-react';
import PatientTestReportUpload from './PatientTestReportUpload';
import PatientTestStatus from './PatientTestStatus';
import Table from '../../../components/UI/Table'; // Import the Table component

// Keeping the existing DUMMY_PATIENTS data...
// Dummy patient data with more comprehensive information
const DUMMY_PATIENTS = [
  { 
    id: 'P12345', 
    name: 'John Doe', 
    age: 45, 
    gender: 'Male', 
    contactNumber: '(555) 123-4567',
    email: 'john.doe@example.com',
    medicalHistory: 'Hypertension, Diabetes Type 2',
    lastVisit: '2024-03-15'
  },
  { 
    id: 'P12346', 
    name: 'Jane Smith', 
    age: 38, 
    gender: 'Female', 
    contactNumber: '(555) 987-6543',
    email: 'jane.smith@example.com',
    medicalHistory: 'Asthma, Seasonal Allergies',
    lastVisit: '2024-03-10'
  },
  { 
    id: 'P12347', 
    name: 'Michael Johnson', 
    age: 52, 
    gender: 'Male', 
    contactNumber: '(555) 456-7890',
    email: 'michael.johnson@example.com',
    medicalHistory: 'Heart Disease, High Cholesterol',
    lastVisit: '2024-03-05'
  },
  { 
    id: 'P12348', 
    name: 'Emily Brown', 
    age: 29, 
    gender: 'Female', 
    contactNumber: '(555) 234-5678',
    email: 'emily.brown@example.com',
    medicalHistory: 'Thyroid Disorder',
    lastVisit: '2024-02-28'
  },
  { 
    id: 'P12349', 
    name: 'David Wilson', 
    age: 61, 
    gender: 'Male', 
    contactNumber: '(555) 345-6789',
    email: 'david.wilson@example.com',
    medicalHistory: 'Arthritis, Kidney Stones',
    lastVisit: '2024-03-20'
  },
  { 
    id: 'P12350', 
    name: 'Sarah Lee', 
    age: 35, 
    gender: 'Female', 
    contactNumber: '(555) 678-9012',
    email: 'sarah.lee@example.com',
    medicalHistory: 'Migraines, Stress Disorder',
    lastVisit: '2024-03-12'
  },
  { 
    id: 'P12351', 
    name: 'Robert Garcia', 
    age: 47, 
    gender: 'Male', 
    contactNumber: '(555) 789-0123',
    email: 'robert.garcia@example.com',
    medicalHistory: 'Sleep Apnea, Obesity',
    lastVisit: '2024-03-08'
  },
  { 
    id: 'P12352', 
    name: 'Amanda Martinez', 
    age: 33, 
    gender: 'Female', 
    contactNumber: '(555) 890-1234',
    email: 'amanda.martinez@example.com',
    medicalHistory: 'Pregnancy, Gestational Diabetes',
    lastVisit: '2024-03-18'
  },
  { 
    id: 'P12353', 
    name: 'Thomas Anderson', 
    age: 55, 
    gender: 'Male', 
    contactNumber: '(555) 901-2345',
    email: 'thomas.anderson@example.com',
    medicalHistory: 'Prostate Issues, Hypertension',
    lastVisit: '2024-03-03'
  },
  { 
    id: 'P12354', 
    name: 'Lisa Wang', 
    age: 41, 
    gender: 'Female', 
    contactNumber: '(555) 012-3456',
    email: 'lisa.wang@example.com',
    medicalHistory: 'PCOS, Insulin Resistance',
    lastVisit: '2024-03-14'
  }
];

const PatientList = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeView, setActiveView] = useState('list');
  const [expandedSections, setExpandedSections] = useState({
    personalInfo: true,
    contactInfo: true,
    testReports: true,
    testStatuses: true
  });

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setActiveView('details');
  };
  
  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setActiveView('details');
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Table column definitions for the patient list
  const patientColumns = [
    { key: 'id', title: 'Patient ID' },
    { key: 'name', title: 'Name' },
    { key: 'age', title: 'Age' },
    { key: 'gender', title: 'Gender' },
    { key: 'lastVisit', title: 'Last Visit' }
  ];

  const renderPatientList = () => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <Table 
        columns={patientColumns}
        data={DUMMY_PATIENTS}
        onRowClick={handlePatientSelect}
        onView={handleViewPatient}
        title="Patient Registry"
        addButtonText="Add New Patient"
      />
    </div>
  );

  const renderCollapsibleSection = (title, content, sectionKey) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-4 overflow-hidden">
      <div 
        onClick={() => toggleSection(sectionKey)}
        className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          {title}
        </h3>
        <ChevronDown 
          className={`transform transition-transform ${expandedSections[sectionKey] ? 'rotate-180' : ''}`} 
        />
      </div>
      {expandedSections[sectionKey] && (
        <div className="p-4">
          {content}
        </div>
      )}
    </div>
  );

  const renderPatientDetails = () => {
    if (!selectedPatient) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => setActiveView('list')}
            className="mr-4 text-blue-600 hover:text-blue-800 transition-colors flex items-center"
          >
            <ArrowLeft className="mr-2" /> Back to Patient List
          </button>
          <h2 className="text-3xl font-bold text-gray-800">{selectedPatient.name}'s Profile</h2>
        </div>

        {renderCollapsibleSection(
          'Personal Information', 
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Patient ID:</strong> {selectedPatient.id}</p>
              <p><strong>Age:</strong> {selectedPatient.age}</p>
              <p><strong>Gender:</strong> {selectedPatient.gender}</p>
            </div>
            <div>
              <p><strong>Medical History:</strong> {selectedPatient.medicalHistory}</p>
            </div>
          </div>,
          'personalInfo'
        )}

        {renderCollapsibleSection(
          'Contact Information',
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Phone:</strong> {selectedPatient.contactNumber}</p>
              <p><strong>Email:</strong> {selectedPatient.email}</p>
            </div>
            <div>
              <p><strong>Last Visit:</strong> {selectedPatient.lastVisit}</p>
            </div>
          </div>,
          'contactInfo'
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            {renderCollapsibleSection(
              'Test Reports', 
              <PatientTestReportUpload patientId={selectedPatient.id} />,
              'testReports'
            )}
          </div>
          
          <div>
            {renderCollapsibleSection(
              'Test Statuses', 
              <PatientTestStatus patientId={selectedPatient.id} />,
              'testStatuses'
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto min-h-screen">
      <div className="container mx-auto p-4">
      
        {activeView === 'list' && renderPatientList()}
        {activeView === 'details' && renderPatientDetails()}
      </div>
    </div>
  );
};

export default PatientList;