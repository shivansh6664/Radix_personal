import { useState, useEffect, useCallback } from 'react';
import { profileService } from '../services/profileService';
import { jobService } from '../services/jobService';
import { apiClient } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { AppContext } from './AppContextDef';

const SELECTED_JOB_KEY = 'radix_selected_job_id_v1';

export function AppProvider({ children }) {
  const { user, profile: customerProfile, isAuthenticated } = useAuth();

  const [candidates, setCandidates] = useState([]);
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJobState] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('Google LLC');
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const setSelectedJob = useCallback((job) => {
    if (!job) return;
    setSelectedJobState(job);
    if (job.id) {
      localStorage.setItem(SELECTED_JOB_KEY, job.id);
    }
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const health = await apiClient.checkHealth();
      setIsBackendOnline(health.isOnline);
      setIsDemoMode(!health.isOnline);

      const loadedCandidates = await profileService.getProfiles(customerProfile);
      const loadedJobs = await jobService.getJobs();

      // Respect the active profile ID if selected, otherwise fallback to customer profile or first candidate
      const activeId = profileService.getActiveProfileId();
      let current = null;
      if (activeId) {
        current = loadedCandidates.find((c) => c.id === activeId);
      }
      if (!current) {
        if (isAuthenticated && customerProfile) {
          current = customerProfile;
        } else {
          current = loadedCandidates[0];
        }
      }

      setCandidates(loadedCandidates);
      setActiveCandidate(current);
      setJobs(loadedJobs);

      // Restore previously selected job if available, else fallback
      const storedJobId = localStorage.getItem(SELECTED_JOB_KEY);
      let targetJob = null;
      if (storedJobId) {
        targetJob = loadedJobs.find((j) => j.id === storedJobId);
      }
      setSelectedJobState((prev) => {
        if (targetJob) return targetJob;
        if (prev && loadedJobs.some((j) => j.id === prev.id)) return prev;
        return loadedJobs[0];
      });
    } catch (err) {
      console.error('Error loading initial state:', err);
      addToast('Error loading application data', 'error');
    } finally {
      setLoading(false);
    }
  }, [customerProfile, isAuthenticated, addToast]);

  // Sync customer profile when authentication state changes
  useEffect(() => {
    if (isAuthenticated && customerProfile) {
      setCandidates((prev) => {
        const filtered = prev.filter((p) => p.id !== customerProfile.id);
        return [customerProfile, ...filtered];
      });
      const activeId = profileService.getActiveProfileId();
      if (!activeId || activeId === customerProfile.id) {
        setActiveCandidate(customerProfile);
      }
    }
  }, [isAuthenticated, customerProfile]);

  useEffect(() => {
    loadData();

    const handleProfileChanged = async (e) => {
      const activeId = e.detail?.id || profileService.getActiveProfileId();
      const loadedCandidates = await profileService.getProfiles(customerProfile);
      setCandidates(loadedCandidates);
      const current = loadedCandidates.find((c) => c.id === activeId) || loadedCandidates[0];
      setActiveCandidate(current);
    };

    const handleProfilesUpdated = async (e) => {
      const loadedCandidates = await profileService.getProfiles(customerProfile);
      setCandidates(loadedCandidates);
      const activeId = e?.detail?.profileId || profileService.getActiveProfileId();
      const current = loadedCandidates.find((c) => c.id === activeId) || loadedCandidates[0];
      setActiveCandidate(current);
    };

    const handleJobsUpdated = async () => {
      const loadedJobs = await jobService.getJobs();
      setJobs(loadedJobs);
      const storedJobId = localStorage.getItem(SELECTED_JOB_KEY);
      if (storedJobId) {
        const found = loadedJobs.find((j) => j.id === storedJobId);
        if (found) setSelectedJobState(found);
      }
    };

    window.addEventListener('radix_profile_changed', handleProfileChanged);
    window.addEventListener('radix_profiles_updated', handleProfilesUpdated);
    window.addEventListener('radix_jobs_updated', handleJobsUpdated);

    return () => {
      window.removeEventListener('radix_profile_changed', handleProfileChanged);
      window.removeEventListener('radix_profiles_updated', handleProfilesUpdated);
      window.removeEventListener('radix_jobs_updated', handleJobsUpdated);
    };
  }, [loadData, customerProfile]);

  const switchActiveCandidate = useCallback((candidateId) => {
    profileService.setActiveProfileId(candidateId);
    const found = candidates.find((c) => c.id === candidateId);
    if (found) {
      setActiveCandidate(found);
      addToast(`Active candidate switched to ${found.name}`, 'info');
    }
  }, [candidates, addToast]);

  const toggleDemoMode = useCallback((val) => {
    setIsDemoMode(val !== undefined ? val : (prev) => !prev);
  }, []);

  const addCustomJob = useCallback(async (newJob) => {
    if (!newJob) return;
    try {
      await jobService.saveJob(newJob);
    } catch (e) {
      console.warn('Failed to persist custom job:', e);
    }
    setJobs((prev) => {
      const filtered = prev.filter((j) => j.id !== newJob.id);
      return [newJob, ...filtered];
    });
    setSelectedJob(newJob);
  }, [setSelectedJob]);

  const deleteCandidateProfile = useCallback(async (profileId) => {
    try {
      await profileService.deleteProfile(profileId);
      setCandidates((prev) => prev.filter((c) => c.id !== profileId));
      if (activeCandidate?.id === profileId) {
        const remaining = candidates.filter((c) => c.id !== profileId);
        setActiveCandidate(remaining[0] || null);
      }
      addToast('Candidate profile removed', 'info');
    } catch (e) {
      addToast(`Error removing profile: ${e.message}`, 'error');
    }
  }, [candidates, activeCandidate, addToast]);

  const deleteCustomJob = useCallback(async (jobId) => {
    try {
      await jobService.deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      if (selectedJob?.id === jobId) {
        const remaining = jobs.filter((j) => j.id !== jobId);
        setSelectedJob(remaining[0] || null);
      }
      addToast('Job description removed', 'info');
    } catch (e) {
      addToast(`Error deleting JD: ${e.message}`, 'error');
    }
  }, [jobs, selectedJob, addToast, setSelectedJob]);

  const value = {
    candidates,
    activeCandidate,
    setActiveCandidate,
    switchActiveCandidate,
    deleteCandidateProfile,
    jobs,
    selectedJob,
    setSelectedJob,
    addCustomJob,
    deleteCustomJob,
    selectedCompany,
    setSelectedCompany,
    isBackendOnline,
    isDemoMode,
    toggleDemoMode,
    loading,
    toasts,
    addToast,
    removeToast,
    refreshData: loadData,
    user,
    customerProfile,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
