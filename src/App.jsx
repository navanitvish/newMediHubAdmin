import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import store from './store/store';

// Layouts
import MainLayout from './components/Layout/MainLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Appointment from './pages/Recepnistpage/Appointment';
import Doctor from './pages/Recepnistpage/Doctor';
import Patient from './pages/Recepnistpage/Patient';
import Lab from './pages/Recepnistpage/Lab';
import PatientList from './pages/LabLoginPage/Patients/PatientList';
import TestManagement from './pages/LabLoginPage/Test/TestManagement';
import AppointmentView from './pages/Recepnistpage/AppointmentView';
import TestList from './pages/LabLoginPage/TestList/TestList';
import TestViewPage from './pages/LabLoginPage/TestList/Testdetails';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />

               {/* Add more routes here based on role Receptionist */}
              <Route path="/appointments" element={<Appointment />} />
              <Route path="/appointments/view/:id" element={<AppointmentView />} />
              <Route path="/doctors" element={<Doctor />} />
              <Route path="/patients" element={<Patient />} />
              <Route path="/labs" element={<Lab />} />

               {/* Add more routes here based on role  Labs */}
               <Route path="/labpatient" element={<PatientList />} />
               <Route path="/tests" element={<TestManagement />} />
               <Route path="/testlist" element={<TestList />  } />
              <Route path="/testlist/view/:id" element={<TestViewPage />} />


              {/* Add more routes here based on role permissions */}

              {/* Default redirect to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;