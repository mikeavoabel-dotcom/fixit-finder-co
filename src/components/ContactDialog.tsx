import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professionalName: string;
  phone: string | null;
  specialty: string;
  serviceZipcodes: string[];
}

const ContactDialog = ({ 
  open, 
  onOpenChange, 
  professionalName,
  phone,
  specialty,
  serviceZipcodes
}: ContactDialogProps) => {
  const handleCall = () => {
    if (phone) {
      window.location.href = `tel:${phone}`;
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

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Close
            </Button>
            {phone && (
              <Button onClick={handleCall} className="flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
