"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import { imageUpload } from "@/lib/imageUpload";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  full_name: z.string().min(4, {
    message: "Full name must be at least 4 characters.",
  }).max(30, {
    message: "Full name must not exceed 30 characters.",
  }).optional(),
  email: z.string().email().optional(),
});

export default function UpdateProfileForm() {
  const { sessionUser } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [updatingUser, setUpdatingUser] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
    },
  });

  // Handle image preview
  const handleImageChange = useCallback((file: File | undefined) => {
    if (!file) return;

    // Validate image file
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please upload a valid image type (JPEG, JPG, PNG, WEBP)");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);
    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);

    // Clean up function
    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, []);

  // Set initial values and preview
  useEffect(() => {
    if (sessionUser) {
      form.reset({
        full_name: sessionUser.name || "",
        email: sessionUser.email || "",
      });
      
      if (sessionUser.image) {
        setPreviewUrl(sessionUser.image);
      }
    }
  }, [sessionUser, form]);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setUpdatingUser(true);
      let imageURL = sessionUser?.image || "";

      if (imageFile) {
        const uploadToast = toast.loading("Uploading image...");
        try {
          imageURL = await imageUpload(imageFile);
          toast.success("Image uploaded successfully", { id: uploadToast });
        } catch (error) {
          toast.error("Failed to upload image", { id: uploadToast });
          throw error;
        }
      }

      const payload = {
        ...values,
        image: imageURL,
      };

      const updateToast = toast.loading("Updating profile...");
      const { data } = await axios.patch(
        "/api/profile/update-user-info",
        payload
      );

      if (data.success) {
        toast.success(data.message, { id: updateToast });
        const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
        modal?.close();
        // Refresh user data if needed
      } else {
        toast.error(data.message, { id: updateToast });
      }
    } catch (error) {
      console.error("Problem in updating profile", error);
      toast.error("Failed to update profile");
    } finally {
      setUpdatingUser(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10 flex flex-col"
      >
        {/* Image upload with preview */}
        <FormItem>
          <FormLabel>Profile Image</FormLabel>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-pink-300 mb-3">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 128px) 100vw"
                  onLoad={() => {
                    if (previewUrl.startsWith("blob:")) {
                      URL.revokeObjectURL(previewUrl);
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>
            
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e.target.files?.[0])}
                className="cursor-pointer"
              />
            </FormControl>
          </div>
          <FormDescription>
            {imageFile
              ? imageFile.name
              : sessionUser?.image?.split("/").pop() || "No image selected"}
          </FormDescription>
          <FormMessage />
        </FormItem>

        {/* Full Name */}
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your full name" 
                  type="text" 
                  {...field} 
                  disabled={updatingUser}
                />
              </FormControl>
              <FormDescription>
                This will be your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email (Disabled) */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="your@email.com"
                  type="email"
                  {...field}
                  disabled
                  className="disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </FormControl>
              <FormDescription className="text-pink-400">
                Email cannot be changed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-pink-400 hover:bg-pink-500 text-white"
          disabled={updatingUser}
        >
          {updatingUser ? (
            <>
              <span className="loading loading-spinner"></span>
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>
    </Form>
  );
}