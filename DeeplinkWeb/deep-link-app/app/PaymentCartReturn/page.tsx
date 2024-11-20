'use client';
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

function PageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const shopId = searchParams.get('shopId');
  const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
  const [isSuccess, setIsSuccess] = React.useState(true);

  React.useEffect(() => {
    const fetchApiBuyPayement = async () => {
      if (!orderId || !vnp_ResponseCode) {
        setIsSuccess(false);
        return;
      }
      if (vnp_ResponseCode == "00") {
        setTimeout(() => {
          handleOpenApp();
        }, 2000); // 2 seconds delay
      } else {
        setIsSuccess(false);
      }
    }
    fetchApiBuyPayement();
  }, [orderId, vnp_ResponseCode]);

  const handleOpenApp = () => {
    if (shopId) {
      const appLink = `stickersmash://Shop/${shopId}?orderIdSuccess=${orderId}`;
      const playStoreLink = "https://play.google.com/store/apps/details?id=com.xuanthu.bmsv2&hl=en-US&ah=8Np4znPlTOddZfhCWlz5Oa420Ng";
      window.location.href = appLink;
      setTimeout(() => {
        window.location.href = playStoreLink;
      }, 2000); // 2 seconds delay
    } else {
      alert("Shop ID not found in the URL!");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        {isSuccess && (
          <div>
            <h1 style={{ fontWeight: 'bold' }}>PAYMENT <span style={{ color: 'green' }}>SUCCESSFUL</span></h1>
            <Image src='/Loading_icon.gif' alt='loading' width={500} height={500} style={{ width: 150, height: 'auto', border: 'none', marginBlock: 10 }} />
            <p style={{ color: 'gray' }}>You will be redirected to the homepage in a few seconds...</p>
          </div>
        ) || (
            <div style={{ fontWeight: 'bold' }}>
              <h1>PAYMENT <span style={{ color: 'red' }}>FAILED</span></h1>
              <Image src='/Loading_icon.gif' alt='loading' width={500} height={500} style={{ width: 150, height: 'auto', border: 'none', marginBlock: 10 }} />
              <p style={{ color: 'gray' }}>An error occurred during the payment process.</p>
            </div>
          )}
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