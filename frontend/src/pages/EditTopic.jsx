import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { topicService } from '../services/topicService';

export default function EditTopic() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true);
        const data = await topicService.getTopic(id);
        setFormData({
          topicName: data.topicName || '',
          subject: data.subject || '',
          description: data.description || '',
          status: data.status || 'Not Started',
          progress: data.progress ?? 0,
          priority: data.priority || 'Medium',
          startDate: data.startDate || '',
          targetDate: data.targetDate || '',
          notes: data.notes || ''
        });
      } catch (err) {
        setApiError(err.message || 'Failed to load topic details for editing');
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: name === 'progress' ? Number(value) : value
      };
      
      // Auto status updating based on progress UX
      if (name === 'progress') {
        const val = Number(value);
        if (val === 100) updated.status = 'Completed';
        else if (val > 0 && updated.status === 'Not Started') updated.status = 'Learning';
      }
      return updated;
    });

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
      await topicService.updateTopic(id, formData);
      navigate(`/topics/${id}`);
    } catch (err) {
      setApiError(err.message || 'Failed to update topic');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="empty-state">Loading topic details for editing...</div>;
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to={`/topics/${id}`} style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          &larr; Back to Topic Details
        </Link>
        <h1 className="section-title" style={{ marginTop: '0.5rem' }}>Edit Topic</h1>
        <p className="section-subtitle">Update progress, study notes, status, and deadlines.</p>
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
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <Link to={`/topics/${id}`} className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving Changes...' : 'Update Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
