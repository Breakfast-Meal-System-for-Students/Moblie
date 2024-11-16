'use client';
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const PageContent = () => {
  const searchParams = useSearchParams();
  const shopId = searchParams.get('shopId');
  const cardId = searchParams.get('cardId');
  const accessToken = searchParams.get('accessToken');

  const handleOpenApp = () => {
    if (shopId) {
      const result = confirm("Open BMS App in your device?");
      if (result) {
        const appLink = `stickersmash://Shop/${shopId}?cardId=${cardId}&accessToken=${accessToken}`;
        const playStoreLink = "https://play.google.com/store/apps/details?id=com.xuanthu.bmsv2&hl=en-US&ah=8Np4znPlTOddZfhCWlz5Oa420Ng";
        window.location.href = appLink;
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
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}