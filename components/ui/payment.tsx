"use client";
// need email form user.
// amount the person want to pay.
import React from "react";
import { z } from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { paymentSchema } from "@/schema/schema";
import Paystack from "@paystack/inline-js";

export default function Payment() {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  const form = useForm({
    defaultValues: {
      email: "",
      amount: "",
    },
    resolver: zodResolver(paymentSchema),
  });

  async function onSubmit(data: z.infer<typeof paymentSchema>) {
    if (!publicKey) {
      toast.error("Paystack error");
      return;
    }

    const paystack = new Paystack();

    paystack.newTransaction({
      key: publicKey,
      email: data.email,
      amount: data.amount * 100, // Paystack expects kobo
      onSuccess: (transaction: string) => {
        console.log("Transaction successful:", transaction);
        toast.success("Payment successful!");
      },
      onCancel: () => {
        console.log("User cancelled");
        toast.error("Transaction Cancelled");
      },
    });
  }

  const email = useWatch({ control: form.control, name: "email" });
  const amount = useWatch({ control: form.control, name: "amount" });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-800">
            Pay with PayStack
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      {...field}
                      id={field.name}
                      type="email"
                      placeholder="Email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="amount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      {...field}
                      id={field.name}
                      type="number"
                      placeholder="Amount"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {email && amount !== undefined && (
                <Button type="submit" disabled={!email || Number(amount) <= 0}>
                  Pay
                </Button>
              )}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
