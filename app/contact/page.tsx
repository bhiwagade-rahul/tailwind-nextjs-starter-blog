import { components as MDXComponents } from '@/components/MDXComponents'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'

export const metadata = {
  title: 'Contact Us - Desi Showbiz',
  description:
    'Get in touch with Desi Showbiz. Contact us for inquiries, feedback, or collaboration opportunities.',
}

export default function ContactPage() {
  return (
    <SectionContainer>
      <PageTitle>Contact Us</PageTitle>
      <div className="mx-auto max-w-4xl">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="mb-8">
            <h2>Get in Touch</h2>
            <p>
              We'd love to hear from you! Whether you have questions, feedback, or collaboration
              opportunities, feel free to reach out to us.
            </p>
          </div>

          <div className="mb-8">
            <div>
              <h3>Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold">Email</h4>
                  <p>contact@desishowbiz.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
            <h3>Response Time</h3>
            <p>
              We typically respond to inquiries within 24-48 hours during business days. For urgent
              matters, please indicate "URGENT" in your subject line.
            </p>
          </div>

          <div className="mt-8">
            <h3>Office Hours</h3>
            <p>Monday - Friday: 9:00 AM - 6:00 PM (IST)</p>
            <p>Saturday: 10:00 AM - 4:00 PM (IST)</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
