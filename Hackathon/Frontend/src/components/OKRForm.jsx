import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import CustomSelect from './customComponents/CustomSelect';
import { submitOKR, checkIsYourOKR } from '../api/Service/okr';

const StylishOKRForm = () => {
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    leetcodeId: '',
    githubId: '',
    linkedinId: '',
    objective: '',
    keyResults: '',
    skillFocus: '',
    ambiguityLevel: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isYourOKR, setIsYourOKR] = useState(false);
  const [isYourOKRDisabled, setIsYourOKRDisabled] = useState(false);

  const ambiguityOptions = [
    { value: 'vague', label: 'Vague' },
    { value: 'specific', label: 'Specific' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, ambiguityLevel: value }));
    if (errors.ambiguityLevel) {
      setErrors(prev => ({ ...prev, ambiguityLevel: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'userId', 'name', 'leetcodeId', 'githubId', 'linkedinId',
      'objective', 'keyResults', 'skillFocus', 'ambiguityLevel'
    ];

    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (formData.userId) {
      checkIsYourOKR(formData.userId).then(res => {
        if (res.exists) {
          setIsYourOKRDisabled(true);
          setIsYourOKR(false);
        } else {
          setIsYourOKRDisabled(false);
        }
      });
    }
  }, [formData.userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setMessage('');
    const payload = {
      ...formData,
      keyResults: formData.keyResults.split(',').map(s => s.trim()).filter(Boolean),
      skillFocus: formData.skillFocus.split(',').map(s => s.trim()).filter(Boolean),
      isYourOKR: isYourOKR,
    };
    try {
      await submitOKR(payload);
      setMessage('🎉 OKR submitted successfully!');
      setFormData({
        userId: '', name: '', leetcodeId: '', githubId: '', linkedinId: '',
        objective: '', keyResults: '', skillFocus: '', ambiguityLevel: ''
      });
      setIsYourOKR(false);
      setCurrentStep(1);
    } catch (error) {
      setMessage('❌ Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    const step1Fields = ['userId', 'name', 'leetcodeId', 'githubId', 'linkedinId'];
    const step1Valid = step1Fields.every(field => formData[field].trim());
    
    if (currentStep === 1 && step1Valid) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <span className="text-2xl text-white">🎯</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Submit Your OKR</h1>
          <p className="text-lg text-gray-600">Define your objectives and key results for success</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
            } transition-all duration-300`}>
              {currentStep > 1 ? '✓' : '1'}
            </div>
            <div className={`w-20 h-1 ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'} transition-all duration-300`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
            } transition-all duration-300`}>
              2
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
                <p className="text-gray-600">Let's start with your basic details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Input
                    name="userId"
                    placeholder="User ID"
                    value={formData.userId}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 ${
                      errors.userId ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">🆔</span>
                  {errors.userId && (
                    <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.userId}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Input
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 ${
                      errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">👤</span>
                  {errors.name && (
                    <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.name}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Input
                    name="leetcodeId"
                    placeholder="LeetCode Username"
                    value={formData.leetcodeId}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 ${
                      errors.leetcodeId ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">💻</span>
                  {errors.leetcodeId && (
                    <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.leetcodeId}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Input
                    name="githubId"
                    placeholder="GitHub Username"
                    value={formData.githubId}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 ${
                      errors.githubId ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">🐙</span>
                  {errors.githubId && (
                    <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.githubId}
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 relative">
                  <Input
                    name="linkedinId"
                    placeholder="LinkedIn Profile URL"
                    value={formData.linkedinId}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 ${
                      errors.linkedinId ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">💼</span>
                  {errors.linkedinId && (
                    <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.linkedinId}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!['userId', 'name', 'leetcodeId', 'githubId', 'linkedinId'].every(field => formData[field].trim())}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">OKR Details</h2>
                <p className="text-gray-600">Define your objectives and key results</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Objective</label>
                  <div className="relative">
                    <textarea
                      name="objective"
                      placeholder="What do you want to achieve? (e.g., Develop robust backend skills)"
                      value={formData.objective}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 resize-none ${
                        errors.objective ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                    {errors.objective && (
                      <div className="mt-1 text-red-500 text-sm flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.objective}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Results</label>
                  <div className="relative">
                    <textarea
                      name="keyResults"
                      placeholder="List your key results separated by commas (e.g., Complete 3 Node.js projects, Master MongoDB, Complete Express.js tutorials)"
                      value={formData.keyResults}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 resize-none ${
                        errors.keyResults ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                    {errors.keyResults && (
                      <div className="mt-1 text-red-500 text-sm flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.keyResults}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skill Focus</label>
                    <Input
                      name="skillFocus"
                      placeholder="Skills to focus on (comma separated)"
                      value={formData.skillFocus}
                      onChange={handleInputChange}
                      className={`pl-10 pr-4 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 ${
                        errors.skillFocus ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">🎯</span>
                    {errors.skillFocus && (
                      <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.skillFocus}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ambiguity Level</label>
                    <CustomSelect
                      placeholder="Select Ambiguity Level"
                      options={ambiguityOptions}
                      value={formData.ambiguityLevel}
                      onChange={handleSelectChange}
                    />
                    {errors.ambiguityLevel && (
                      <div className="text-red-500 text-sm flex items-center mt-1">
                        <span className="mr-1">⚠️</span>
                        {errors.ambiguityLevel}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="isYourOKR"
                    checked={isYourOKR}
                    onChange={e => setIsYourOKR(e.target.checked)}
                    disabled={isYourOKRDisabled}
                    className="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isYourOKR" className="text-gray-700 font-medium">
                    Is this your OKR?
                  </label>
                  {isYourOKRDisabled && (
                    <span className="ml-2 text-sm text-gray-400">(Already set for another OKR)</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || isYourOKRDisabled}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </span>
                  ) : (
                    'Submit OKR 🚀'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Success/Error Message */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl text-center font-medium ${
              message.includes('successfully') 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>Need help? Check our <span className="text-blue-500 cursor-pointer hover:underline">OKR guidelines</span></p>
        </div>
      </div>
    </div>
  );
};

export default StylishOKRForm;