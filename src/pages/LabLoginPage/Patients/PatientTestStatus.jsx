import React, { useState, useEffect } from 'react';

const STATUS_COLORS = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800'
};

const PatientTestStatus = ({ patientId }) => {
  const [testStatuses, setTestStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestStatuses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulated API call
        const mockTestStatuses = [
          {
            id: 1,
            testName: 'Complete Blood Count (CBC)',
            orderDate: '2024-03-10',
            completionDate: null,
            status: 'In Progress'
          },
          {
            id: 2,
            testName: 'Lipid Profile',
            orderDate: '2024-03-05',
            completionDate: '2024-03-15',
            status: 'Completed'
          },
          {
            id: 3,
            testName: 'X-Ray Chest',
            orderDate: '2024-03-20',
            completionDate: null,
            status: 'Pending'
          }
        ];

        setTestStatuses(mockTestStatuses);
      } catch (err) {
        setError('Failed to fetch test statuses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestStatuses();
  }, [patientId]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Test Statuses</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-gray-500">Loading test statuses...</div>
      ) : (
        <div className="space-y-3">
          {testStatuses.map((test) => (
            <div 
              key={test.id} 
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div className="font-medium">{test.testName}</div>
                <div className="text-sm text-gray-600">
                  Ordered: {test.orderDate}
                  {test.completionDate && ` • Completed: ${test.completionDate}`}
                </div>
              </div>
              <div>
                <span 
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[test.status]}`}
                >
                  {test.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientTestStatus;