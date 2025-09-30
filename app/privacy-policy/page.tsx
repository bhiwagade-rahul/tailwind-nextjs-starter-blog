import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'

export const metadata = {
  title: 'Privacy Policy - Desi Showbiz',
  description:
    'Privacy Policy for Desi Showbiz. Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <SectionContainer>
      <PageTitle>Privacy Policy</PageTitle>
      <div className="mx-auto max-w-4xl">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="mb-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2>1. Information We Collect</h2>
              <h3>Personal Information</h3>
              <p>
                We may collect personal information that you voluntarily provide to us, including:
              </p>
              <ul>
                <li>Name and email address when you subscribe to our newsletter</li>
                <li>Comments and feedback you provide</li>
                <li>Contact information when you reach out to us</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <p>When you visit our website, we may automatically collect:</p>
              <ul>
                <li>IP address and location information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website information</li>
              </ul>
            </section>

            <section>
              <h2>2. How We Use Your Information</h2>
              <p>We use the collected information to:</p>
              <ul>
                <li>Provide and maintain our entertainment news service</li>
                <li>Send newsletters and updates (with your consent)</li>
                <li>Respond to your comments and inquiries</li>
                <li>Improve our website and user experience</li>
                <li>Analyze traffic and usage patterns</li>
              </ul>
            </section>

            <section>
              <h2>3. Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar technologies to:</p>
              <ul>
                <li>Remember your preferences</li>
                <li>Analyze site traffic and usage</li>
                <li>Provide personalized content</li>
                <li>Ensure site security</li>
              </ul>
              <p>You can control cookie settings through your browser preferences.</p>
            </section>

            <section>
              <h2>4. Third-Party Services</h2>
              <p>We may use third-party services for:</p>
              <ul>
                <li>Website analytics (Google Analytics)</li>
                <li>Advertising (Google AdSense)</li>
                <li>Social media integration</li>
                <li>Content delivery</li>
              </ul>
              <p>
                These services have their own privacy policies which we encourage you to review.
              </p>
            </section>

            <section>
              <h2>5. Information Sharing and Disclosure</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may
                share information only in the following circumstances:
              </p>
              <ul>
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>In connection with a business transfer</li>
              </ul>
            </section>

            <section>
              <h2>6. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. However, no
                method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2>7. Data Retention</h2>
              <p>
                We retain your personal information only as long as necessary to fulfill the
                purposes outlined in this policy, unless a longer retention period is required by
                law.
              </p>
            </section>

            <section>
              <h2>8. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access the personal information we hold about you</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt out of marketing communications</li>
                <li>Object to processing of your personal information</li>
              </ul>
            </section>

            <section>
              <h2>9. Children's Privacy</h2>
              <p>
                Our website is not intended for children under 13 years of age. We do not knowingly
                collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2>10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any
                changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2>11. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <ul>
                <li>Email: privacy@desishowbiz.com</li>
                <li>General inquiries: contact@desishowbiz.com</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
