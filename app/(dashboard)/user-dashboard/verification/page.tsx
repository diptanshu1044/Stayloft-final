"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, CheckCircle, AlertCircle, Clock, Shield, FileText, CreditCard, Car } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/useToast";
import { VerificationStatus } from "@/types";

const VerificationTab = () => {
  // Mock verification data - in a real app, this would come from API calls
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("PENDING");
  const [documents, setDocuments] = useState([
    { 
      id: "1", 
      type: "AADHAAR" as const, 
      status: "PENDING" as VerificationStatus, 
      fileName: "aadhaar_card.jpg", 
      uploadedAt: new Date(2025, 3, 10) 
    },
    { 
      id: "2", 
      type: "PAN" as const, 
      status: "PENDING" as VerificationStatus, 
      fileName: "", 
      uploadedAt: new Date() 
    },
    { 
      id: "3", 
      type: "DRIVERS_LICENSE" as const, 
      status: "PENDING" as VerificationStatus, 
      fileName: "", 
      uploadedAt: new Date() 
    }
  ]);
  
  const fileInputRefs = {
    AADHAAR: useRef<HTMLInputElement>(null),
    PAN: useRef<HTMLInputElement>(null),
    DRIVERS_LICENSE: useRef<HTMLInputElement>(null),
  };
  
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState<string | null>(null);
  
  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "VERIFIED":
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Verified</span>
          </div>
        );
      case "PENDING":
        return (
          <div className="flex items-center text-amber-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>Under Review</span>
          </div>
        );
      case "REJECTED":
        return (
          <div className="flex items-center text-red-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>Rejected</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  const handleUploadClick = (type: string) => {
    if (type === "AADHAAR") fileInputRefs.AADHAAR.current?.click();
    if (type === "PAN") fileInputRefs.PAN.current?.click();
    if (type === "DRIVERS_LICENSE") fileInputRefs.DRIVERS_LICENSE.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file less than 5MB in size.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(type);
    
    // In a real app, you would upload the file to your backend/storage service
    // For demo purposes, simulate an upload delay
    setTimeout(() => {
      setDocuments(prev => prev.map(doc => 
        doc.type === type 
          ? { ...doc, fileName: file.name, status: "PENDING", uploadedAt: new Date() } 
          : doc
      ));
      
      setIsUploading(null);
      
      toast({
        title: "Document uploaded",
        description: `Your ${getDocumentTypeName(type)} has been uploaded and is being reviewed.`
      });
      
      // Update overall verification status
      updateOverallStatus();
    }, 1500);
  };
  
  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case "AADHAAR": return "Aadhaar Card";
      case "PAN": return "PAN Card";
      case "DRIVERS_LICENSE": return "Driving License";
      default: return type;
    }
  };
  
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "AADHAAR": return <CreditCard className="h-5 w-5 text-primary" />;
      case "PAN": return <FileText className="h-5 w-5 text-primary" />;
      case "DRIVERS_LICENSE": return <Car className="h-5 w-5 text-primary" />;
      default: return <Shield className="h-5 w-5 text-primary" />;
    }
  };
  
  const updateOverallStatus = () => {
    // If any document is verified, set overall status to VERIFIED
    if (documents.some(doc => doc.status === "VERIFIED")) {
      setVerificationStatus("VERIFIED");
    } 
    // If any document is rejected, set overall status to REJECTED
    else if (documents.some(doc => doc.status === "REJECTED")) {
      setVerificationStatus("REJECTED");
    }
    // If all documents are pending, set overall status to PENDING
    else {
      setVerificationStatus("PENDING");
    }
  };
  
  const getVerificationProgress = () => {
    const uploadedCount = documents.filter(doc => doc.fileName).length;
    const verifiedCount = documents.filter(doc => doc.status === "VERIFIED").length;
    
    // Calculate progress based on upload and verification status
    const totalSteps = documents.length * 2; // Upload + verification for each document
    const completedSteps = uploadedCount + verifiedCount;
    
    return Math.floor((completedSteps / totalSteps) * 100);
  };
  
  const getVerificationGuide = () => {
    return (
      <div className="space-y-4 mt-6">
        <h3 className="font-medium text-lg">Verification Guide</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <span className="font-bold">1</span>
            </div>
            <div>
              <p className="font-medium">Submit Clear Documents</p>
              <p className="text-muted-foreground">
                Upload clear, unedited scans or photos of your original documents. All text must be clearly visible.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <span className="font-bold">2</span>
            </div>
            <div>
              <p className="font-medium">Verification Time</p>
              <p className="text-muted-foreground">
                Document verification typically takes 24-48 hours to complete.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <span className="font-bold">3</span>
            </div>
            <div>
              <p className="font-medium">Stay Updated</p>
              <p className="text-muted-foreground">
                You'll receive an email notification once your documents have been reviewed.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Identity Verification</CardTitle>
              <CardDescription>
                Verify your identity to unlock full account features
              </CardDescription>
            </div>
            {getStatusBadge(verificationStatus)}
          </div>
          <div className="mt-4">
            <Progress value={getVerificationProgress()} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Verification progress: {getVerificationProgress()}%
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Hidden file inputs */}
            <input
              type="file"
              ref={fileInputRefs.AADHAAR}
              style={{ display: 'none' }}
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange(e, "AADHAAR")}
            />
            <input
              type="file"
              ref={fileInputRefs.PAN}
              style={{ display: 'none' }}
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange(e, "PAN")}
            />
            <input
              type="file"
              ref={fileInputRefs.DRIVERS_LICENSE}
              style={{ display: 'none' }}
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange(e, "DRIVERS_LICENSE")}
            />
            
            {/* Aadhaar Card */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Aadhaar Card (Required)</p>
                  <p className="text-sm text-muted-foreground">
                    Upload a clear image of your Aadhaar card (front and back)
                  </p>
                </div>
              </div>
              
              {documents.find(doc => doc.type === "AADHAAR")?.fileName ? (
                <div className="text-right">
                  <p className="text-sm font-medium">{documents.find(doc => doc.type === "AADHAAR")?.fileName}</p>
                  <div className="mt-1">
                    {getStatusBadge(documents.find(doc => doc.type === "AADHAAR")?.status || "PENDING")}
                  </div>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => handleUploadClick("AADHAAR")}
                  disabled={isUploading === "AADHAAR"}
                >
                  <UploadCloud className="h-4 w-4 mr-2" />
                  {isUploading === "AADHAAR" ? "Uploading..." : "Upload"}
                </Button>
              )}
            </div>
            
            {/* PAN Card */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">PAN Card (Required)</p>
                  <p className="text-sm text-muted-foreground">
                    Upload a clear image of your PAN card
                  </p>
                </div>
              </div>
              
              {documents.find(doc => doc.type === "PAN")?.fileName ? (
                <div className="text-right">
                  <p className="text-sm font-medium">{documents.find(doc => doc.type === "PAN")?.fileName}</p>
                  <div className="mt-1">
                    {getStatusBadge(documents.find(doc => doc.type === "PAN")?.status || "PENDING")}
                  </div>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => handleUploadClick("PAN")}
                  disabled={isUploading === "PAN"}
                >
                  <UploadCloud className="h-4 w-4 mr-2" />
                  {isUploading === "PAN" ? "Uploading..." : "Upload"}
                </Button>
              )}
            </div>
            
            {/* Driving License */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Car className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Driving License (Optional)</p>
                  <p className="text-sm text-muted-foreground">
                    Upload a clear image of your driving license (front and back)
                  </p>
                </div>
              </div>
              
              {documents.find(doc => doc.type === "DRIVERS_LICENSE")?.fileName ? (
                <div className="text-right">
                  <p className="text-sm font-medium">{documents.find(doc => doc.type === "DRIVERS_LICENSE")?.fileName}</p>
                  <div className="mt-1">
                    {getStatusBadge(documents.find(doc => doc.type === "DRIVERS_LICENSE")?.status || "PENDING")}
                  </div>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => handleUploadClick("DRIVERS_LICENSE")}
                  disabled={isUploading === "DRIVERS_LICENSE"}
                >
                  <UploadCloud className="h-4 w-4 mr-2" />
                  {isUploading === "DRIVERS_LICENSE" ? "Uploading..." : "Upload"}
                </Button>
              )}
            </div>
          </div>
          
          {getVerificationGuide()}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Benefits of Verification</CardTitle>
          <CardDescription>
            Verified accounts enjoy enhanced features and trustworthiness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="font-medium">Increased Trust</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Property owners prefer verified tenants, increasing your chances of booking acceptance.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="font-medium">Faster Approvals</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Verified accounts get faster booking approvals from property owners.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="font-medium">Verified Badge</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Your profile will display a verification badge, building trust with property owners.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="font-medium">Enhanced Security</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Creates a safer community for all StayLoft users with verified identities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationTab;
