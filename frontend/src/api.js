// API helper functions for HR Agent backend
const API_BASE_URL = 'http://localhost:8000/api';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(`HTTP ${response.status}: ${errorText}`, response.status);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
}

// Search candidates with natural language query
export async function searchCandidates(query) {
  try {
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query
      }),
    });
    
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Failed to search candidates: ${error.message}`, 0);
  }
}

// Save a shortlist of candidates
export async function saveShortlist(name, candidateIndices) {
  try {
    const response = await fetch(`${API_BASE_URL}/shortlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        candidateIndices
      }),
    });
    
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Failed to save shortlist: ${error.message}`, 0);
  }
}

// Get all shortlists
export async function getShortlists() {
  try {
    const response = await fetch(`${API_BASE_URL}/shortlists`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Failed to get shortlists: ${error.message}`, 0);
  }
}

// Get specific shortlist details
export async function getShortlistDetails(name) {
  try {
    const response = await fetch(`${API_BASE_URL}/shortlist/${encodeURIComponent(name)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Failed to get shortlist details: ${error.message}`, 0);
  }
}

// Draft an outreach email
export async function draftEmail(recipients, jobTitle = 'Software Developer', tone = 'friendly', customSubject = '', customClosing = '') {
  try {
    const response = await fetch(`${API_BASE_URL}/draft-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipients,
        jobTitle,
        tone,
        customSubject,
        customClosing
      }),
    });
    
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Failed to draft email: ${error.message}`, 0);
  }
}

// Get HTML preview of email
export async function getEmailHtmlPreview(subject, text) {
  try {
    const response = await fetch(`${API_BASE_URL}/html-preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject,
        text
      }),
    });
    
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Failed to get HTML preview: ${error.message}`, 0);
  }
}

// Get analytics data
export async function getAnalytics() {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Failed to get analytics: ${error.message}`, 0);
  }
}

// Get all jobs
export async function getJobs() {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Failed to get jobs: ${error.message}`, 0);
  }
}

// Get specific job by ID
export async function getJob(jobId) {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Failed to get job: ${error.message}`, 0);
  }
}

export { ApiError };
