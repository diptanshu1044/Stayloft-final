"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Camera, AtSign, Phone, MapPin, Shield, Languages } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/useToast";
import { Language } from "@/types";
import { updateProfile } from "@/actions/profile.action";
import { useRouter } from "next/navigation";

const ProfileTab = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Initialize user data with empty values
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    avatar: "",
    language: "English",
    theme: "system",
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
      newMessages: true,
      bookingUpdates: true,
      paymentReminders: true,
      promotions: false
    }
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        
        if (data.status === 200 && data.user) {
          setUserData(prev => ({
            ...prev,
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            address: data.user.address || "",
            bio: data.user.bio || "",
            avatar: data.user.image || "",
            language: data.user.language || "English",
            theme: data.user.theme || "system",
            notificationPreferences: data.user.notifications ? JSON.parse(data.user.notifications) : prev.notificationPreferences
          }));
          
          // Update localStorage with user data
          localStorage.setItem("userName", data.user.name || "");
          localStorage.setItem("userEmail", data.user.email || "");
          if (data.user.image) {
            localStorage.setItem("userAvatar", data.user.image);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (name: string, checked: boolean) => {
    setUserData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [name]: checked
      }
    }));
  };

  const handleLanguageChange = (value: string) => {
    setUserData(prev => ({
      ...prev,
      language: value
    }));
    localStorage.setItem("userLanguage", value);
  };
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await updateProfile({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        bio: userData.bio,
        language: userData.language,
        theme: userData.theme,
        notifications: userData.notificationPreferences
      });

      if (result.success) {
        // Update localStorage with new data
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("userEmail", userData.email);
        
        // Show success message
        toast({
          title: "Success",
          description: result.message || "Your profile has been updated successfully.",
          variant: "default"
        });

window.location.reload()

        if (result.user) {
          setUserData(prev => ({
            ...prev,
            name: result.user.name,
            email: result.user.email,
            phone: result.user.phone || "",
            address: result.user.address || "",
            bio: result.user.bio || "",
            language: result.user.language || "English",
            theme: result.user.theme || "system",
            notificationPreferences: result.user.notifications || prev.notificationPreferences
          }));
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image less than 5MB in size.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, etc.).",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // In a real app, you would upload the file to your backend/storage service
    // For demo purposes, use FileReader to get the data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const avatarUrl = event.target?.result as string;
      setUserData(prev => ({
        ...prev,
        avatar: avatarUrl
      }));
      
      // Store in localStorage for demo persistence
      localStorage.setItem("userAvatar", avatarUrl);
      
      setIsUploading(false);
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully."
      });
    };
    
    reader.readAsDataURL(file);
  };

  const calculateProfileCompletion = () => {
    let completed = 0;
    let total = 5; // name, email, phone, address, avatar
    
    if (userData.name) completed += 1;
    if (userData.email) completed += 1;
    if (userData.phone) completed += 1;
    if (userData.address) completed += 1;
    if (userData.avatar) completed += 1;
    
    return Math.floor((completed / total) * 100);
  };
  
  const completionPercentage = calculateProfileCompletion();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </div>
            <div className="flex items-center bg-primary/10 px-3 py-1 rounded-full">
              <span className="text-sm font-medium">Profile completion: {completionPercentage}%</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="pt-6">
              <form onSubmit={handleSaveProfile}>
                <div className="flex flex-col md:flex-row gap-8 mb-6">
                  <div className="flex flex-col items-center space-y-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback className="text-2xl">
                        {userData.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center"
                      onClick={handleAvatarClick}
                      disabled={isUploading}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {isUploading ? "Uploading..." : "Change Photo"}
                    </Button>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="flex">
                          <div className="bg-muted p-2 rounded-l-md flex items-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Input 
                            id="name" 
                            name="name"
                            defaultValue={userData.name} 
                            onChange={handleInputChange}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="flex">
                          <div className="bg-muted p-2 rounded-l-md flex items-center">
                            <AtSign className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Input 
                            id="email" 
                            name="email"
                            type="email" 
                            defaultValue={userData.email}
                            onChange={handleInputChange}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex">
                          <div className="bg-muted p-2 rounded-l-md flex items-center">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Input 
                            id="phone" 
                            name="phone"
                            defaultValue={userData.phone}
                            onChange={handleInputChange}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="flex">
                          <div className="bg-muted p-2 rounded-l-md flex items-center">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Input 
                            id="address" 
                            name="address"
                            defaultValue={userData.address}
                            onChange={handleInputChange}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          name="bio"
                          defaultValue={userData.bio}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="Tell us a little about yourself"
                        />
                      </div>
                    </div>
                    
                    <Button type="submit">Save Changes</Button>
                  </div>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="preferences" className="pt-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Theme</h3>
                  <p className="text-muted-foreground text-sm mb-4">Choose your preferred theme</p>
                  <div className="flex items-center space-x-2">
                    <ModeToggle />
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">Language</h3>
                  <p className="text-muted-foreground text-sm mb-4">Select your preferred language</p>
                  <div className="max-w-xs">
                    <Select value={userData.language} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-full">
                        <div className="flex items-center gap-2">
                          <Languages className="h-4 w-4" />
                          <SelectValue placeholder="Select a language" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Tamil">Tamil</SelectItem>
                        <SelectItem value="Telugu">Telugu</SelectItem>
                        <SelectItem value="Kannada">Kannada</SelectItem>
                        <SelectItem value="Malayalam">Malayalam</SelectItem>
                        <SelectItem value="Bengali">Bengali</SelectItem>
                        <SelectItem value="Marathi">Marathi</SelectItem>
                        <SelectItem value="Gujarati">Gujarati</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">Security</h3>
                  <p className="text-muted-foreground text-sm mb-4">Manage your account security</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                          <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="pt-6 space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-muted-foreground text-sm">Receive updates via email</p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={userData.notificationPreferences.email}
                      onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-muted-foreground text-sm">Receive updates via browser notifications</p>
                    </div>
                    <Switch 
                      id="push-notifications" 
                      checked={userData.notificationPreferences.push}
                      onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-muted-foreground text-sm">Receive updates via SMS</p>
                    </div>
                    <Switch 
                      id="sms-notifications" 
                      checked={userData.notificationPreferences.sms}
                      onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-3">Notification Types</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <Label htmlFor="new-messages">New Messages</Label>
                        <p className="text-muted-foreground text-sm">Get notified when you receive new messages</p>
                      </div>
                      <Switch 
                        id="new-messages" 
                        checked={userData.notificationPreferences.newMessages}
                        onCheckedChange={(checked) => handleNotificationChange("newMessages", checked)}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <Label htmlFor="booking-updates">Booking Updates</Label>
                        <p className="text-muted-foreground text-sm">Get notified about your booking status changes</p>
                      </div>
                      <Switch 
                        id="booking-updates" 
                        checked={userData.notificationPreferences.bookingUpdates}
                        onCheckedChange={(checked) => handleNotificationChange("bookingUpdates", checked)}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <Label htmlFor="payment-reminders">Payment Reminders</Label>
                        <p className="text-muted-foreground text-sm">Get reminded about upcoming payment dues</p>
                      </div>
                      <Switch 
                        id="payment-reminders" 
                        checked={userData.notificationPreferences.paymentReminders}
                        onCheckedChange={(checked) => handleNotificationChange("paymentReminders", checked)}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <Label htmlFor="promotions">Promotions & Offers</Label>
                        <p className="text-muted-foreground text-sm">Receive updates about discounts and special offers</p>
                      </div>
                      <Switch 
                        id="promotions" 
                        checked={userData.notificationPreferences.promotions}
                        onCheckedChange={(checked) => handleNotificationChange("promotions", checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button onClick={() => toast({ title: "Preferences saved", description: "Your notification preferences have been updated." })}>
                  Save Preferences
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
