import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { topicService } from '../services/topicService';

export default function AddTopic() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topicName: '',
    subject: '',
    description: '',
    status: 'Not Started',
    progress: 0,
    priority: 'Medium',
    startDate: '',
    targetDate: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'progress' ? Number(value) : value
    }));
    // Clear validation error on type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.topicName.trim()) {
      newErrors.topicName = 'Topic name is required.';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required.';
    }
    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'Progress must be between 0 and 100%.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      await topicService.createTopic(formData);
      navigate('/topics');
    } catch (err) {
      setApiError(err.message || 'Failed to create topic');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/topics" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          &larr; Back to Topics
        </Link>
        <h1 className="section-title" style={{ marginTop: '0.5rem' }}>Add New Learning Topic</h1>
        <p className="section-subtitle">Define a new topic, target timeline, and initial status.</p>
      </div>

      {apiError && <div className="alert-error">{apiError}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Topic Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="topicName"
                className="form-input"
                placeholder="e.g. Async await & Promises"
                value={formData.topicName}
                onChange={handleChange}
              />
              {errors.topicName && <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>{errors.topicName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Subject <span className="required">*</span>
              </label>
              <input
                type="text"
                name="subject"
                className="form-input"
                placeholder="e.g. JavaScript, Physics, Economics"
                value={formData.subject}
                onChange={handleChange}
              />
              {errors.subject && <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>{errors.subject}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              rows="3"
              placeholder="Brief description of key concepts or objectives..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                <option value="Not Started">Not Started</option>
                <option value="Learning">Learning</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select name="priority" className="form-select" value={formData.priority} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Progress ({formData.progress}%)</label>
              <input
                type="range"
                name="progress"
                min="0"
                max="100"
                step="5"
                style={{ width: '100%', marginTop: '0.4rem' }}
                value={formData.progress}
                onChange={handleChange}
              />
              {errors.progress && <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>{errors.progress}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="form-input"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Completion Date</label>
              <input
                type="date"
                name="targetDate"
                className="form-input"
                value={formData.targetDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes & Resources</label>
            <textarea
              name="notes"
              className="form-textarea"
              rows="3"
              placeholder="Study resources, URLs, reference material or formulas..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <Link to="/topics" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving Topic...' : 'Create Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
