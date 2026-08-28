import { db } from '../db/store.js';

export const getDepartments = (req, res) => {
  const departments = db.getDepartments();
  const allGrievances = db.getAllGrievances();

  const enriched = departments.map(d => {
    const pending = allGrievances.filter(g => g.department_id === d.id && g.status !== 'RESOLVED').length;
    const critical = allGrievances.filter(g => g.department_id === d.id && g.priority_level === 'CRITICAL' && g.status !== 'RESOLVED').length;
    return {
      ...d,
      pending_count: pending,
      critical_count: critical
    };
  });

  return res.json({ success: true, data: enriched });
};
