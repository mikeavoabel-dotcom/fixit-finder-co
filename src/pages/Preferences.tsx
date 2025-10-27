import { useState } from "react";
import SimpleHeader from "@/components/SimpleHeader";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Preferences = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const handleSave = () => {
    toast({
      title: "Preferences Updated",
      description: "Your settings have been saved successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <SimpleHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Preferences</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Manage how you receive updates from BlueCaller</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="flex flex-col gap-1">
                <span>Push Notifications</span>
                <span className="text-sm text-muted-foreground font-normal">
                  Receive notifications about bookings and messages
                </span>
              </Label>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="flex flex-col gap-1">
                <span>Email Updates</span>
                <span className="text-sm text-muted-foreground font-normal">
                  Get weekly updates about new professionals
                </span>
              </Label>
              <Switch
                id="email"
                checked={emailUpdates}
                onCheckedChange={setEmailUpdates}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sms" className="flex flex-col gap-1">
                <span>SMS Alerts</span>
                <span className="text-sm text-muted-foreground font-normal">
                  Receive booking confirmations via SMS
                </span>
              </Label>
              <Switch
                id="sms"
                checked={smsAlerts}
                onCheckedChange={setSmsAlerts}
              />
            </div>

            <Button onClick={handleSave} size="lg" className="w-full sm:w-auto">
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Preferences;
