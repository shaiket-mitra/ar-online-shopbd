"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { PasswordInput } from "../ui/password-input";

const formSchema = z.object({
  current_password: z.string(),
  new_password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  confirm_new_password: z.string(),
});

export default function ChangePassForm() {
  const [updatingPass, setUpdatingPass] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setUpdatingPass(true);
      const { data } = await axios.patch("/api/profile/update-pass", values);
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Problem in updating profile", error);
      toast.error("Failed to update profile");
    } finally {
      setUpdatingPass(false);
      const modal = document.getElementById("change_pass") as HTMLDialogElement;
      modal?.close();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="current_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Current Password" {...field} />
              </FormControl>
              <FormDescription>Enter your current password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="New Password" {...field} />
              </FormControl>
              <FormDescription>Enter your new password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm_new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Confirm New Password" {...field} />
              </FormControl>
              <FormDescription>Confirm your new password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {updatingPass ? (
          <Button
            type="submit"
            className="bg-pink-400 hover:bg-pink-500 btn btn-secondary w-full"
          >
            <span className="loading loading-spinner text-secondary"></span>
            Submiting
          </Button>
        ) : (
          <Button
            type="submit"
            className="bg-pink-400 hover:bg-pink-500 btn btn-secondary w-full"
          >
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
}
