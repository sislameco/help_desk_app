// High-level API response wrapper (optional, if backend wraps everything)
export interface DashboardResponse {
  filters: DashboardFilters;
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  slaMetrics: SlaMetric[];
  deptWorkload: DepartmentWorkload[];
  deptPerformance: DepartmentPerformance[];
  deptTrends: DepartmentTrend[];
}

export interface DashboardFilters {
  role: string;
  company: string;
  department: string;
}

export interface DashboardStats {
  openTickets: number;
  ticketsOverdue: number;
  ticketsDelta: number;
  activeComplaints: number;
  complaintsEscalated: number;
  openCapas: number;
  capasDueThisWeek: number;
  capasDelta: number;
  highRisks: number;
  risksNeedMitigation: number;
  newRisks: number;
}

export interface RecentActivity {
  code: string;
  tag: string;
  tagColor: 'primary' | 'warning' | 'info' | 'secondary';  // restrict to known Bootstrap colors
  title: string;
  assignee: string;
  due: string; // ISO date string e.g. "2025-08-20"
  status: 'overdue' | 'investigation' | 'in-progress' | 'open';
}

export interface SlaMetric {
  label: string;
  value: number; // percentage (0-100)
}

export interface DepartmentWorkload {
  name: string;
  openTickets: number;
  activeCapas: number;
  highRisks: number;
}

export interface DepartmentPerformance {
  name: string;
  ticketResolution: number; // %
  complaintResponse: number; // %
  capaCompletion: number; // %
}

export interface DepartmentTrend {
  month: string; // e.g. "June"
  tickets: number;
  complaints: number;
  risks: number;
}
