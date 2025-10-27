import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate("/community")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Community
        </Button>

        <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p className="text-foreground/80">
              BlueCaller ("we", "our", or "us") respects your privacy and is committed to protecting your 
              personal data. This privacy policy explains how we collect, use, and protect your information 
              when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Account information (name, email, phone number)</li>
              <li>Profile information and preferences</li>
              <li>Messages and communications on the platform</li>
              <li>Payment information (processed securely by third-party providers)</li>
              <li>Reviews and ratings you submit</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">2.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, features used, time spent)</li>
              <li>Location data (with your permission)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>To provide and improve our services</li>
              <li>To facilitate connections between users and professionals</li>
              <li>To process payments and transactions</li>
              <li>To communicate with you about your account and services</li>
              <li>To send notifications and updates (with your consent)</li>
              <li>To personalize your experience</li>
              <li>To detect and prevent fraud and abuse</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Information Sharing</h2>
            <p className="text-foreground/80 mb-2">We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Service Providers:</strong> Third parties who help us operate the platform (hosting, payment processing, analytics)</li>
              <li><strong>Professionals:</strong> When you book or contact a professional, we share relevant information to facilitate the service</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p className="text-foreground/80 mt-2">
              We do not sell your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Data Security</h2>
            <p className="text-foreground/80">
              We implement appropriate technical and organizational measures to protect your data, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure payment processing</li>
            </ul>
            <p className="text-foreground/80 mt-2">
              However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Your Rights and Choices</h2>
            <p className="text-foreground/80 mb-2">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Data Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Object:</strong> Object to certain processing of your data</li>
            </ul>
            <p className="text-foreground/80 mt-2">
              To exercise these rights, contact us at privacy@bluecaller.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Cookies and Tracking</h2>
            <p className="text-foreground/80">
              We use cookies and similar technologies to improve your experience, analyze usage, and deliver 
              personalized content. You can control cookies through your browser settings, though some features 
              may not work properly if cookies are disabled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">8. Children's Privacy</h2>
            <p className="text-foreground/80">
              BlueCaller is not intended for children under 18. We do not knowingly collect information from 
              children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">9. International Data Transfers</h2>
            <p className="text-foreground/80">
              Your information may be transferred to and processed in countries other than your own. We ensure 
              appropriate safeguards are in place to protect your data in accordance with applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">10. Data Retention</h2>
            <p className="text-foreground/80">
              We retain your information for as long as necessary to provide our services and comply with legal 
              obligations. When you delete your account, we will delete or anonymize your data, except where we 
              must retain it for legal reasons.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">11. Changes to This Policy</h2>
            <p className="text-foreground/80">
              We may update this privacy policy from time to time. We will notify you of significant changes 
              via email or platform notification. Your continued use of the service after changes indicates 
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">12. Contact Us</h2>
            <p className="text-foreground/80">
              For questions or concerns about this privacy policy or our data practices, contact us at:
            </p>
            <ul className="list-none space-y-1 text-foreground/80 mt-2">
              <li>Email: privacy@bluecaller.com</li>
              <li>Address: [Your Business Address]</li>
            </ul>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default PrivacyPolicy;
