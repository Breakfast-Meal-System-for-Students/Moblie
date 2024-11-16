'use client';
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const shopId = searchParams.get('shopId');

  const handleOpenApp = () => {
    if (shopId) {
      const result = confirm("Open BMS App in your device?");
      if (result) {
         // Try to open the deep link for the app
         const appLink = `stickersmash://Shop/${shopId}`;
         const playStoreLink = "https://play.google.com/store/apps/details?id=com.xuanthu.bmsv2&hl=en-US&ah=8Np4znPlTOddZfhCWlz5Oa420Ng";
 
         // Open the deep link
         window.location.href = appLink;
 
         // Redirect to the Play Store after a delay (if the app isn't installed)
         setTimeout(() => {
           window.location.href = playStoreLink;
         }, 2000); // 2 seconds delay
      }
    } else {
      alert("Shop ID not found in the URL!");
    }
  };

  React.useEffect(() => {
    handleOpenApp();
  }, []);

  return (
    <div className="d-flex justify-content-center mt-5">
      <div>
        <h1 className="text-center">WELCOME TO DEEPLINK SERVICE!</h1>
        <Image src={"/LOGO.png"} alt="home page" width={500} height={500} style={{ width: '100%', height: 'auto' }} />
      </div>
    </div>
  );
}