import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Form from "@/components/form";
import { updateEvent } from "@/lib/actions";

export default async function CheckoutPage({
  params,
}: {
  params: { path: string; subdomain: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const cart = []; // Replace this with your actual cart state

  const handleCheckout = async (formData: any) => {
    // Handle checkout logic here
  };

  return (
    <div className="flex flex-col space-y-6">

      <button onClick={handleCheckout}>Proceed to Checkout</button>
    </div>
  );
}