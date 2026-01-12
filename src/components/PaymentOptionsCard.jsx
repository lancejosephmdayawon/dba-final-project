"use client";

import { CreditCard, Banknote, Smartphone } from "lucide-react";

export default function PaymentOptionsCard() {
  const paymentOptions = [
    {
      id: 1,
      name: "Over the Counter (Cash)",
      description: "Pay directly at our clinic reception.",
      icon: <Banknote className="w-6 h-6 text-blue-500" />,
    },
    {
      id: 2,
      name: "GCash",
      description: "Send your payment via GCash app quickly.",
      icon: <Smartphone className="w-6 h-6 text-blue-500" />,
    },
    {
      id: 3,
      name: "Credit Card",
      description: "Pay conveniently with your credit card.",
      icon: <CreditCard className="w-6 h-6 text-blue-500" />,
    },
    {
      id: 4,
      name: "Debit Card",
      description: "Use your debit card for instant payment.",
      icon: <CreditCard className="w-6 h-6 text-blue-500" />,
    },
  ];

  return (
    <div className="m-6 p-6 bg-blue-50 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Options</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paymentOptions.map((option) => (
          <div
            key={option.id}
            className="flex items-start p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-3 bg-blue-50 rounded-full mr-4 flex items-center justify-center">
              {option.icon}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{option.name}</p>
              <p className="text-sm text-gray-600 mt-1">{option.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
