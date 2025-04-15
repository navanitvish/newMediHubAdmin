import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { usePostMutation, usePutMutation } from '../../../api/apiCall';
import API_ENDPOINTS from '../../../api/apiEndpoint';

const TestAddEdit = ({ test, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  });

  // Initialize POST and PUT queries
  const {
    mutate: addTest, 
    isLoading: isAdding, 
    error: addError 
  } = usePostMutation(API_ENDPOINTS.LAB.ADD_LAB);

  const { 
    mutate: editTest, 
    isLoading: isEditing, 
    error: editError 
  } = usePutMutation(API_ENDPOINTS.LAB.EDIT_LAB);

  useEffect(() => {
    // If editing an existing test, populate the form
    if (test) {
      setFormData({
        name: test.name || '',
        price: test.price || '',
        description: test.description || '',
        image: test.image || ''
      });
    }
  }, [test]);

  const handleChange = (e) => {
    const { name,description, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      [description]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.price) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Prepare submission data
    const submissionData = {
      ...formData,
      price: parseFloat(formData.price) // Ensure price is a number
    };

    // Determine whether to add or edit
    if (test) {
      // Editing existing test
      editTest(
        { 
          id: test.id, 
          ...submissionData 
        }, 
        {
          onSuccess: (response) => {
            onSave(response);
            onClose();
          },
          onError: (error) => {
            alert(`Error updating test: ${error.message}`);
          }
        }
      );
    } else {
      // Adding new test
      addTest(
        submissionData, 
        {
          onSuccess: (response) => {
            onSave(response);
            onClose();
          },
          onError: (error) => {
            alert(`Error adding test: ${error.message}`);
          }
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {test ? 'Edit Test' : 'Add New Test'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              type="button"
              onClick={onClose}
              disabled={isAdding || isEditing}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isAdding || isEditing}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isAdding || isEditing ? 'Saving...' : (test ? 'Update' : 'Save')}
            </button>
          </div>
        </form>

        {/* Error handling */}
        {(addError || editError) && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {addError?.message || editError?.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestAddEdit;