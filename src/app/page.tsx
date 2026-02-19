import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { HowItWorks } from "@/components/HowItWorks";
import { Privacy } from "@/components/Privacy";
import { Pricing } from "@/components/Pricing";
import { Payment } from "@/components/Payment";
import { OrderForm } from "@/components/OrderForm";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustBar />
      <HowItWorks />
      <Privacy />
      <Pricing />
      <Payment />
      <OrderForm />
      <FAQ />
      <Footer />
    </>
  );
}
