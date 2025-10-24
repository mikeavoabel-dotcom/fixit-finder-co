import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professionalId: string;
  professionalName: string;
  phone: string | null;
  specialty: string;
  serviceZipcodes: string[];
}

const ContactDialog = ({ 
  open, 
  onOpenChange,
  professionalId,
  professionalName,
  phone,
  specialty,
  serviceZipcodes
}: ContactDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCall = () => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleMessage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Login required",
          description: "Please login to send messages",
          variant: "destructive",
        });
        return;
      }

      // Get professional's user_id
      const { data: professional } = await supabase
        .from('professionals')
        .select('user_id')
        .eq('id', professionalId)
        .single();

      if (professional) {
        onOpenChange(false);
        navigate(`/conversation/${professional.user_id}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {professionalName}</DialogTitle>
          <DialogDescription>{specialty}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted">
            <Phone className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">Phone</p>
              <p className="text-sm text-muted-foreground">
                {phone || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">Service Areas</p>
              <p className="text-sm text-muted-foreground">
                {serviceZipcodes.join(', ')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button onClick={handleMessage} variant="default" className="w-full">
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            {phone && (
              <Button onClick={handleCall} variant="outline" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
