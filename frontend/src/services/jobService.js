import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SAMPLE_JOBS } from '../lib/radixData';

const LOCAL_JOBS_KEY = 'radix_job_descriptions_v1';

const getLocalJobs = () => {
  try {
    const raw = localStorage.getItem(LOCAL_JOBS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse local jobs:', e);
  }
  localStorage.setItem(LOCAL_JOBS_KEY, JSON.stringify(SAMPLE_JOBS));
  return SAMPLE_JOBS;
};

export const jobService = {
  async getJobs() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('job_descriptions')
          .select('*')
          .order('company');
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase job fetch error, using local dataset:', err);
      }
    }
    return getLocalJobs();
  },

  async getJobById(id) {
    const jobs = await this.getJobs();
    return jobs.find((j) => j.id === id) || jobs[0];
  },

  async saveJob(jobData) {
    const jobs = getLocalJobs();
    const existingIndex = jobs.findIndex((j) => j.id === jobData.id);
    let updated;

    if (existingIndex >= 0) {
      updated = [...jobs];
      updated[existingIndex] = {
        ...updated[existingIndex],
        ...jobData,
        updatedAt: new Date().toISOString(),
      };
    } else {
      const newJob = {
        ...jobData,
        id: jobData.id || `job_${Date.now()}`,
        updatedAt: new Date().toISOString(),
      };
      updated = [newJob, ...jobs];
    }

    localStorage.setItem(LOCAL_JOBS_KEY, JSON.stringify(updated));

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('job_descriptions')
          .upsert([jobData], { onConflict: 'id' });
      } catch (err) {
        console.warn('Supabase save error (saved locally):', err);
      }
    }

    window.dispatchEvent(new CustomEvent('radix_jobs_updated'));
    return jobData;
  },

  async deleteJob(jobId) {
    const jobs = getLocalJobs();
    const updated = jobs.filter((j) => j.id !== jobId);
    localStorage.setItem(LOCAL_JOBS_KEY, JSON.stringify(updated));

    const storedSelectedId = localStorage.getItem('radix_selected_job_id_v1');
    if (storedSelectedId === jobId) {
      const nextJob = updated[0] || SAMPLE_JOBS[0];
      localStorage.setItem('radix_selected_job_id_v1', nextJob.id);
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('job_descriptions').delete().eq('id', jobId);
      } catch (err) {
        console.warn('Supabase delete job notice:', err);
      }
    }

    window.dispatchEvent(new CustomEvent('radix_jobs_updated'));
    return updated;
  },

  resetDefaults() {
    localStorage.setItem(LOCAL_JOBS_KEY, JSON.stringify(SAMPLE_JOBS));
    window.dispatchEvent(new CustomEvent('radix_jobs_updated'));
    return SAMPLE_JOBS;
  }
};
