export async function onRequestPost(context: any) {
  try {
    const data = await context.request.json();
    const {
      clinicName,
      contactName,
      email,
      phone,
      activePatients,
    } = data;

    const SENDGRID_API_KEY = context.env.SENDGRID_API_KEY;
    const NOTIFICATION_EMAIL = context.env.NOTIFICATION_EMAIL || 'contact@retentionhealth.com';

    const timestamp = new Date().toLocaleString('en-US', { 
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'long'
    });

    const notificationEmail = {
      personalizations: [{
        to: [{ email: NOTIFICATION_EMAIL }],
        subject: `New 8-Week Pilot Application — ${clinicName}`,
      }],
      from: { email: NOTIFICATION_EMAIL },
      content: [{
        type: 'text/html',
        value: `
          <h2>New 8-Week Pilot Application</h2>
          
          <table style="width: 100%; max-width: 600px; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 12px; font-weight: bold; border: 1px solid #e5e7eb;">Clinic Name</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${clinicName}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; border: 1px solid #e5e7eb;">Contact Name</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${contactName}</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 12px; font-weight: bold; border: 1px solid #e5e7eb;">Email</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; border: 1px solid #e5e7eb;">Phone</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${phone}</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 12px; font-weight: bold; border: 1px solid #e5e7eb;">Active Patient Range</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${activePatients}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; border: 1px solid #e5e7eb;">Source</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">retentionhealth.com/</td>
            </tr>
            <tr style="background-color: #f3f4f6;">
              <td style="padding: 12px; font-weight: bold; border: 1px solid #e5e7eb;">Submitted</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${timestamp}</td>
            </tr>
          </table>
        `,
      }],
    };

    const confirmationEmail = {
      personalizations: [{
        to: [{ email: email }],
        subject: 'Pilot Application Received — RetentionHealth',
      }],
      from: { email: NOTIFICATION_EMAIL },
      content: [{
        type: 'text/html',
        value: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1e293b; margin-bottom: 20px;">Thank you for your interest in the 8-week stabilization pilot.</h2>
            
            <h3 style="color: #334155; margin-top: 30px; margin-bottom: 15px;">What Happens Next:</h3>
            <ul style="color: #475569; line-height: 1.8; margin-bottom: 30px;">
              <li>We'll review your application within 48 hours</li>
              <li>We evaluate patient volume and owner-led structure</li>
              <li>If aligned, we'll schedule a brief discussion</li>
              <li>Pilot start timeline: 1-2 weeks from approval</li>
            </ul>
            
            <p style="color: #475569; line-height: 1.6; margin-bottom: 30px;">
              No obligation. Pilot participation is contingent on alignment.
            </p>
            
            <p style="color: #475569; line-height: 1.6; margin-bottom: 10px;">
              Best regards,<br>
              The RetentionHealth Team
            </p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #94a3b8; line-height: 1.6;">
              RetentionHealth | Revenue Stabilization for GLP-1 Programs<br>
              <a href="mailto:contact@retentionhealth.com" style="color: #3b82f6; text-decoration: none;">contact@retentionhealth.com</a>
            </p>
          </div>
        `,
      }],
    };

    const sendEmail = async (emailData: any) => {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error(`SendGrid API error: ${response.status}`);
      }
    };

    await sendEmail(notificationEmail);
    await sendEmail(confirmationEmail);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
