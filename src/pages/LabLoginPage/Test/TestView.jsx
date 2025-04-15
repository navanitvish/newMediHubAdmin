import React from 'react';
import { X } from 'lucide-react';

const TestView = ({ test, onClose }) => {
  if (!test) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Test Details</h2>
        
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold text-gray-600">Test Name:</span>
            <span className="col-span-2">{test.name}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold text-gray-600">Email:</span>
            <span className="col-span-2">{test.email}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold text-gray-600">Price:</span>
            <span className="col-span-2">300</span>
          </div>
        



          


          
          <div className="grid grid-cols-3 gap-2">
            <span className="font-semibold text-gray-600">Role:</span>
            <span className="col-span-2">{test.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestView;