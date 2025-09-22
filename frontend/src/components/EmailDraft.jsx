import React, { useState, useEffect } from 'react';
import { getShortlists, getShortlistDetails, draftEmail, getEmailHtmlPreview } from '../api';

const EmailDraft = () => {
  const [shortlists, setShortlists] = useState([]);
  const [selectedShortlist, setSelectedShortlist] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [jobTitle, setJobTitle] = useState('Software Developer');
  const [tone, setTone] = useState('friendly');
  const [customSubject, setCustomSubject] = useState('');
  const [customClosing, setCustomClosing] = useState('');
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);

  useEffect(() => {
    loadShortlists();
  }, []);

  const loadShortlists = async () => {
    try {
      const data = await getShortlists();
      setShortlists(data.shortlists || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShortlistChange = async (shortlistName) => {
    setSelectedShortlist(shortlistName);
    setEmail(null);
    setCustomSubject('');
    setCustomClosing('');

    if (!shortlistName) {
      setRecipients([]);
      return;
    }

    try {
      const details = await getShortlistDetails(shortlistName);
      setRecipients(details.candidates || []);
    } catch (err) {
      setError(err.message);
      setRecipients([]);
    }
  };

  const handleDraftEmail = async () => {
    if (recipients.length === 0) {
      setError('Please select a shortlist with recipients');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const emailData = await draftEmail(
        recipients,
        jobTitle,
        tone,
        customSubject,
        customClosing
      );
      setEmail(emailData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const emailData = await draftEmail(
        recipients,
        jobTitle,
        tone,
        customSubject,
        customClosing
      );
      setEmail(emailData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowHtmlPreview = async () => {
    if (!email) return;

    try {
      const htmlData = await getEmailHtmlPreview(email.subject, email.text);
      
      // Open HTML preview in new window
      const newWindow = window.open('', '_blank');
      newWindow.document.write(htmlData.html);
      newWindow.document.close();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Draft</h1>
        <p className="text-gray-600">
          Create personalized outreach emails for your candidate shortlists.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Email Configuration Form */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Configuration</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recipients Selection */}
          <div>
            <label htmlFor="shortlist" className="block text-sm font-medium text-gray-700 mb-2">
              Recipients (Shortlist)
            </label>
            <select
              id="shortlist"
              value={selectedShortlist}
              onChange={(e) => handleShortlistChange(e.target.value)}
              className="input-field"
            >
              <option value="">Select a shortlist...</option>
              {shortlists.map((shortlist, index) => (
                <option key={index} value={shortlist.name}>
                  {shortlist.name} ({shortlist.count} candidates)
                </option>
              ))}
            </select>
            
            {recipients.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Selected: {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}</p>
                <div className="mt-1">
                  {recipients.slice(0, 3).map((recipient, index) => (
                    <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-2">
                      {recipient.name}
                    </span>
                  ))}
                  {recipients.length > 3 && (
                    <span className="text-xs text-gray-500">+{recipients.length - 3} more</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Job Title */}
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              id="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Frontend Developer"
              className="input-field"
            />
          </div>

          {/* Tone */}
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
              Email Tone
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="input-field"
            >
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          {/* Draft Button */}
          <div className="flex items-end">
            <button
              onClick={handleDraftEmail}
              disabled={loading || recipients.length === 0}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Drafting...' : 'Draft Email'}
            </button>
          </div>
        </div>
      </div>

      {/* Email Preview */}
      {email && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Email Preview</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleShowHtmlPreview}
                className="btn-secondary text-sm"
              >
                🌐 View HTML
              </button>
              <span className="text-sm text-gray-500 px-3 py-2">
                Recipients: {email.recipientCount}
              </span>
            </div>
          </div>

          {/* Customization Options */}
          <div className="mb-6 space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900">Customize Email</h3>
            
            <div>
              <label htmlFor="customSubject" className="block text-sm font-medium text-gray-700 mb-2">
                Custom Subject (leave empty to use generated)
              </label>
              <input
                id="customSubject"
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder={email.subject}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="customClosing" className="block text-sm font-medium text-gray-700 mb-2">
                Custom Closing (leave empty to use generated)
              </label>
              <textarea
                id="customClosing"
                rows={3}
                value={customClosing}
                onChange={(e) => setCustomClosing(e.target.value)}
                placeholder="Looking forward to hearing from you!..."
                className="input-field"
              />
            </div>

            <button
              onClick={handleUpdateEmail}
              disabled={loading}
              className="btn-secondary"
            >
              {loading ? 'Updating...' : 'Update Preview'}
            </button>
          </div>

          {/* Email Content */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-4">
              <h3 className="font-semibold flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Subject: {email.subject}
              </h3>
            </div>
            
            <div className="p-6 bg-white">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                {email.text}
              </pre>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 text-sm text-gray-600">
              Recipients: {email.recipientCount} candidate{email.recipientCount !== 1 ? 's' : ''} • 
              Length: {email.text.length} characters
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!email && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">How to use Email Draft</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>1. Select a shortlist with candidates</li>
                <li>2. Enter the job title and choose email tone</li>
                <li>3. Click "Draft Email" to generate personalized content</li>
                <li>4. Customize subject or closing if needed</li>
                <li>5. Use "View HTML" to see the styled email preview</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailDraft;
