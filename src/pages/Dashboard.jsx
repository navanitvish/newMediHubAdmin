import React from 'react';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Stethoscope, 
  Activity, 
  PieChart, 
  TestTube, 
  Clipboard 
} from 'lucide-react';

// Enhanced Dummy Data with More Comprehensive Stats
const DUMMY_DASHBOARD_STATS = {
  admin: {
    common: {
      totalAppointments: 1254,
      todayAppointments: 124,
      pendingAppointments: 42
    },
    specific: {
      revenue: {
        today: 45680,
        thisMonth: 562340,
        lastMonth: 498750
      },
      staff: {
        totalDoctors: 52,
        totalNurses: 95,
        totalAdminStaff: 35,
        totalLabTechs: 28
      },
      healthcare: {
        totalPatients: 6240,
        newPatientsThisMonth: 248,
        averagePatientSatisfaction: 4.7
      }
    }
  },
  doctor: {
    common: {
      totalAppointments: 254,
      todayAppointments: 24,
      pendingAppointments: 12
    },
    specific: {
      patients: {
        totalPatients: 640,
        newPatientsThisMonth: 48,
        criticalCases: 7
      },
      consultations: {
        completedToday: 18,
        pendingFollowups: 6,
        avgConsultationTime: 25
      }
    }
  },
  receptionist: {
    common: {
      totalAppointments: 754,
      todayAppointments: 64,
      pendingAppointments: 22
    },
    specific: {
      appointments: {
        scheduledToday: 64,
        canceledToday: 8,
        rescheduledToday: 4
      },
      patientFlow: {
        avgWaitTime: 15,
        checkedIn: 42,
        waitingRoom: 12
      }
    }
  },
  labTechnician: {
    common: {
      totalAppointments: 354,
      todayAppointments: 44,
      pendingAppointments: 16
    },
    specific: {
      tests: {
        totalTestsToday: 94,
        pendingResults: 22,
        completedResults: 72
      },
      departments: {
        bloodTests: 38,
        imagingTests: 26,
        specialtyTests: 30
      }
    }
  }
};

const StatCard = ({ icon: Icon, title, value, bgColor, textColor }) => (
  <div className={`p-6 bg-${bgColor}-50 rounded-xl shadow-md hover:shadow-lg transition-shadow`}>
    <div className="flex items-center">
      <div className={`flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-lg bg-${bgColor}-100`}>
        <Icon className={`w-6 h-6 text-${textColor}-600`} />
      </div>
      <div className="ml-5">
        <p className={`text-sm font-medium text-${textColor}-600`}>{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  // Simulating user auth - you'd typically get this from your auth context
  const user = {
    name: 'Navnit Vishwakarma',
    role: 'labTechnician' // Change this to test different roles: admin, doctor, receptionist, labTechnician
  };

  const stats = DUMMY_DASHBOARD_STATS[user.role];

  const renderCommonStats = () => (
    <div className="grid grid-cols-1 gap-5 mb-6 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard 
        icon={Calendar} 
        title="Total Appointments" 
        value={stats.common.totalAppointments} 
        bgColor="indigo" 
        textColor="indigo" 
      />
      <StatCard 
        icon={Activity} 
        title="Today's Appointments" 
        value={stats.common.todayAppointments} 
        bgColor="green" 
        textColor="green" 
      />
      <StatCard 
        icon={PieChart} 
        title="Pending Appointments" 
        value={stats.common.pendingAppointments} 
        bgColor="yellow" 
        textColor="yellow" 
      />
    </div>
  );


  const renderRoleSpecificStats = () => {
    switch (user.role) {
      case 'admin':
        return (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Revenue Overview</h3>
              <div className="space-y-3">
                <StatCard 
                  icon={DollarSign} 
                  title="Today's Revenue" 
                  value={`$${stats.specific.revenue.today.toLocaleString()}`} 
                  bgColor="blue" 
                  textColor="blue" 
                />
                <StatCard 
                  icon={DollarSign} 
                  title="Monthly Revenue" 
                  value={`$${stats.specific.revenue.thisMonth.toLocaleString()}`} 
                  bgColor="green" 
                  textColor="green" 
                />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Staff Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600">Doctors</p>
                  <p className="text-2xl font-bold">{stats.specific.staff.totalDoctors}</p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <p className="text-sm text-pink-600">Nurses</p>
                  <p className="text-2xl font-bold">{stats.specific.staff.totalNurses}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-indigo-600">Admin Staff</p>
                  <p className="text-2xl font-bold">{stats.specific.staff.totalAdminStaff}</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-sm text-teal-600">Lab Techs</p>
                  <p className="text-2xl font-bold">{stats.specific.staff.totalLabTechs}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Patient Insights</h3>
              <div className="space-y-3">
                <StatCard 
                  icon={Users} 
                  title="Total Patients" 
                  value={stats.specific.healthcare.totalPatients} 
                  bgColor="blue" 
                  textColor="blue" 
                />
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Patient Satisfaction</p>
                  <p className="text-2xl font-bold">{stats.specific.healthcare.averagePatientSatisfaction}/5</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'labTechnician':
        return (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Test Statistics</h3>
              <div className="space-y-3">
                <StatCard 
                  icon={TestTube} 
                  title="Total Tests Today" 
                  value={stats.specific.tests.totalTestsToday} 
                  bgColor="blue" 
                  textColor="blue" 
                />
                <StatCard 
                  icon={Clipboard} 
                  title="Pending Results" 
                  value={stats.specific.tests.pendingResults} 
                  bgColor="yellow" 
                  textColor="yellow" 
                />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Test Breakdown</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-red-600">Blood</p>
                  <p className="text-xl font-bold">{stats.specific.departments.bloodTests}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-green-600">Imaging</p>
                  <p className="text-xl font-bold">{stats.specific.departments.imagingTests}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-purple-600">Specialty</p>
                  <p className="text-xl font-bold">{stats.specific.departments.specialtyTests}</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      // Similar sections for doctor and receptionist...
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name} | {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
        </div>
        
        {renderCommonStats()}
        {renderRoleSpecificStats()}
      </div>
    </div>
  );
};

export default DashboardPage;