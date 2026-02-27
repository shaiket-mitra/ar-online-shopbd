import axios from "axios";
import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";

interface Slide {
  _id: string;
  imgSrc: string;
  productLink: string;
}

export const AuthContext = createContext<any>(null);

export default function AuthProvider({ children }: any) {
  const { data } = useSession();
  const sessionUser = data?.user;
  const [loading, setLoading] = useState(true);
  const [sliderData, setSliderData] = useState<Slide[]>([]);
  // Fetch slider data
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const { data } = await axios.get("/api/sliders/read");
        if (data.success && Array.isArray(data.sliders)) {
          setSliderData(data.sliders);
        }
      } catch (error) {
        console.error("Error fetching sliders:", error);
      }
    };
    fetchSliders();
  }, []);

  const authInfo: any = {
    sessionUser,
    loading,
    setLoading,
    sliderData,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}
