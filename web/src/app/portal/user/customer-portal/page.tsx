import { Button } from "@/components/ui/button";
import Image from "next/image";

type FeatureItemProps = {
  src: string;
  alt: string;
  boldText: string;
  normalText: string;
};

const FeatureItem = ({ src, alt, boldText, normalText }: FeatureItemProps) => (
  <div className="flex flex-col items-center text-center mb-6">
    <Image src={src} alt={alt} width={50} height={50} />
    <p className="mt-4 text-xl">
      <span className="font-bold">{boldText}</span> {normalText}
    </p>
  </div>
);

export default function CustomerPortalPage() {
  return (
    <div className="flex justify-center items-center min-h-[85vh] font-global">
      <div className="flex w-full h-[91vh]">
        <div className="w-1/2 bg-[#082923] text-white p-12 flex flex-col justify-center items-center">
          <Image
            src="/images/customer-portal-image.png"
            alt="cust-image"
            width={300}
            height={300}
            className="mb-6"
          />
          <h1 className="text-3xl font-bold mb-2">
            Upgrade your plan to unlock
          </h1>
          <h1 className="text-3xl font-bold mb-4 text-[#80F0A3]">
            Customer Portal!
          </h1>
          <p className="text-center text-xl">
            It looks like you’ve discovered a feature that’s not included in
            your current plan. Upgrade now for instant access to our support
            team, exclusive resources, and helpful guides.
          </p>
        </div>
        <div className="w-1/2 p-12 flex flex-col justify-center items-center">
          <h1 className="font-bold text-2xl mb-6 text-gray-800">
            <span className="bg-[#B4ECC5]">With customer portal</span>,
            Sertifier users can:
          </h1>
          <FeatureItem
            src="/images/customer-portal-images/1.png"
            alt="chat"
            boldText={"Connect with our Customer Success team instantly"}
            normalText="for a smooth and seamless credentialing experience,"
          />
          <FeatureItem
            src="/images/customer-portal-images/2.png"
            alt="resources"
            boldText={"Access exclusive resources & guides"}
            normalText="to get the most out of your credentials,"
          />
          <FeatureItem
            src="/images/customer-portal-images/3.png"
            alt="roadmap"
            boldText={"Explore our feature roadmap and make requests"}
            normalText="help shape the future of credentialing — together."
          />
          <Button className="mt-6 bg-orange-500 text-white font-bold py-7 px-16 text-xl rounded">
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );
}
