import { createFileRoute, redirect } from "@tanstack/react-router";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useServerFn } from "@tanstack/react-start";
import { Calendar, CreditCard, LockKeyhole, User } from "lucide-react";
import { toast } from "sonner";
import type { FieldConfigs } from "@/types/form-types";
import type { PaymentInfoSchema } from "@/types/auth";
import { createUser, getSessionData } from "@/lib/auth-server-fn";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { paymentInfoSchema } from "@/schemas/payment-info.schema";
import { useAppForm } from "@/hooks/form-context";
import { dynamicFormFactory } from "@/components/dynamic-form";

export const Route = createFileRoute("/auth/sign-up/payment-info")({
  component: RouteComponent,
  loader: async () => {
    const sessionData = await getSessionData();

    if (sessionData.state === "success") {
      throw redirect({
        to: "/dashboard",
      });
    }

    if (!sessionData.accountData && !sessionData.createdUserId) {
      throw redirect({
        to: "/auth/sign-up",
      });
    }

    if (!sessionData.userData) {
      throw redirect({
        to: "/auth/sign-up/user-data",
      });
    }

    return { sessionData };
  },
});

const fieldConfigs: FieldConfigs<PaymentInfoSchema> = {
  cardHolderName: {
    type: "text",
    label: "Card Holder Name",
    icon: <User className="h-4 w-4" />,
    placeholder: "Jane Doe",
  },
  cardNumber: {
    type: "text",
    label: "Card Number",
    icon: <CreditCard className="h-4 w-4" />,
    placeholder: "0000000000000000",
  },
  expiryMonth: {
    type: "text",
    label: "Month",
    placeholder: "MM",
    icon: <Calendar className="h-4 w-4" />,
    group: {
      name: "info",
      orientation: "horizontal",
    },
  },
  expiryYear: {
    type: "text",
    label: "Year",
    placeholder: "YYYY",
    group: {
      name: "info",
      orientation: "horizontal",
    },
  },
  cvv: {
    type: "text",
    label: "CVV",
    placeholder: "123",
    icon: <LockKeyhole className="h-4 w-4" />,
    group: {
      name: "info",
      orientation: "horizontal",
    },
  },
};

const defaultValues: PaymentInfoSchema = {
  cardHolderName: "",
  cardNumber: "",
  expiryMonth: "",
  expiryYear: "",
  cvv: "",
};

const Form = dynamicFormFactory({
  fieldConfigs,
  defaultValues,
});

export default function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const { sessionData } = Route.useLoaderData();
  const createUserFn = useServerFn(createUser);

  const form = useAppForm({
    defaultValues: {
      cardHolderName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    },
    validators: { onSubmit: paymentInfoSchema },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      toast.loading("Processing...");
      await createUserFn({
        data: {
          ...sessionData,
          paymentInfo: value,
          state: "payment-info",
        },
      })
        .catch(() => setIsLoading(false))
        .finally(() => setIsLoading(false));
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <Card className="[view-transition-name:auth-card]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment Details
          </CardTitle>
          <CardDescription>
            Complete your transaction using a secure credit card payment.
          </CardDescription>
        </CardHeader>

        <CardContent className="min-w-xl">
          <Form
            form={form}
            buttonGroup={
              <div className="mt-3">
                <form.SubscribeButton label="Pay securely" />
              </div>
            }
          />
          {/* <DynamicForm
            fieldConfigs={fieldConfigs}
            form={form}
            buttonGroup={
              <>
                <Button className="w-full font-semibold" type="submit">
                  {isLoading ? "Processing..." : "Pay Securely"}
                </Button>
              </>
            }
          />*/}
        </CardContent>
      </Card>
    </div>
  );
}
