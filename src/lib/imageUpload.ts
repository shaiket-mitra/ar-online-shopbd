import axios from "axios";

export async function imageUpload(imageData: File) {
  if (!imageData) {
    return "Please select an image";
  }

  const data = new FormData();
  data.append("file", imageData);
  data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string);
  data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string);
  data.append("folder", "mitra-mart");

  try {
    const res = await axios.post(process.env.NEXT_PUBLIC_CLOUDINARY_API_URL as string, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    return res.data.secure_url;

  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}


// export async function imageUpload(imageData: File) {
//     const formData = new FormData();
//     formData.append("image", imageData);
//     const { data } = await axios.post(
//       `https://api.imgbb.com/1/upload?key=${
//         process.env.NEXT_PUBLIC_IMGBB_API_KEY
//       }`,
//       formData
//     );
//     return data.data.display_url;
// }