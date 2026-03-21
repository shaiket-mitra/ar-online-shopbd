import axios from "axios";
import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";

interface Slide {
  _id: string;
  imgSrc: string;
  productLink: string;
}

interface AuthContextType {
  sessionUser: any;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  sliderData: Slide[] | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useSession();
  const sessionUser = data?.user;

  const [loading, setLoading] = useState(true);
  const [sliderData, setSliderData] = useState<Slide[] | null>(null);

  useEffect(() => {
    const fetchSliders = async () => {
      setLoading(true);

      try {
        const res = await axios.get("/api/sliders/read");

        if (res.data?.success && Array.isArray(res.data.sliders)) {
          setSliderData(res.data.sliders);
        } else {
          setSliderData([]);
        }
      } catch (error) {
        console.error("Error fetching sliders:", error);
        setSliderData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  const authInfo: AuthContextType = {
    sessionUser,
    loading,
    setLoading,
    sliderData,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}