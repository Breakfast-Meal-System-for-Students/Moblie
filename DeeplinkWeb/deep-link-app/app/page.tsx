import Image from "next/image";

export default function Home() {
  return (
    <div className="d-flex justify-content-center mt-5">
      <div>
        <h1 className="text-center">HOME PAGE</h1>
        <Image src={"/LOGO.png"} alt="home page" width={500} height={500} style={{width:'100%', height: 'auto' }} />
      </div>
    </div>
  );
}
