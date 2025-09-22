import React, { useState } from 'react';
import { searchCandidates, saveShortlist } from '../api';

const CandidateSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shortlistName, setShortlistName] = useState('');
  const [showShortlistForm, setShowShortlistForm] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);
    setSelectedCandidates([]);

    try {
      const data = await searchCandidates(query);
      setResults(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleCandidateSelection = (candidateIndex) => {
    setSelectedCandidates(prev => {
      if (prev.includes(candidateIndex)) {
        return prev.filter(idx => idx !== candidateIndex);
      } else {
        return [...prev, candidateIndex];
      }
    });
  };

  const handleSaveShortlist = async (e) => {
    e.preventDefault();
    if (!shortlistName.trim() || selectedCandidates.length === 0) return;

    try {
      await saveShortlist(shortlistName, selectedCandidates);
      setSaveMessage(`Shortlist "${shortlistName}" saved successfully!`);
      setShortlistName('');
      setShowShortlistForm(false);
      setSelectedCandidates([]);
      
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-3">
          Candidate Search
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Use natural language to find the perfect candidates. Try: "Find top 5 React developers in Casablanca with 2-5 years experience"
        </p>
      </div>

      {/* Enhanced Search Form */}
      <form onSubmit={handleSearch} className="card p-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="query" className="block text-sm font-semibold text-slate-700 mb-3">
              Search Query
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., Find top 5 React developers in Casablanca, 2-5 years experience"
                className="input-field pl-12 text-lg"
                disabled={loading}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching for candidates...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Candidates
              </span>
            )}
          </button>
        </div>
      </form>

      {/* Enhanced Success Message */}
      {saveMessage && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-400 text-emerald-700 px-6 py-4 rounded-xl shadow-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{saveMessage}</span>
          </div>
        </div>
      )}

      {/* Enhanced Error Message */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-xl shadow-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <strong className="font-semibold">Error:</strong>
              <span className="ml-2">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Results */}
      {results.length > 0 && (
        <div className="card p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                <svg className="w-6 h-6 mr-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Search Results
              </h2>
              <p className="text-slate-600 mt-1">Found {results.length} matching candidates</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center px-4 py-2 bg-slate-100 rounded-full">
                <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-slate-700">
                  {selectedCandidates.length} selected
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 mb-8">
            {results.map((result, index) => (
              <div
                key={index}
                className={`candidate-card group ${selectedCandidates.includes(result.index) ? 'selected' : ''}`}
                onClick={() => toggleCandidateSelection(result.index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-slate-700">
                            {result.firstName.charAt(0)}{result.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-700">
                            {result.firstName} {result.lastName}
                          </h3>
                          <div className="flex items-center mt-1">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              Score: {result.score}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="font-medium">{result.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                          </svg>
                        </div>
                        <span className="font-medium">{result.experienceYears} years exp.</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="font-medium truncate">{result.email}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      {result.skills && result.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-sm text-emerald-600 font-medium mb-3">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {result.reason}
                      </span>
                    </p>
                    
                    {/* Job Recommendations */}
                    {result.recommendedJobs && result.recommendedJobs.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                          </svg>
                          Recommended Jobs ({result.recommendedJobs.length})
                        </h4>
                        <div className="space-y-2">
                          {result.recommendedJobs.map((jobRec, jobIndex) => (
                            <div key={jobIndex} className="text-sm">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <span className="font-medium text-blue-800">
                                    {jobRec.job.title}
                                  </span>
                                  <span className="text-blue-600 ml-2 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {jobRec.job.location}
                                  </span>
                                </div>
                                <span className="text-blue-600 font-medium">
                                  Match: {jobRec.matchScore}
                                </span>
                              </div>
                              {jobRec.matchedSkills.length > 0 && (
                                <div className="text-blue-600 text-xs mt-1">
                                  Skills: {jobRec.matchedSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                                  {jobRec.locationMatch && <span className="ml-2">Location match</span>}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.includes(result.index)}
                      onChange={() => toggleCandidateSelection(result.index)}
                      className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Shortlist Actions */}
          <div className="border-t pt-4">
            {!showShortlistForm ? (
              <button
                onClick={() => setShowShortlistForm(true)}
                disabled={selectedCandidates.length === 0}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save {selectedCandidates.length} Selected as Shortlist
                </span>
              </button>
            ) : (
              <form onSubmit={handleSaveShortlist} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Save Shortlist</h3>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={shortlistName}
                    onChange={(e) => setShortlistName(e.target.value)}
                    placeholder="Enter shortlist name"
                    className="input-field flex-1"
                    required
                  />
                  <button
                    type="submit"
                    disabled={!shortlistName.trim()}
                    className="btn-primary disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowShortlistForm(false);
                      setShortlistName('');
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateSearch;
