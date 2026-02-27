"use client";

import Image from "next/image";
import WhatsAppLogo from "@/assets/images/whatsAppLogo.png";
import MessengerLogo from "@/assets/images/messengerLogo.png";

const CustomerSupportLogo = () => {
  const whatsappLink = "https://wa.me/8801917268820";
const messengerLink = "https://www.facebook.com/profile.php?id=61555695895882";

  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-50">
      {/* Messenger */}
      <a
        href={messengerLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 flex items-center justify-center bg-[#0084FF] rounded-full shadow-lg hover:scale-110 transition-all duration-200"
      >
        <Image src={MessengerLogo} alt="Messenger" width={42} height={42} />
      </a>

      {/* WhatsApp */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 flex items-center justify-center bg-[#25D366] rounded-full shadow-lg hover:scale-110 transition-all duration-200"
      >
        <Image src={WhatsAppLogo} alt="WhatsApp" width={42} height={42} />
      </a>
    </div>
  );
};

export default CustomerSupportLogo;
