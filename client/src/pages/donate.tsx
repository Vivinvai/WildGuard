import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Heart, CreditCard, Shield, Trees, Leaf, Crown, Award } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { openRazorpayPayment, type RazorpayResponse, type PaymentOrder } from "@/lib/razorpay";

interface DonationFormData {
  name: string;
  email: string;
  amount: number;
  message?: string;
  paymentMethod?: string;
}

interface DonationResponse {
  donation: {
    id: string;
    name: string;
    email: string;
    amount: number;
    receiptNumber: string;
    paymentStatus: string;
  };
  paymentOrder?: PaymentOrder;
}

const DONATION_TIERS = [
  { 
    amount: 500, 
    title: "Protector", 
    icon: Shield, 
    description: "Help protect one animal for a month",
    impact: "Provides food and medical care"
  },
  { 
    amount: 1000, 
    title: "Guardian", 
    icon: Trees, 
    description: "Support habitat conservation",
    impact: "Plants 10 trees in wildlife areas"
  },
  { 
    amount: 2500, 
    title: "Champion", 
    icon: Leaf, 
    description: "Fund rescue operations",
    impact: "Rescues and rehabilitates injured animals"
  },
  { 
    amount: 5000, 
    title: "Hero", 
    icon: Crown, 
    description: "Become a wildlife hero",
    impact: "Supports entire conservation team for a week"
  }
];

export default function Donate() {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<DonationFormData>();

  // Mutation to create donation and initiate payment
  const donationMutation = useMutation({
    mutationFn: async (data: DonationFormData) => {
      const response = await apiRequest("POST", "/api/donations/create", {
        ...data,
        paymentMethod: 'card' // Default payment method
      });
      return response.json() as Promise<DonationResponse>;
    },
    onSuccess: (responseData) => {
      // Check if payment gateway is configured
      if (responseData.paymentOrder) {
        // Open Razorpay payment gateway
        setIsProcessingPayment(true);
        openRazorpayPayment(
          responseData.paymentOrder,
          {
            name: responseData.donation.name,
            email: responseData.donation.email,
          },
          (razorpayResponse: RazorpayResponse) => {
            // Payment successful - verify on server
            verifyPayment(razorpayResponse);
          },
          (error: Error) => {
            // Payment failed or cancelled
            setIsProcessingPayment(false);
            toast({
              title: "Payment Cancelled",
              description: error.message || "Payment was not completed",
              variant: "destructive",
            });
          }
        );
      } else {
        // Direct donation (no payment gateway configured)
        setIsProcessingPayment(false);
        toast({
          title: "Thank You! 🎉",
          description: `Your donation of ₹${responseData.donation.amount} has been received. Receipt: ${responseData.donation.receiptNumber}`,
        });
        resetForm();
      }
    },
    onError: (error: Error) => {
      setIsProcessingPayment(false);
      toast({
        title: "Error",
        description: error.message || "Failed to create donation. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mutation to verify payment
  const verifyPaymentMutation = useMutation({
    mutationFn: async (data: RazorpayResponse) => {
      const response = await apiRequest("POST", "/api/donations/verify", data);
      return response.json();
    },
    onSuccess: (data) => {
      setIsProcessingPayment(false);
      toast({
        title: "Payment Successful! 🎉",
        description: `Thank you for your donation of ₹${data.donation.amount}. Receipt: ${data.donation.receiptNumber}`,
      });
      resetForm();
    },
    onError: (error: Error) => {
      setIsProcessingPayment(false);
      toast({
        title: "Payment Verification Failed",
        description: error.message || "Please contact support with your transaction details.",
        variant: "destructive",
      });
    },
  });

  const verifyPayment = (razorpayResponse: RazorpayResponse) => {
    verifyPaymentMutation.mutate(razorpayResponse);
  };

  const resetForm = () => {
    setShowPaymentForm(false);
    setSelectedAmount(null);
    setCustomAmount("");
  };

  const handleTierSelect = (amount: number) => {
    setSelectedAmount(amount);
    setValue("amount", amount);
    setCustomAmount("");
    setShowPaymentForm(true);
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const amount = parseInt(value);
    if (!isNaN(amount)) {
      setSelectedAmount(amount);
      setValue("amount", amount);
    }
  };

  const onSubmit = (data: DonationFormData) => {
    const finalAmount = selectedAmount || parseInt(customAmount);
    
    if (!finalAmount || finalAmount < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum donation amount is ₹100",
        variant: "destructive",
      });
      return;
    }

    donationMutation.mutate({
      ...data,
      amount: finalAmount
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <BackButton />

        {/* Hero Section */}
        <div className="text-center py-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl text-white shadow-xl">
          <Heart className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Support Wildlife Conservation
          </h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Your donation helps protect endangered species, preserve habitats, and rescue animals in need.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">500+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Animals Rescued</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">1000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Trees Planted</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Habitats Protected</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">2000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Supporters</div>
            </CardContent>
          </Card>
        </div>

        {/* Donation Tiers */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            Choose Your Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {DONATION_TIERS.map((tier) => {
              const Icon = tier.icon;
              return (
                <Card 
                  key={tier.amount}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                    selectedAmount === tier.amount 
                      ? 'ring-2 ring-green-600 shadow-xl' 
                      : ''
                  }`}
                  onClick={() => handleTierSelect(tier.amount)}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-2 p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-full w-fit">
                      <Icon className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-lg">{tier.title}</CardTitle>
                    <div className="text-3xl font-bold text-green-600">₹{tier.amount}</div>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {tier.description}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {tier.impact}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Custom Amount */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              Or Enter Custom Amount
            </CardTitle>
            <CardDescription>Choose any amount that works for you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter amount in ₹"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="flex-1"
                min="100"
              />
              <Button 
                onClick={() => setShowPaymentForm(true)}
                disabled={!customAmount || parseInt(customAmount) < 100}
                className="bg-green-600 hover:bg-green-700"
              >
                Donate
              </Button>
            </div>
            {customAmount && parseInt(customAmount) < 100 && (
              <p className="text-sm text-red-500 mt-2">Minimum donation is ₹100</p>
            )}
          </CardContent>
        </Card>

        {/* Payment Form */}
        {showPaymentForm && (selectedAmount || customAmount) && (
          <Card className="max-w-2xl mx-auto border-2 border-green-200 dark:border-green-800">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-green-600" />
                Complete Your Donation
              </CardTitle>
              <CardDescription>
                Donating ₹{selectedAmount || customAmount} to Wildlife Conservation
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      {...register("name", { required: "Name is required" })}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Input
                    id="message"
                    {...register("message")}
                    placeholder="Share why you're supporting wildlife conservation..."
                  />
                </div>

                {/* Payment Method Selection */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
                  <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                    Payment Method
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button type="button" variant="outline" className="justify-start">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 mr-2" />
                      Visa
                    </Button>
                    <Button type="button" variant="outline" className="justify-start">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 mr-2" />
                      Mastercard
                    </Button>
                    <Button type="button" variant="outline" className="justify-start">
                      <span className="text-blue-600 font-bold mr-2">UPI</span>
                      UPI
                    </Button>
                    <Button type="button" variant="outline" className="justify-start">
                      <span className="text-green-600 font-bold mr-2">₹</span>
                      Wallet
                    </Button>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg flex items-start gap-2">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Your payment is secure and encrypted. We use industry-standard SSL encryption to protect your information.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowPaymentForm(false);
                      setSelectedAmount(null);
                      setCustomAmount("");
                    }}
                    className="flex-1"
                    disabled={isProcessingPayment}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={donationMutation.isPending || isProcessingPayment}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {donationMutation.isPending || isProcessingPayment ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isProcessingPayment ? "Processing Payment..." : "Initiating..."}
                      </>
                    ) : (
                      <>
                        <Heart className="h-4 w-4 mr-2" />
                        Donate ₹{selectedAmount || customAmount}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tax Benefits */}
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-600" />
              Tax Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              All donations are eligible for tax deduction under Section 80G of the Income Tax Act.
              You'll receive a certificate for tax exemption via email after your donation.
            </p>
          </CardContent>
        </Card>

        {/* Where Your Money Goes */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Where Your Money Goes</CardTitle>
            <CardDescription>100% of your donation goes directly to wildlife conservation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-3xl font-bold text-green-600">40%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Animal Rescue & Care</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-3xl font-bold text-green-600">35%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Habitat Conservation</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-3xl font-bold text-green-600">25%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Education & Awareness</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
