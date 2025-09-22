import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getAnalytics } from '../api';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Pipeline insights and candidate statistics.</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
        
        <button
          onClick={loadAnalytics}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-6">
        <div className="w-16 h-16 mb-2 bg-slate-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">No analytics data available</h2>
          <p className="text-gray-600 mb-4">We couldn't load analytics data. Please check your connection or try again.</p>
          <button onClick={loadAnalytics} className="btn-primary">Try Again</button>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const pipelineData = Object.entries(analytics.countByStage || {}).map(([stage, count]) => ({
    stage,
    count,
    percentage: Math.round((count / Object.values(analytics.countByStage).reduce((a, b) => a + b, 0)) * 100)
  }));

  const skillsData = (analytics.topSkills || []).map(([skill, count]) => ({
    skill,
    count
  }));

  const totalCandidates = Object.values(analytics.countByStage || {}).reduce((a, b) => a + b, 0);

  // Get ranking indicator for top skills
  const getRankIndicator = (index) => {
    if (index === 0) return <span className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-white">1</span>;
    if (index === 1) return <span className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center text-xs font-bold text-white">2</span>;
    if (index === 2) return <span className="w-4 h-4 bg-amber-600 rounded-full flex items-center justify-center text-xs font-bold text-white">3</span>;
    return <span className="w-4 h-4 bg-slate-400 rounded-full flex items-center justify-center text-xs font-bold text-white">{index + 1}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Pipeline insights and candidate statistics.</p>
        </div>
        <button
          onClick={loadAnalytics}
          className="btn-secondary"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">{totalCandidates}</div>
          <div className="text-gray-600 font-medium">Total Candidates</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {analytics.jobStats?.totalJobs || 0}
          </div>
          <div className="text-gray-600 font-medium">Active Jobs</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-secondary-600 mb-2">
            {Object.keys(analytics.countByStage || {}).length}
          </div>
          <div className="text-gray-600 font-medium">Pipeline Stages</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {skillsData.length}
          </div>
          <div className="text-gray-600 font-medium">Top Skills Tracked</div>
        </div>
      </div>

      {/* Job Analytics */}
      {analytics.jobStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Job Requirements */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Job Requirements</h2>
            </div>
            
            {analytics.jobStats.totalJobs > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-blue-900">Total Job Openings</span>
                  <span className="text-2xl font-bold text-blue-600">{analytics.jobStats.totalJobs}</span>
                </div>
                
                {analytics.jobStats.skillsInDemand && analytics.jobStats.skillsInDemand.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">🔥 Skills in Demand</h3>
                    <div className="space-y-2">
                      {analytics.jobStats.skillsInDemand.map(([skill, count], index) => (
                        <div key={skill} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="flex items-center space-x-2">
                            <span className="text-orange-500 font-bold">#{index + 1}</span>
                            <span className="text-gray-700">{skill}</span>
                          </span>
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                            {count} job{count > 1 ? 's' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {analytics.jobStats.locationDemand && analytics.jobStats.locationDemand.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Location Demand</h3>
                    <div className="space-y-2">
                      {analytics.jobStats.locationDemand.map(([location, count], index) => (
                        <div key={location} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-700">{location}</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                            {count} opening{count > 1 ? 's' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="w-12 h-12 mb-2 bg-slate-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                  </svg>
                </div>
                <p>No job data available</p>
              </div>
            )}
          </div>
          
          {/* Skills Gap Analysis */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">⚠️ Skills Gap Analysis</h2>
            </div>
            
            {analytics.skillsGapAnalysis ? (
              <div className="space-y-4">
                {analytics.skillsGapAnalysis.skillsShortage && analytics.skillsGapAnalysis.skillsShortage.length > 0 ? (
                  <div>
                    <h3 className="font-medium text-red-900 mb-3 flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                      Skills Shortage
                    </h3>
                    <div className="space-y-3">
                      {analytics.skillsGapAnalysis.skillsShortage.map((skill, index) => (
                        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-red-800">{skill.skill}</span>
                            <span className="text-red-600 text-sm">Gap: {skill.gap}</span>
                          </div>
                          <div className="text-sm text-red-600 mt-1">
                            Demand: {skill.demandCount} • Supply: {skill.supplyCount}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-green-600 mb-2">✅</div>
                    <p className="text-green-700 font-medium">No critical skills shortages detected</p>
                  </div>
                )}
                
                {analytics.skillsGapAnalysis.surplusSkills && analytics.skillsGapAnalysis.surplusSkills.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium text-blue-900 mb-3 flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      Surplus Skills
                    </h3>
                    <div className="space-y-2">
                      {analytics.skillsGapAnalysis.surplusSkills.map((skill, index) => (
                        <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-blue-800">{skill.skill}</span>
                            <span className="text-blue-600 text-sm">Surplus: +{skill.surplus}</span>
                          </div>
                          <div className="text-sm text-blue-600 mt-1">
                            Available: {skill.supplyCount} • Needed: {skill.demandCount}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="w-12 h-12 mb-2 bg-slate-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p>Skills gap analysis not available</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Stages Chart */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">🏢 Pipeline Distribution</h2>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="stage" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  formatter={[(value, name) => [value, 'Candidates']]}
                  labelFormatter={(label) => `Stage: ${label}`}
                />
                <Bar dataKey="count" fill="#667eea" radius={[4, 4, 0, 0]}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {pipelineData.map((item, index) => (
              <div key={item.stage} className="flex justify-between items-center text-sm">
                <span className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  {item.stage}
                </span>
                <span className="font-semibold">{item.count} ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Skills */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">🏆 Top Skills</h2>
          </div>
          
          {skillsData.length > 0 ? (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillsData} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="skill" type="category" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={[(value, name) => [value, 'Candidates']]}
                      labelFormatter={(label) => `Skill: ${label}`}
                    />
                    <Bar dataKey="count" fill="#764ba2" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 space-y-3">
                {skillsData.map((skill, index) => (
                  <div key={skill.skill} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getRankIndicator(index)}
                      <div>
                        <div className="font-semibold text-gray-900">{skill.skill}</div>
                        <div className="text-sm text-gray-500">Rank #{index + 1}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-secondary-600">{skill.count}</div>
                      <div className="text-xs text-gray-500">candidates</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p>No skills data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📈 Detailed Breakdown</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pipeline Details */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Pipeline Stages</h3>
            <div className="space-y-2">
              {pipelineData.map((stage, index) => (
                <div key={stage.stage} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-700">{stage.stage}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{stage.count}</span>
                    <span className="text-sm text-gray-500">({stage.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Details */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Skills Frequency</h3>
            <div className="space-y-2">
              {skillsData.map((skill, index) => (
                <div key={skill.skill} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="flex items-center space-x-2">
                    {getRankIndicator(index)}
                    <span className="text-gray-700">{skill.skill}</span>
                  </span>
                  <span className="font-semibold text-gray-900">{skill.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
