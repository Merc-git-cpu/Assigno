
"use client";

import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { User, Bell, GraduationCap, Save, Loader2, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const { profile, loading, updateProfile } = useProfile();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    university: "",
    urgentAlerts: true,
    dailySummary: true,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || "",
        university: profile.university || "",
        urgentAlerts: profile.notificationSettings?.urgentAlerts ?? true,
        dailySummary: profile.notificationSettings?.dailySummary ?? true,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        displayName: formData.displayName,
        university: formData.university,
        notificationSettings: {
          urgentAlerts: formData.urgentAlerts,
          dailySummary: formData.dailySummary,
        },
      });
      toast({
        title: "Profile Updated",
        description: "Your settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save your profile changes.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-headline font-bold">Student Profile</h1>
        <p className="text-muted-foreground">Manage your identity and app preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>How you appear to the Assigno platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={formData.displayName} 
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uni">University / College</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="uni" 
                    placeholder="e.g., Stanford University" 
                    value={formData.university}
                    onChange={(e) => setFormData({...formData, university: e.target.value})}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                In-App Notifications
              </CardTitle>
              <CardDescription>Real-time alerts while using the app.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Urgent Deadline Toasts</Label>
                  <p className="text-xs text-muted-foreground">Receive real-time popups for tasks due within 1 hour.</p>
                </div>
                <Switch 
                  checked={formData.urgentAlerts} 
                  onCheckedChange={(checked) => setFormData({...formData, urgentAlerts: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daily Summary Pulse</Label>
                  <p className="text-xs text-muted-foreground">Highlight upcoming tasks on your dashboard every morning.</p>
                </div>
                <Switch 
                  checked={formData.dailySummary} 
                  onCheckedChange={(checked) => setFormData({...formData, dailySummary: checked})}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Account Security
              </CardTitle>
              <CardDescription>Managed via Firebase Authentication.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-xl border space-y-2">
                <p className="text-sm font-medium">Email Verification</p>
                <p className="text-xs text-muted-foreground">We use built-in Firebase security to verify your identity and protect your data.</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl border space-y-2">
                <p className="text-sm font-medium">Password Management</p>
                <p className="text-xs text-muted-foreground">Reset your password anytime using the link on the login page.</p>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t p-4 flex justify-end">
              <Button onClick={handleSave} disabled={saving} className="rounded-xl shadow-md">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-none shadow-xl">
            <CardHeader>
              <div className="h-20 w-20 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <span className="text-4xl font-bold">{formData.displayName.charAt(0)}</span>
              </div>
              <CardTitle>{formData.displayName}</CardTitle>
              <CardDescription className="text-primary-foreground/70">
                {formData.university || "Academic Explorer"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2 opacity-90">
                <p>Status: Active Student</p>
                <p>Account Secure: Yes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
