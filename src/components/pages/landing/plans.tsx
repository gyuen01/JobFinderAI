/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/M71a8xjnuq7
 */

//import ract stuff
import { useState } from "react";

//import clerk stuff
import { useUser } from "@clerk/clerk-react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

//import convex stuff
import { useAction, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

//import shadcnui stuff
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

//import icon stuff
import { Check, CheckCircle } from "lucide-react";

// Define a type for the plan to ensure type safety
type PlanType = {
  title: string;
  description: string;
  monthlyPrice: string;
  annualPrice: string;
  pricePeriod: string;
  features: { description: string; isNew?: boolean }[]; // Updated features type
};

// Array of plans
const plans: PlanType[] = [
  {
    title: "Hobby",
    description: "For individuals and small teams just getting started.",
    monthlyPrice: "Free",
    annualPrice: "Free",
    pricePeriod: "/month",
    features: [
      { description: "5 products" },
      { description: "Up to 1,000 subscribers" },
      { description: "Basic analytics", isNew: true },
      { description: "48-hour support response time" },
    ],
  },
  {
    title: "Pro",
    description: "A plan that scales with your rapidly growing team.",
    monthlyPrice: "10",
    annualPrice: "8",
    pricePeriod: "/month",
    features: [
      { description: "25 products" },
      { description: "Up to 10,000 subscribers" },
      { description: "Advanced analytics" },
      { description: "24-hour support response time" },
      { description: "Marketing automations", isNew: true },
    ],
  },
  {
    title: "Enterprise",
    description: "Dedicated support and infrastructure for your company.",
    monthlyPrice: "Custom",
    annualPrice: "Custom",
    pricePeriod: "/month",
    features: [
      { description: "Unlimited products" },
      { description: "Unlimited subscribers" },
      { description: "Advanced analytics" },
      { description: "24/7 support response time" },
      { description: "Marketing automations" },
      { description: "Custom integrations" },
    ],
  },
];

export function Plans() {
  const { user } = useUser();
  // const isSubscribed = useQuery(api.subscriptions.getIsSubscribed, {
  //   userId: user?.id,
  // });

  const isSubscribed = true;
  const [pending, setpending] = useState(false);

  const portal = useAction(api.stripe.portal);
  const pay = useAction(api.stripe.pay);

  const onClickHandleStripe = async () => {
    if (!user) return;

    setpending(true);

    try {
      const action = isSubscribed ? portal : pay;

      const redirectURL = await action({ userId: user.id });

      window.location.href = redirectURL;
    } finally {
      setpending(false);
    }
  };

  const [isAnnual, setIsAnnual] = useState(false); // State to toggle between monthly and annual pricing

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mx-3 space-y-2 lg:space-y-3 max-w-md md:max-w-2xl lg:max-w-3xl">
          <h1 className="leading-tight lg::leading-snug font-black text-5xl ">
            A Plan to fit any team and any budget.
          </h1>
          <p className="leading-normal text-xl text-muted-foreground">
            Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et
            quasi iusto modi velit ut non voluptas in. Explicabo id ut laborum.
          </p>
        </div>
        <div className="flex justify-center space-x-4 mt-8">
          <div className="relative flex items-start md:items-center space-x-4">
            <p>Monthly</p>
            <Switch
              checked={isAnnual}
              onCheckedChange={() => setIsAnnual(!isAnnual)}
            />
            <p>Annually</p>
            <Badge variant="secondary" className="absolute -right-20">
              20% Off
            </Badge>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {plans.map((plan) => (
          <Card key={plan.title} className=" max-w-sm ">
            <CardHeader>
              <CardTitle>{plan.title}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {isAnnual ? plan.annualPrice : plan.monthlyPrice}
              </p>
              <p className="text-sm mb-4">{plan.pricePeriod}</p>
              <SignedOut>
                <SignUpButton>
                  <Button variant="default" className="text-md">
                    Get Started
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                {plan.title === "Hobby" ? (
                  isSubscribed ? (
                    <Button onClick={onClickHandleStripe} disabled={pending}>
                      Downgrade
                    </Button>
                  ) : (
                    <Button variant="secondary" disabled={pending}>
                      Continue
                    </Button>
                  )
                ) : plan.title === "Pro" ? (
                  isSubscribed ? (
                    <Button variant="secondary" disabled={pending}>
                      Continue
                    </Button>
                  ) : (
                    <Button onClick={onClickHandleStripe} disabled={pending}>
                      Upgrade
                    </Button>
                  )
                ) : (
                  <Button variant="outline" disabled={pending}>
                    Contact Us
                  </Button>
                )}
              </SignedIn>
            </CardContent>
            <CardFooter>
              <ul className="mt-4 mb-20 space-y-2">
                {plan.features.map((feature) => (
                  <div key={feature.description} className="flex items-center">
                    <Check size={16} className="mr-4" />
                    <span>{feature.description}</span>
                    {feature.isNew && (
                      <Badge variant="destructive" className="ml-2">
                        New
                      </Badge> // Displaying the "New" badge
                    )}
                  </div>
                ))}
              </ul>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
