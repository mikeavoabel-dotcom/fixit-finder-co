import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InviteFriendsDialogProps {
  referralCode: string;
  trigger: React.ReactNode;
}

const InviteFriendsDialog = ({ referralCode, trigger }: InviteFriendsDialogProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const referralLink = `${window.location.origin}/auth?ref=${referralCode}`;
  const shareMessage = `Join Fixific and get 10% off (up to $97)! Use my referral code: ${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Fixific",
          text: shareMessage,
          url: referralLink,
        });
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      // Fallback to copying
      handleCopy();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Friends</DialogTitle>
          <DialogDescription>
            Share your referral code and give your friends 10% off (up to $97) on their first booking!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Referral Code</label>
            <div className="flex gap-2">
              <Input
                value={referralCode}
                readOnly
                className="font-mono text-lg font-bold"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Share Link</label>
            <div className="flex gap-2">
              <Input
                value={referralLink}
                readOnly
                className="text-sm"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button onClick={handleShare} className="w-full" size="lg">
            <Share2 className="mr-2 h-4 w-4" />
            Share Referral
          </Button>

          <div className="bg-accent p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>How it works:</strong> When someone signs up using your referral code, 
              they'll receive 10% off their first booking (up to $97 discount).
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteFriendsDialog;