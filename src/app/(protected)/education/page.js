'use client'; // Add this line at the very top

import React, { useState } from 'react';
import { BookOpen, GraduationCap, Building2, Wallet, ArrowLeft, XCircle } from 'lucide-react'; // Added XCircle for message close

// Main App component
const App = () => {
  // State to manage the active section (tab)
  const [activeSection, setActiveSection] = useState('mentoring');
  // State to manage showing the mentoring content view
  const [showMentoringContent, setShowMentoringContent] = useState(false);
  // State for custom message display
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  // State to store the selected institute ID from the dropdown
  const [selectedInstituteId, setSelectedInstituteId] = useState(null);

  // Dummy data for institutes and scholarships
  const institutes = [
    { id: 1, name: 'Women in Tech Institute', link: 'https://www.witi.com/' }, // Example external link
    { id: 2, name: 'Leadership Academy for Women', link: 'https://www.womensleadership.org/' }, // Example external link
    { id: 3, name: 'Creative Arts & Design School', link: 'https://www.artinstitutes.edu/' }, // Example external link
  ];

  const scholarships = [
    { id: 1, name: 'STEM Scholarship for Women', description: 'Supports women pursuing degrees in Science, Technology, Engineering, and Mathematics.', link: 'https://www.aauw.org/resources/programs/fellowships-grants/current-opportunities/stem-scholarships/' }, // Example external link
    { id: 2, name: 'Global Women\'s Leadership Grant', description: 'A grant for aspiring women leaders to pursue higher education abroad.', link: 'https://www.globalwomensleadership.org/grant/' }, // Example external link
    { id: 3, name: 'Empowerment Scholarship Fund', description: 'Provides financial aid to women from underserved communities for vocational training.', link: 'https://www.empowermentfund.org/apply/' }, // Example external link
    { id: 4, name: 'Digital Skills Scholarship', description: 'A scholarship to help women acquire in-demand digital skills.', link: 'https://www.digitalskills.org/scholarships/' }, // Example external link
  ];

  // Function to display a custom message
  const displayMessage = (msg) => {
    setMessage(msg);
    setShowMessage(true);
    // Automatically hide the message after 3 seconds
    setTimeout(() => {
      setShowMessage(false);
      setMessage('');
    }, 3000);
  };

  // Function to handle showing the mentoring content (simulated internal view)
  const handleMentoringClick = () => {
    setShowMentoringContent(true);
  };

  // Function to go back from mentoring content
  const handleBackToMain = () => {
    setShowMentoringContent(false);
  };

  // Function to handle institute application - now opens external link
  const handleApplyInstitute = () => {
    if (selectedInstituteId) {
      const selected = institutes.find(inst => inst.id === selectedInstituteId);
      if (selected && selected.link) {
        window.open(selected.link, '_blank'); // Open in a new tab/window
        displayMessage(`Opening application for: ${selected.name}`);
      } else {
        displayMessage("Selected institute has no application link.");
      }
    } else {
      displayMessage("Please select an institute from the dropdown to apply.");
    }
  };

  // Function to handle "Apply Now" for scholarships - now opens external link
  const handleApplyScholarship = (scholarshipName, scholarshipLink) => {
    if (scholarshipLink) {
      window.open(scholarshipLink, '_blank'); // Open in a new tab/window
      displayMessage(`Opening application for: ${scholarshipName}`);
    } else {
      displayMessage(`No application link available for "${scholarshipName}".`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center p-4 font-inter relative">
      {/* Custom Message Display */}
      {showMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-pink-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 z-50 transition-all duration-300 ease-in-out animate-fade-in-down">
          <span>{message}</span>
          <button onClick={() => setShowMessage(false)} className="text-white hover:text-pink-200">
            <XCircle size={20} />
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-4xl border border-pink-200">
        {showMentoringContent ? (
          // Mentoring Content View
          <div className="text-center p-4 relative">
            <button
              className="absolute top-0 left-0 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300 ease-in-out flex items-center"
              onClick={handleBackToMain}
            >
              <ArrowLeft size={20} className="mr-2" /> Back
            </button>
            <h2 className="text-3xl font-bold text-pink-700 mb-4 mt-10">Mentoring Platform Content</h2>
            <p className="text-gray-700 mb-6 max-w-prose mx-auto">
              This is where the content from the mentoring platform (<a href="https://pink-sky-wisdom-hub.lovable.app/" target="_blank" rel="noopener noreferrer" className="text-pink-600 underline hover:text-pink-800">pink-sky-wisdom-hub.lovable.app</a>)
              would be displayed if it were integrated directly or fetched via an API.
              For demonstration, we are showing a placeholder. In a real Android app, the WebView might load this URL internally.
            </p>
            {/* You could embed an iframe here if CORS policies allowed and it was intended for web view */}
            {/* <iframe src="https://pink-sky-wisdom-hub.lovable.app/" title="Mentoring Platform" className="w-full h-96 border border-pink-300 rounded-lg"></iframe> */}
          </div>
        ) : (
          // Main App View (Tabs)
          <>
            {/* Header Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="bg-pink-100 p-4 rounded-full shadow-md mb-3">
                <GraduationCap size={48} className="text-pink-600" />
              </div>
              <h1 className="text-4xl font-extrabold text-pink-800 mb-2">Education Hub</h1>
              <p className="text-lg text-gray-600 text-center">Empowering women through knowledge and opportunity.</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-center border-b-2 border-pink-200 mb-8">
              <button
                className={`py-3 px-6 text-lg font-semibold rounded-t-lg transition-all duration-300 ease-in-out
                  ${activeSection === 'mentoring' ? 'bg-pink-600 text-white shadow-lg' : 'text-pink-700 hover:bg-pink-100'}`}
                onClick={() => setActiveSection('mentoring')}
              >
                <BookOpen className="inline-block mr-2" size={20} /> Mentoring
              </button>
              <button
                className={`py-3 px-6 text-lg font-semibold rounded-t-lg transition-all duration-300 ease-in-out
                  ${activeSection === 'institutes' ? 'bg-pink-600 text-white shadow-lg' : 'text-pink-700 hover:bg-pink-100'}`}
                onClick={() => setActiveSection('institutes')}
              >
                <Building2 className="inline-block mr-2" size={20} /> Institutes
              </button>
              <button
                className={`py-3 px-6 text-lg font-semibold rounded-t-lg transition-all duration-300 ease-in-out
                  ${activeSection === 'scholarships' ? 'bg-pink-600 text-white shadow-lg' : 'text-pink-700 hover:bg-pink-100'}`}
                onClick={() => setActiveSection('scholarships')}
              >
                <Wallet className="inline-block mr-2" size={20} /> Scholarships
              </button>
            </div>

            {/* Content Sections */}
            <div className="p-4 bg-pink-50 rounded-lg border border-pink-100 shadow-inner">
              {activeSection === 'mentoring' && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-pink-700 mb-4">Find Your Mentor</h2>
                  <p className="text-gray-700 mb-6 max-w-prose mx-auto">
                    Connect with experienced professionals who can guide you through your educational and career journey. Click the button below to explore our mentoring platform.
                  </p>
                  <button
                    className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300"
                    onClick={handleMentoringClick}
                  >
                    Go to Mentoring Platform
                  </button>
                </div>
              )}

              {activeSection === 'institutes' && (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-pink-700 mb-4">Institutes for Women</h2>
                  <p className="text-gray-700 mb-6 max-w-prose mx-auto">
                    Discover leading educational institutions and specialized programs designed to empower women. Select an institute to learn more or apply.
                  </p>
                  <div className="flex flex-col items-center space-y-4">
                    <select
                      className="w-full md:w-2/3 p-3 border border-pink-300 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-400 focus:border-transparent text-gray-700 bg-white"
                      onChange={(e) => setSelectedInstituteId(parseInt(e.target.value))}
                      defaultValue="" // Set a default empty value
                    >
                      <option value="" disabled>Select an Institute</option>
                      {institutes.map((institute) => (
                        <option key={institute.id} value={institute.id}>
                          {institute.name}
                        </option>
                      ))}
                    </select>
                    <button
                      className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300"
                      onClick={handleApplyInstitute}
                    >
                      Apply to Institute
                    </button>
                  </div>
                </div>
              )}

              {activeSection === 'scholarships' && (
                <div>
                  <h2 className="text-3xl font-bold text-pink-700 mb-4 text-center">Scholarships for Women</h2>
                  <p className="text-gray-700 mb-6 max-w-prose mx-auto text-center">
                    Explore a comprehensive list of scholarships and financial aid programs available exclusively for women to support their educational aspirations.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {scholarships.map((scholarship) => (
                      <div key={scholarship.id} className="bg-white p-5 rounded-lg shadow-md border border-pink-200 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-pink-800 mb-2">{scholarship.name}</h3>
                        <p className="text-gray-600">{scholarship.description}</p>
                        <button
                          className="mt-4 bg-pink-500 hover:bg-pink-600 text-white text-sm py-2 px-4 rounded-full shadow-md transition-colors duration-300"
                          onClick={() => handleApplyScholarship(scholarship.name, scholarship.link)}
                        >
                          Apply Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
