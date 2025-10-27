import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
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

        <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p className="text-foreground/80">
              By accessing and using BlueCaller, you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. Service Description</h2>
            <p className="text-foreground/80">
              BlueCaller is a platform that connects users with professional service providers. We facilitate 
              connections but are not responsible for the services provided by professionals on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>You must be at least 18 years old to create an account</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must provide accurate and complete information</li>
              <li>You may not share your account with others</li>
              <li>You are responsible for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. User Conduct</h2>
            <p className="text-foreground/80 mb-2">Users must not:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Violate any laws or regulations</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Post false, misleading, or fraudulent content</li>
              <li>Spam or engage in unauthorized advertising</li>
              <li>Attempt to access unauthorized areas of the platform</li>
              <li>Use automated systems or bots without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Professional Services</h2>
            <p className="text-foreground/80">
              Professionals listed on BlueCaller are independent contractors. BlueCaller does not employ 
              these professionals and is not responsible for their services, quality, or conduct. All 
              agreements for services are between users and professionals directly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Payment and Fees</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Payment terms are agreed upon between users and professionals</li>
              <li>BlueCaller may charge service fees as disclosed at the time of transaction</li>
              <li>All fees are non-refundable unless otherwise stated</li>
              <li>Users are responsible for any applicable taxes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Content and Intellectual Property</h2>
            <p className="text-foreground/80">
              Users retain ownership of content they post. By posting content, you grant BlueCaller a 
              worldwide, non-exclusive license to use, display, and distribute your content on the platform. 
              You must not post content that infringes on others' intellectual property rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">8. Termination</h2>
            <p className="text-foreground/80">
              We reserve the right to suspend or terminate accounts that violate these terms or for any 
              other reason at our discretion. Users may close their accounts at any time through account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">9. Disclaimers and Limitations</h2>
            <p className="text-foreground/80">
              BlueCaller is provided "as is" without warranties of any kind. We are not liable for any 
              indirect, incidental, or consequential damages arising from your use of the service. Our 
              total liability is limited to the amount you paid us in the past 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">10. Changes to Terms</h2>
            <p className="text-foreground/80">
              We may update these terms at any time. Continued use of the service after changes constitutes 
              acceptance of the new terms. We will notify users of significant changes via email or platform notification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">11. Contact</h2>
            <p className="text-foreground/80">
              For questions about these terms, contact us at legal@bluecaller.com
            </p>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default TermsOfService;
