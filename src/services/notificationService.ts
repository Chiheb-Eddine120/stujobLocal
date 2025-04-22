import { supabase } from './supabaseClient';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  target_role: 'all' | 'student' | 'entreprise' | 'admin';
  status: 'active' | 'inactive';
  created_at: string;
}

export const notificationService = {
  async getAllNotifications() {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Notification[];
  },

  async getNotificationsByRole(role: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .or(`target_role.eq.${role},target_role.eq.all`)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Notification[];
  },

  async createNotification(notification: Omit<Notification, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
      .single();

    if (error) throw error;
    return data as Notification;
  },

  async updateNotification(id: string, notification: Partial<Notification>) {
    const { data, error } = await supabase
      .from('notifications')
      .update(notification)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Notification;
  },

  async deleteNotification(id: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}; 