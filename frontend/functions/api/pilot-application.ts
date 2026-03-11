// Cloudflare Pages Function for handling pilot application submissions
export async function onRequestPost(context: any) {
  try {
    const data = await context.request.json();
    const {
      clinicStructure,
      activePatients,
      treatmentDelivery,
      pilotCommitment,
      clinicName,
      contactName,
      email,
      phone,
      website,
    } = data;

    // SendGrid API configuration
    const SENDGRID_API_KEY = context.env.SENDGRID_API_KEY;
    const NOTIFICATION_EMAIL = context.env.NOTIFICATION_EMAIL || 'contact@retentionhealth.com';

    // Map values to readable labels
    const clinicStructureLabels: Record<string, string> = {
      'physician-owned': 'Physician-owned clinic',
      'np-led': 'Nurse practitioner-led clinic',
      'medspa': 'Med spa with physician oversight',
      'multi-location': 'Multi-location clinic group',
      'franchise': 'National franchise or corporate group',
    };

    const treatmentDeliveryLabels: Record<string, string> = {
      'in-clinic': 'Weekly in-clinic administration',
      'combination': 'Combination clinic + take-home',
      'take-home': 'Primarily take-home prescriptions',
      'telehealth': 'Telehealth-managed treatment',
    };

    const commitmentLabels: Record<string, string> = {
      'yes': 'Yes',
      'possibly': 'Possibly, need more information',
      'not-sure': 'Not sure yet',
    };

    // Email to you (notification)
    const notificationEmail = {
      personalizations: [{
        to: [{ email: NOTIFICATION_EMAIL }],
        subject: `New Pilot Application: ${clinicName}`,
      }],
      from: { email: NOTIFICATION_EMAIL },
      content: [{
        type: 'text/html',
        value: `
          <h2>New Pilot Application Received</h2>
          
          <h3>Clinic Information</h3>
          <ul>
            <li><strong>Clinic Name:</strong> ${clinicName}</li>
            <li><strong>Contact Name:</strong> ${contactName}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            ${website ? `<li><strong>Website:</strong> <a href="${website}">${website}</a></li>` : ''}
          </ul>
          
          <h3>Qualification Responses</h3>
          <ul>
            <li><strong>Clinic Structure:</strong> ${clinicStructureLabels[clinicStructure] || clinicStructure}</li>
            <li><strong>Active GLP-1 Patients:</strong> ${activePatients}</li>
            <li><strong>Treatment Delivery:</strong> ${treatmentDeliveryLabels[treatmentDelivery] || treatmentDelivery}</li>
            <li><strong>Pilot Commitment:</strong> ${commitmentLabels[pilotCommitment] || pilotCommitment}</li>
          </ul>
          
          <h3>Qualification Assessment</h3>
          <p><strong>Status:</strong> Pending Manual Review</p>
          
          <h4>Quick Assessment:</h4>
          <ul>
            <li><strong>Clinic Type:</strong> ${clinicStructure === 'franchise' ? '⚠️ Corporate/Franchise (may not be ideal fit)' : '✅ Independent clinic'}</li>
            <li><strong>Patient Volume:</strong> ${activePatients === '50-100' ? '✅ Minimum threshold met' : '✅ Above minimum'}</li>
            <li><strong>Commitment Level:</strong> ${pilotCommitment === 'yes' ? '✅ Committed' : pilotCommitment === 'possibly' ? '⚠️ Needs more info' : '⚠️ Uncertain'}</li>
          </ul>
          
          <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
        `,
      }],
    };

    // Email to applicant (confirmation)
    const confirmationEmail = {
      personalizations: [{
        to: [{ email: email }],
        subject: 'Pilot Application Received - RetentionHealth',
      }],
      from: { email: NOTIFICATION_EMAIL },
      content: [{
        type: 'text/html',
        value: `
          <h2>Thank you for applying, ${contactName}!</h2>
          
          <p>We've received your application for the RetentionHealth 8-week pilot cohort for ${clinicName}.</p>
          
          <p>We are reviewing applications for the first six clinics and will respond within 48 hours.</p>
          
          <h3>What's Next?</h3>
          <p>Our team will review your clinic's profile and operational fit for the pilot program. If selected, you'll receive:</p>
          <ul>
            <li>Pilot onboarding agreement and next steps</li>
            <li>Setup instructions (approximately 15 minutes)</li>
            <li>Demo credentials for the clinic dashboard</li>
          </ul>
          
          <p>If you have any questions in the meantime, feel free to reply to this email.</p>
          
          <p>Best regards,<br>
          The RetentionHealth Team</p>
          
          <hr>
          <p style="font-size: 12px; color: #666;">
            RetentionHealth | Stabilization infrastructure for GLP-1 treatment ramp-up<br>
            <a href="mailto:contact@retentionhealth.com">contact@retentionhealth.com</a>
          </p>
        `,
      }],
    };

    // Send both emails via SendGrid API
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
      JSON.stringify({ error: 'Failed to submit application' }),
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

// Handle CORS preflight
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
