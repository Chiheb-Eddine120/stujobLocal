export type UserRole = 'admin' | 'user' | 'entreprise' | 'student';

export interface Profile {
  id: string;
  role: UserRole;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  site_name: string;
  site_email: string;
  matching_threshold: number;
  auto_match_enabled: boolean;
  email_notifications: boolean;
  maintenance_mode: boolean;
  language: string;
  created_at: string;
  updated_at: string;
  change_history: SettingsChange[];
}

export interface SettingsChange {
  date?: string;
  changed_at?: string;
  field: string;
  changed_by: string;
  newValue?: any;
  oldValue?: any;
} 