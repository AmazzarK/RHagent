import React, { useState, useEffect } from 'react';
import { getShortlists, getShortlistDetails } from '../api';

const ShortlistManager = () => {
  const [shortlists, setShortlists] = useState([]);
  const [selectedShortlist, setSelectedShortlist] = useState(null);
  const [shortlistDetails, setShortlistDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadShortlists();
  }, []);

  const loadShortlists = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getShortlists();
      setShortlists(data.shortlists || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShortlistClick = async (shortlistName) => {
    setSelectedShortlist(shortlistName);
    setLoading(true);
    setError('');

    try {
      const details = await getShortlistDetails(shortlistName);
      setShortlistDetails(details);
    } catch (err) {
      setError(err.message);
      setShortlistDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedShortlist(null);
    setShortlistDetails(null);
  };

  if (loading && !shortlists.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading shortlists...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📝 Shortlist Manager</h1>
        <p className="text-gray-600">
          Manage your saved candidate shortlists and view detailed information.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Shortlist Details View */}
      {selectedShortlist && shortlistDetails ? (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              📝 {shortlistDetails.name}
            </h2>
            <button
              onClick={handleBackToList}
              className="btn-secondary"
            >
              ← Back to Shortlists
            </button>
          </div>

          <div className="space-y-4">
            {shortlistDetails.candidates.map((candidate, index) => (
              <div key={index} className="candidate-card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {candidate.name}
                    </h3>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <div className="text-sm text-gray-600 mb-3">
                        <div className="flex flex-wrap gap-3">
                          <span className="flex items-center text-gray-500">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {candidate.location}
                          </span>
                          <span className="flex items-center text-gray-500">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                            </svg>
                            {candidate.experience} years
                          </span>
                          <span className="flex items-center text-gray-500">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {candidate.email}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Stage: <span className="font-medium">{candidate.stage}</span>
                        </span>
                      </p>
                      <p>📅 Available: {candidate.availability}</p>
                    </div>
                    
                    <div>
                      {candidate.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <p className="text-sm text-gray-500">
              Total: {shortlistDetails.candidates.length} candidate{shortlistDetails.candidates.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      ) : (
        /* Shortlists List View */
        <div className="card">
          {shortlists.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shortlists found</h3>
              <p className="text-gray-500 mb-4">
                Create your first shortlist by searching for candidates and saving your selections.
              </p>
              <button
                onClick={loadShortlists}
                className="btn-secondary"
              >
                Refresh
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Shortlists ({shortlists.length})
                </h2>
                <button
                  onClick={loadShortlists}
                  className="btn-secondary text-sm"
                  disabled={loading}
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {shortlists.map((shortlist, index) => (
                  <div
                    key={index}
                    className="candidate-card hover:bg-blue-50"
                    onClick={() => handleShortlistClick(shortlist.name)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">📝</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {shortlist.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {shortlist.count} candidate{shortlist.count !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-500">
                        {shortlist.candidates.join(', ')}
                        {shortlist.count > 3 && ` and ${shortlist.count - 3} more`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ShortlistManager;
