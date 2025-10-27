import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CommunityGuidelines = () => {
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

        <h1 className="text-4xl font-bold text-foreground mb-4">Community Guidelines</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">Our Vision</h2>
            <p className="text-foreground/80">
              BlueCaller is built on trust, respect, and professionalism. These guidelines help maintain a 
              safe and positive community for everyone. By using our platform, you agree to follow these standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Be Respectful and Professional</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Treat everyone with respect:</strong> Be courteous in all communications</li>
              <li><strong>Use appropriate language:</strong> No profanity, insults, or offensive content</li>
              <li><strong>Respect boundaries:</strong> Honor people's time, privacy, and personal space</li>
              <li><strong>Give constructive feedback:</strong> Reviews should be honest but fair</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. Be Honest and Transparent</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Accurate information:</strong> Provide truthful details about services, qualifications, and availability</li>
              <li><strong>Clear pricing:</strong> Be upfront about costs and fees</li>
              <li><strong>Honest reviews:</strong> Only review services you actually received</li>
              <li><strong>Authentic profiles:</strong> Use real photos and accurate descriptions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. Safety First</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Meet safely:</strong> For in-person services, meet in safe, public locations when possible</li>
              <li><strong>Verify credentials:</strong> Professionals should provide relevant licenses or certifications</li>
              <li><strong>Report concerns:</strong> If something feels wrong, report it immediately</li>
              <li><strong>Protect personal information:</strong> Don't share sensitive data unnecessarily</li>
              <li><strong>Trust your instincts:</strong> If a situation feels unsafe, remove yourself</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Strictly Prohibited Behavior</h2>
            <p className="text-foreground/80 mb-2">The following actions will result in immediate account suspension or termination:</p>
            
            <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">Harassment and Abuse</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Threatening, intimidating, or bullying behavior</li>
              <li>Stalking or unwanted contact after being asked to stop</li>
              <li>Hate speech or discrimination based on race, gender, religion, sexual orientation, disability, or other protected characteristics</li>
              <li>Sexual harassment or inappropriate sexual content</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">Fraud and Scams</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Fake profiles or impersonation</li>
              <li>Payment scams or requesting payment outside the platform</li>
              <li>False advertising or bait-and-switch tactics</li>
              <li>Identity theft or using stolen payment methods</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">Illegal Activities</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Offering or requesting illegal services</li>
              <li>Selling counterfeit goods or stolen property</li>
              <li>Drug-related activities</li>
              <li>Any activity that violates local, state, or federal laws</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">Platform Abuse</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Spam or unsolicited commercial messages</li>
              <li>Manipulating reviews or ratings</li>
              <li>Creating multiple accounts to abuse features</li>
              <li>Attempting to hack or compromise the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Professional Standards for Service Providers</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Deliver quality work:</strong> Provide services as described and agreed upon</li>
              <li><strong>Communicate clearly:</strong> Respond promptly and keep clients informed</li>
              <li><strong>Honor commitments:</strong> Show up on time and complete agreed work</li>
              <li><strong>Handle disputes professionally:</strong> Work to resolve issues calmly and fairly</li>
              <li><strong>Maintain proper licensing:</strong> Ensure all required licenses and insurance are current</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Client Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Provide clear requirements:</strong> Communicate your needs and expectations upfront</li>
              <li><strong>Be available:</strong> Respond to messages and provide necessary access</li>
              <li><strong>Pay fairly and on time:</strong> Honor payment agreements</li>
              <li><strong>Respect professional time:</strong> Don't make excessive demands or last-minute changes</li>
              <li><strong>Give fair reviews:</strong> Base reviews on actual experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Content Guidelines</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Keep content appropriate for all audiences</li>
              <li>Don't post violent, graphic, or disturbing content</li>
              <li>Respect intellectual property rights</li>
              <li>Don't post private information about others</li>
              <li>Avoid excessive self-promotion or spam</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">8. Reporting Violations</h2>
            <p className="text-foreground/80">
              If you witness behavior that violates these guidelines:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Report it immediately using the in-app reporting tools</li>
              <li>Provide specific details and evidence when possible</li>
              <li>Do not retaliate or engage with the violator</li>
              <li>For emergencies, contact local authorities first</li>
            </ul>
            <p className="text-foreground/80 mt-2">
              Contact us at: support@bluecaller.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">9. Enforcement</h2>
            <p className="text-foreground/80">
              Violations of these guidelines may result in:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Warning:</strong> First-time minor violations</li>
              <li><strong>Temporary suspension:</strong> Repeated or moderate violations</li>
              <li><strong>Permanent ban:</strong> Serious violations or repeated offenses</li>
              <li><strong>Legal action:</strong> For illegal activities or significant harm</li>
            </ul>
            <p className="text-foreground/80 mt-2">
              We review all reports thoroughly and apply consequences consistently and fairly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">10. Dispute Resolution</h2>
            <p className="text-foreground/80">
              If you have a dispute with another user:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li>Try to resolve it directly and professionally first</li>
              <li>Use our platform messaging to keep records</li>
              <li>Contact support if you need mediation</li>
              <li>Provide documentation (messages, contracts, receipts)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">11. Updates to Guidelines</h2>
            <p className="text-foreground/80">
              We may update these guidelines as our community grows and evolves. Significant changes will 
              be announced via email and platform notifications. Continued use of BlueCaller indicates 
              acceptance of updated guidelines.
            </p>
          </section>

          <section className="bg-accent/50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-foreground mb-3">Building Together</h2>
            <p className="text-foreground/80">
              These guidelines exist to protect and support our community. By following them, you help create 
              a platform where professionals can thrive and clients can find quality services with confidence. 
              Thank you for being part of BlueCaller!
            </p>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default CommunityGuidelines;
