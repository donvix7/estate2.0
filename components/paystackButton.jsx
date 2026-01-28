"use client";

import React, { useState } from 'react';
import { Button } from "@nextui-org/react";

const PaystackButton = ({ 
  publicKey, 
  email, 
  amount, 
  onSuccess, 
  onClose, 
  text = "Pay Now",
  metadata = {},
  currency = "NGN",
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const initializePayment = () => {
    setIsLoading(true);
    
    // Load Paystack script dynamically
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    
    script.onload = () => {
      // @ts-ignore - Paystack is loaded globally
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: email,
        amount: amount, // amount in kobo
        ref: `PSK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        metadata: metadata,
        currency: currency,
        callback: (response) => {
          setIsLoading(false);
          console.log('Payment successful:', response);
          onSuccess?.(response);
        },
        onClose: () => {
          setIsLoading(false);
          console.log('Payment window closed');
          onClose?.();
        },
      });
      
      handler.openIframe();
    };
    
    script.onerror = () => {
      setIsLoading(false);
      console.error('Failed to load Paystack script');
    };
    
    document.head.appendChild(script);
  };

  return (
    <Button
      onClick={initializePayment}
      isLoading={isLoading}
      color="primary"
      {...props}
    >
      {text}
    </Button>
  );
};

export default PaystackButton;