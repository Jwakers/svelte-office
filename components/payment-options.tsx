'use client';

import {
  SiAmericanexpress,
  SiApplepay,
  SiGooglepay,
  SiKlarna,
  SiMastercard,
  SiPaypal,
  SiVisa
} from '@icons-pack/react-simple-icons';
import { Info } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function PaymentOptionsComponent() {
  return (
    <div className="border p-4">
      <h3 className="mb-2 flex items-center gap-2 text-sm font-medium">
        Payment Options
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4" />
              <span className="sr-only">Payment info</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Some payment options offer flexible financing</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h3>
      <div className="mb-3 grid grid-cols-2 gap-2 text-secondary sm:grid-cols-4 sm:gap-4">
        <div className="flex flex-col items-center">
          <SiKlarna color="default" size={32} className="my-auto" />
          <span className="mt-auto text-xs">Klarna</span>
        </div>
        <div className="flex flex-col items-center">
          <SiPaypal color="default" size={32} className="my-auto" />
          <span className="mt-auto text-xs">PayPal</span>
        </div>
        <div className="flex flex-col items-center">
          <SiGooglepay color="default" size={48} className="my-auto" />
          <span className="mt-auto text-xs">Google Pay</span>
        </div>
        <div className="flex flex-col items-center">
          <SiApplepay color="default" size={48} className="my-auto" />
          <span className="mt-auto text-xs">Apple Pay</span>
        </div>
      </div>
      <div className="flex justify-center gap-2 border-t border-muted py-4">
        <SiVisa color="default" />
        <SiMastercard color="default" />
        <SiAmericanexpress color="default" />
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Full list of payment options avaialable at checkout.
        <br />
        Flexible financing available
      </p>
    </div>
  );
}
