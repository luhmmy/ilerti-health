"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../lib/api";
import { toast } from "sonner";
import { Button } from "../../../../components/ui/button";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const consultation = await api.consultations.create({
        doctorId: params.id,
        type: "video",
        date: new Date().toISOString(),
      });
      
      // Simulate payment flow
      toast.success("Payment successful!");
      router.push(`/consultations/${consultation.id}`);
    } catch (error) {
      toast.error("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-6 text-teal-900">Checkout</h1>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between border-b pb-4">
            <span className="text-gray-600">Consultation Fee</span>
            <span className="font-semibold">₦15,000</span>
          </div>
          <div className="flex justify-between border-b pb-4">
            <span className="text-gray-600">Platform Fee</span>
            <span className="font-semibold">₦500</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-teal-600">₦15,500</span>
          </div>
        </div>

        <Button 
          className="w-full" 
          size="lg" 
          onClick={handleCheckout} 
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay with Paystack"}
        </Button>
      </div>
    </div>
  );
}
