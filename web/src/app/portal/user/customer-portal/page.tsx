import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function CustomerPortalPage() {
  return (
    <div className="flex  justify-center absolute h-fit">
      <div className="bg-[#082923]">
        {/* <img src="./customer-portal-image.png" alt="cust-image" /> */}
        <Image
          src={"/images/customer-portal-image.png"}
          alt="cust-image"
          width={400}
          height={400}
        />
        <h1>Upgrade your plan to unlock</h1>
        <h1>Customer Portal!</h1>
        <h1>
          It looks like you've discovered a feature that’s not included in your
          current plan. Upgrade now for instant access to our support team,
          exclusive resources, and helpful guides.
        </h1>
      </div>
      <div className="text-center font-semibold content-center items-center">
        <h1 className="font-bold text-2xl">
          With customer portal, Sertifier users can:
        </h1>
        <Image
          src={"/images/customer-portal-images/1.png"}
          alt="1"
          width={100}
          height={100}
        ></Image>
        <h1>
          Connect with our Customer Success team instantly for a smooth and
          seamless credentialing experience,
        </h1>
        <Image
          src={"/images/customer-portal-images/2.png"}
          alt="2"
          width={100}
          height={100}
        ></Image>
        <h1>
          Access exclusive resources & guides to get the most out of your
          credentials,
        </h1>
        <Image
          src={"/images/customer-portal-images/3.png"}
          alt="3"
          width={100}
          height={100}
        ></Image>
        <h1>
          Explore our feature roadmap and make requests help shape the future of
          credentialing — together.
        </h1>
        <Button className="bg-orange-500 text-white font-bold">Upgrade</Button>
      </div>
    </div>
  );
}
