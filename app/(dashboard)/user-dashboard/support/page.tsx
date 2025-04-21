"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  HelpCircle, 
  Clock, 
  Check 
} from "lucide-react";

const ContactSupportPage = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject) {
      toast.error("Please select a subject");
      return;
    }
    
    if (!message.trim()) {
      toast.error("Please enter your message");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubject("");
      setMessage("");
      toast.success("Support request submitted successfully", {
        description: "Our team will get back to you within 24 hours."
      });
    }, 1500);
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Contact Support</h1>
            <p className="text-gray-600 mt-2">
              Need help? Our support team is here to assist you with any questions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Contact Form */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Request</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1">
                        Subject
                      </label>
                      <Select value={subject} onValueChange={setSubject}>
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="account">Account Issues</SelectItem>
                            <SelectItem value="property">Property Listing</SelectItem>
                            <SelectItem value="booking">Booking Problems</SelectItem>
                            <SelectItem value="payment">Payment & Billing</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Describe your issue in detail..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Submit Request
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>

            {/* Contact Info */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Alternative ways to reach our support team.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email Support</h3>
                      <p className="text-sm text-gray-600">
                        support@stayloft.com
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Response within 24 hours
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Phone Support</h3>
                      <p className="text-sm text-gray-600">
                        +91 1800-123-4567
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Mon-Fri, 9:00 AM - 6:00 PM IST
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Help Center</h3>
                      <p className="text-sm text-gray-600">
                        Visit our help center for FAQs and tutorials
                      </p>
                      <a href="#" className="text-xs text-primary flex items-center mt-1">
                        Browse Help Articles <Check className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mx-auto mb-4">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-center font-semibold mb-2">Premium Support</h3>
                    <p className="text-sm text-gray-600 text-center mb-4">
                      Get priority support with faster response times for your business needs.
                    </p>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactSupportPage;
