import PolicyLayout from '../components/PolicyLayout';

const sections = [
  {
    heading: 'Introduction',
    content: (
      <>
        <p>
          At PromptX, we take your privacy seriously. This Privacy Policy explains what information we collect, how we use it, who we share it with, and the choices you have regarding your personal data.
        </p>
        <p>
          By using our Service, you agree to the collection and use of information in accordance with this policy. If you do not agree, please discontinue use of the Service.
        </p>
      </>
    ),
  },
  {
    heading: 'Information We Collect',
    content: (
      <>
        <p>We collect the following types of information:</p>

        <p className="font-semibold text-black mt-4 mb-1">Information you provide directly</p>
        <ul className="list-none space-y-2">
          {[
            'Name and email address when you create an account.',
            'Payment information processed through Stripe (we never see or store your card number).',
            'Communications you send to us, such as support requests.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300" />
              {item}
            </li>
          ))}
        </ul>

        <p className="font-semibold text-black mt-5 mb-1">Information collected automatically</p>
        <ul className="list-none space-y-2">
          {[
            'IP address, browser type, and device type.',
            'Pages you visit and actions you take on our platform.',
            'Session duration and referral source.',
            'Cookies and similar tracking technologies (see Section 5).',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    heading: 'How We Use Your Information',
    content: (
      <>
        <p>We use the information we collect to:</p>
        <ul className="list-none space-y-2 mt-2">
          {[
            'Create and manage your account.',
            'Process payments and fulfil your Pro membership.',
            'Send transactional emails such as purchase confirmations.',
            'Provide customer support and respond to your enquiries.',
            'Improve the platform, fix bugs, and develop new features.',
            'Detect and prevent fraud, abuse, or other harmful activity.',
            'Comply with legal obligations.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-3">
          We do <strong>not</strong> sell your personal data to third parties or use it for targeted advertising.
        </p>
      </>
    ),
  },
  {
    heading: 'Information We Share',
    content: (
      <>
        <p>
          We only share your personal data with third parties in the following limited circumstances:
        </p>
        <ul className="list-none space-y-3 mt-3">
          {[
            {
              label: 'Stripe',
              desc: 'Our payment processor handles all card transactions. Stripe receives your payment information to complete purchases. Stripe is PCI-DSS compliant.',
            },
            {
              label: 'Supabase',
              desc: 'Our database infrastructure provider. Your account data is stored securely in Supabase\'s servers with industry-standard encryption.',
            },
            {
              label: 'Legal requirements',
              desc: 'We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., court orders, subpoenas).',
            },
            {
              label: 'Business transfers',
              desc: 'In the event of a merger, acquisition, or sale of assets, your data may be transferred to the acquiring entity, subject to the same privacy protections.',
            },
          ].map(({ label, desc }) => (
            <li key={label} className="flex items-start gap-2.5">
              <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300" />
              <span><strong className="text-black">{label}:</strong> {desc}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    heading: 'Cookies and Tracking',
    content: (
      <>
        <p>
          We use cookies and similar technologies to keep you logged in, remember your preferences, and understand how people use our platform. The cookies we use include:
        </p>
        <ul className="list-none space-y-3 mt-3">
          {[
            { label: 'Authentication tokens', desc: 'Stored in localStorage to keep you signed in across sessions.' },
            { label: 'Analytics', desc: 'Anonymous usage data to understand page views and feature usage. No personally identifiable information is included.' },
          ].map(({ label, desc }) => (
            <li key={label} className="flex items-start gap-2.5">
              <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300" />
              <span><strong className="text-black">{label}:</strong> {desc}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          You can clear cookies and localStorage at any time via your browser settings. Doing so will sign you out of your account.
        </p>
      </>
    ),
  },
  {
    heading: 'Data Retention',
    content: (
      <p>
        We retain your personal data for as long as your account is active or as needed to provide you with the Service. If you request account deletion, we will delete your personal data within 30 days, except where we are required to retain it for legal or compliance reasons (e.g., purchase records for accounting purposes, which we retain for 7 years).
      </p>
    ),
  },
  {
    heading: 'Your Rights',
    content: (
      <>
        <p>
          Depending on your location, you may have the following rights regarding your personal data:
        </p>
        <ul className="list-none space-y-2 mt-2">
          {[
            'Access — request a copy of the personal data we hold about you.',
            'Correction — request that we correct inaccurate or incomplete data.',
            'Deletion — request that we delete your personal data ("right to be forgotten").',
            'Portability — receive your data in a structured, machine-readable format.',
            'Objection — object to our processing of your data in certain circumstances.',
            'Withdrawal of consent — where processing is based on consent, withdraw it at any time.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-3">
          To exercise any of these rights, email us at{' '}
          <a href="mailto:privacy@promptx.ai" className="text-black font-medium underline underline-offset-2">
            privacy@promptx.ai
          </a>
          . We will respond within 30 days.
        </p>
      </>
    ),
  },
  {
    heading: 'Data Security',
    content: (
      <p>
        We implement industry-standard security measures to protect your personal data, including HTTPS encryption in transit, hashed passwords (we never store plaintext passwords), and access controls limiting who can view your data. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
      </p>
    ),
  },
  {
    heading: "Children's Privacy",
    content: (
      <p>
        PromptX is not directed at children under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have collected personal data from a child under 13, we will take steps to delete that information promptly. If you believe we have inadvertently collected such data, please contact us immediately.
      </p>
    ),
  },
  {
    heading: 'Changes to This Policy',
    content: (
      <p>
        We may update this Privacy Policy from time to time. When we do, we will revise the effective date at the top of this page. We encourage you to review this policy periodically. Continued use of the Service after changes are posted constitutes your acceptance of the revised policy.
      </p>
    ),
  },
  {
    heading: 'Contact Us',
    content: (
      <p>
        If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal data, please contact us at{' '}
        <a href="mailto:privacy@promptx.ai" className="text-black font-medium underline underline-offset-2">
          privacy@promptx.ai
        </a>
        . We aim to respond to all privacy-related enquiries within 5 business days.
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your personal information."
      effectiveDate="May 12, 2026"
      accentColor="#0ea5e9"
      sections={sections}
    />
  );
}
