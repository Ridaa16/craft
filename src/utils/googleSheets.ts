import { LeadSubmission } from '../types';

export async function submitLeadToGoogleSheets(
  lead: LeadSubmission,
  webhookUrl: string
): Promise<{ success: boolean; message: string }> {
  // If webhook is dummy or unconfigured, we simulate a successful cloud sync
  if (!webhookUrl || webhookUrl.includes('SAMPLE_WEBHOOK_URL')) {
    // Artificial slight network delay for realistic responsiveness
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      message: 'Logged locally and ready for live Google Sheets webhook sync.',
    };
  }

  try {
    // Mode no-cors is standard for Google Apps Script Webhook endpoints when posted from browsers
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(lead),
      mode: 'no-cors',
    });

    return {
      success: true,
      message: 'Lead sent to Google Sheets successfully.',
    };
  } catch (error) {
    console.error('Failed to sync to Google Sheets webhook:', error);
    return {
      success: false,
      message: 'Failed to connect to Google Sheets webhook. Inquiry saved in local admin inbox.',
    };
  }
}

export function exportLeadsToCsv(leads: LeadSubmission[]): void {
  const headers = ['Timestamp', 'Lead ID', 'Full Name', 'Phone', 'Email', 'Artifact', 'Quantity', 'Inquiry Type', 'Message', 'Status'];
  const rows = leads.map((l) => [
    `"${l.timestamp}"`,
    `"${l.id}"`,
    `"${l.fullName.replace(/"/g, '""')}"`,
    `"${l.phone.replace(/"/g, '""')}"`,
    `"${l.email.replace(/"/g, '""')}"`,
    `"${l.productName.replace(/"/g, '""')}"`,
    l.quantity,
    `"${l.inquiryType}"`,
    `"${l.message.replace(/"/g, '""')}"`,
    `"${l.status}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `vintage_crafts_leads_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
