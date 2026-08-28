// JanSetu AI - Pan-India Email & SMS Notification Dispatcher
class NotificationService {
  constructor() {
    this.storageKey = 'jansetu_notifications_store_v2';
    this.notifications = this.loadNotifications();
    this.subscribers = [];
  }

  loadNotifications() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    // Seed initial notifications for demo
    return [
      {
        id: 'notif-1',
        type: 'EMAIL',
        recipient: 'aditi.roy@citizen.nic.in',
        phone: '9876543210',
        subject: 'Official Confirmation: Grievance GR-2026-WB-1001 Registered',
        body: 'Dear Aditi Roy, your grievance regarding Drinking Water Pipeline Burst has been ingested under CRITICAL priority (4-Hour SLA). Assigned to Water Supply Department.',
        ticketNumber: 'GR-2026-WB-1001',
        status: 'DELIVERED',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false
      },
      {
        id: 'notif-2',
        type: 'SMS',
        recipient: 'aditi.roy@citizen.nic.in',
        phone: '9876543210',
        subject: 'SMS Alert: Field Lineman Dispatched',
        body: 'JanSetu Alert: Er. Soumen Banerjee has mobilized emergency field repair crew for your ticket GR-2026-WB-1001.',
        ticketNumber: 'GR-2026-WB-1001',
        status: 'DELIVERED',
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        read: false
      }
    ];
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.notifications));
    } catch (e) {}
    this.notifySubscribers();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== callback);
    };
  }

  notifySubscribers() {
    this.subscribers.forEach(cb => cb(this.notifications));
  }

  getAllNotifications() {
    return this.notifications;
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.save();
  }

  // Automated Email & SMS Dispatch on Grievance Ingestion
  dispatchGrievanceCreated(grievance) {
    const emailNotif = {
      id: `notif-email-${Date.now()}`,
      type: 'EMAIL',
      recipient: `${grievance.phone}@citizen.nic.in`,
      phone: grievance.phone,
      subject: `[JanSetu Govt Portal] Grievance Registered: ${grievance.ticket_number}`,
      body: `Namaste ${grievance.citizen_name}, your grievance has been classified into ${grievance.department_name} under ${grievance.priority_level} priority with a statutory resolution SLA of ${grievance.sla_hours} Hours. Tracking ID: ${grievance.ticket_number}.`,
      ticketNumber: grievance.ticket_number,
      status: 'DELIVERED',
      timestamp: new Date().toISOString(),
      read: false
    };

    const smsNotif = {
      id: `notif-sms-${Date.now()}`,
      type: 'SMS',
      recipient: `${grievance.phone}@citizen.nic.in`,
      phone: grievance.phone,
      subject: `Govt SMS Alert: Ticket ${grievance.ticket_number}`,
      body: `JanSetu Alert: Complaint ${grievance.ticket_number} received. SLA: ${grievance.sla_hours}H. Track at https://jansetu.gov.in/track/${grievance.ticket_number}`,
      ticketNumber: grievance.ticket_number,
      status: 'DELIVERED',
      timestamp: new Date().toISOString(),
      read: false
    };

    this.notifications.unshift(emailNotif, smsNotif);
    this.save();
  }

  // Automated Status Update Dispatch
  dispatchStatusUpdated(grievance, newStatus, remarks) {
    const updateNotif = {
      id: `notif-status-${Date.now()}`,
      type: 'EMAIL',
      recipient: `${grievance.phone}@citizen.nic.in`,
      phone: grievance.phone,
      subject: `[JanSetu Status Update] Ticket ${grievance.ticket_number} is now ${newStatus}`,
      body: `Dear ${grievance.citizen_name}, your complaint ${grievance.ticket_number} status has changed to ${newStatus}. Officer Remarks: ${remarks || 'Field team is addressing the issue.'}`,
      ticketNumber: grievance.ticket_number,
      status: 'DELIVERED',
      timestamp: new Date().toISOString(),
      read: false
    };

    this.notifications.unshift(updateNotif);
    this.save();
  }

  // Password Reset OTP Dispatch
  dispatchPasswordResetOtp(email, otp) {
    const resetNotif = {
      id: `notif-reset-${Date.now()}`,
      type: 'EMAIL',
      recipient: email,
      phone: 'N/A',
      subject: `[JanSetu Security] Password Reset OTP for ${email}`,
      body: `Your official password reset verification OTP is: ${otp}. This OTP will expire in 10 minutes. Do not share with anyone.`,
      ticketNumber: 'SECURITY_AUTH',
      status: 'DELIVERED',
      timestamp: new Date().toISOString(),
      read: false
    };

    this.notifications.unshift(resetNotif);
    this.save();
  }
}

export const notificationService = new NotificationService();
