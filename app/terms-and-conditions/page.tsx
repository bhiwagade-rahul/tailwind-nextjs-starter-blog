import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'

export const metadata = {
  title: 'Terms and Conditions - Desi Showbiz',
  description:
    'Terms and Conditions for Desi Showbiz. Read our terms of service, user agreement, and website usage policies.',
}

export default function TermsAndConditionsPage() {
  return (
    <SectionContainer>
      <PageTitle>Terms and Conditions</PageTitle>
      <div className="mx-auto max-w-4xl">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="mb-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using Desi Showbiz ("the Website"), you accept and agree to be
                bound by the terms and provision of this agreement. If you do not agree to abide by
                the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2>2. Description of Service</h2>
              <p>
                Desi Showbiz is an entertainment news and information platform that provides content
                related to Bollywood, Hollywood, and entertainment industry news, reviews, and
                updates.
              </p>
            </section>

            <section>
              <h2>3. User Conduct</h2>
              <p>You agree not to use the Website to:</p>
              <ul>
                <li>Violate any local, state, national, or international law or regulation</li>
                <li>
                  Transmit any material that is unlawful, harmful, threatening, abusive, or
                  objectionable
                </li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Interfere with or disrupt the Website or servers connected to the Website</li>
                <li>Attempt to gain unauthorized access to any part of the Website</li>
                <li>Use any automated means to access the Website for any purpose</li>
              </ul>
            </section>

            <section>
              <h2>4. Content and Intellectual Property</h2>
              <h3>Our Content</h3>
              <p>
                All content on this Website, including text, graphics, logos, images, and software,
                is the property of Desi Showbiz or its content suppliers and is protected by
                copyright and intellectual property laws.
              </p>

              <h3>User-Generated Content</h3>
              <p>
                By posting comments or other content on our Website, you grant us a non-exclusive,
                royalty-free, perpetual, and worldwide license to use, display, and distribute your
                content.
              </p>
            </section>

            <section>
              <h2>5. Disclaimer of Warranties</h2>
              <p>
                The information on this Website is provided on an "as is" basis. We make no
                representations or warranties of any kind, express or implied, as to the operation
                of the Website or the information, content, or materials included herein.
              </p>
            </section>

            <section>
              <h2>6. Limitation of Liability</h2>
              <p>
                Desi Showbiz will not be liable for any damages of any kind arising from the use of
                this Website, including but not limited to direct, indirect, incidental, punitive,
                and consequential damages.
              </p>
            </section>

            <section>
              <h2>7. Third-Party Links</h2>
              <p>
                Our Website may contain links to third-party websites. We are not responsible for
                the content, privacy policies, or practices of any third-party websites.
              </p>
            </section>

            <section>
              <h2>8. Advertising</h2>
              <p>
                This Website may display advertisements. We are not responsible for the content of
                any advertisements or the products/services offered by advertisers. Your dealings
                with advertisers are solely between you and the advertiser.
              </p>
            </section>

            <section>
              <h2>9. Privacy Policy</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also
                governs your use of the Website, to understand our practices.
              </p>
            </section>

            <section>
              <h2>10. Termination</h2>
              <p>
                We may terminate or suspend your access to the Website immediately, without prior
                notice or liability, for any reason whatsoever, including without limitation if you
                breach the Terms.
              </p>
            </section>

            <section>
              <h2>11. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is
                material, we will try to provide at least 30 days notice prior to any new terms
                taking effect.
              </p>
            </section>

            <section>
              <h2>12. Governing Law</h2>
              <p>
                These Terms shall be interpreted and governed by the laws of the jurisdiction in
                which our company is registered, without regard to conflict of law provisions.
              </p>
            </section>

            <section>
              <h2>13. Contact Information</h2>
              <p>If you have any questions about these Terms and Conditions, please contact us:</p>
              <ul>
                <li>Email: legal@desishowbiz.com</li>
                <li>General inquiries: contact@desishowbiz.com</li>
              </ul>
            </section>

            <section>
              <h2>14. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that
                provision will be limited or eliminated to the minimum extent necessary so that the
                Terms will otherwise remain in full force and effect.
              </p>
            </section>

            <section>
              <h2>15. Entire Agreement</h2>
              <p>
                These Terms constitute the entire agreement between you and Desi Showbiz regarding
                the use of the Website and supersede all prior agreements and understandings.
              </p>
            </section>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
