"use client";

import AddcakeForm from "@/components/Form/AddCakeForm";
import useAuth from "@/hooks/useAuth";
import { imageUpload } from "@/lib/imageUpload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const Addcake = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { sessionUser } = useAuth();
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image (REQUIRED)");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const name = form.name.value;
    const description = form.description.value;
    const category = form.category.value;
    const price = parseFloat(form.price.value);
    const quantity = parseInt(form.quantity.value);
    const image = form.image.files[0];
    const addDiscount = form.addDiscount.checked;
    const discountPrice = addDiscount ? parseFloat(form.discountPrice.value) : null;
    const imageUrl = await imageUpload(image);

    const seller = {
      name: sessionUser?.name,
      image: sessionUser?.image,
      email: sessionUser?.email,
    };

    const cakeData: any = {
      name,
      description,
      category,
      price,
      quantity,
      image: imageUrl,
      seller,
    };

    if (addDiscount && discountPrice) {
      cakeData.discount = {
        isDiscounted: true,
        discountPrice,
      };
    }

    try {
      const data = await axios.post("/api/dashboard/seller/add-cake", cakeData);
      if (data.status === 200) {
        toast.success("Cake Added Successfully!");
        router.push("/dashboard/seller/my-inventory");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <AddcakeForm
        handleSubmit={handleSubmit}
        uploadButtonText={uploadButtonText}
        setUploadButtonText={setUploadButtonText}
        loading={loading}
      />
    </div>
  );
};

export default Addcake;

