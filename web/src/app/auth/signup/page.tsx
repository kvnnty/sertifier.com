"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function SignupPage() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left: Signup Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-24 lg:px-32 bg-white">
        <h1 className="text-3xl md:text-4xl font-serif mb-8 text-gray-900">
          Sign up for the Leading Digital Credentialing Platform
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid w-full gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
              required
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="py-6 focus:outline-none outline-none border border-gray-300"
                {...form.register("name", { required: true })}
              />
            </div>
            <div className="grid w-full gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
              required
                id="email"
                type="email"
                placeholder="Enter your work email address"
                className="py-6 focus:outline-none outline-none border border-gray-300"
                {...form.register("email", { required: true })}
              />
            </div>
            <div className="grid w-full gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
              required
                id="password"
                type="password"
                placeholder="Create a password"
                className="py-6 focus:outline-none outline-none border border-gray-300"
                {...form.register("password", { required: true })}
              />
            </div>
            <Button
              type="submit"
              className="hover:cursor-pointer w-full py-6 text-lg font-medium bg-green-900 hover:bg-green-800"
            >
              Sign Up
            </Button>
          </form>
        </Form>
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="mx-4 text-gray-500">Or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <Button
          variant="outline"
          className="flex items-center justify-center gap-6 hover:cursor-pointer w-full border border-gray-300 rounded py-5 text-lg font-medium hover:bg-gray-50 transition"
        >
          <Image src="/icons/google.svg" alt="Google" width={24} height={24} />
          Sign up with Google
        </Button>
        <div className="mt-6 text-center text-gray-700">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-green-900 font-medium hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* Right: Logos and Testimonial */}
      <div className="hidden lg:flex flex-col justify-center items-center flex-1 bg-green-900 relative">
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8 w-[32rem] max-w-full">
          <div className="h-[300px]">
            <Image
              src="/images/companies.png"
              alt="companies"
              width={1000}
              height={1000}
            />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-white rounded-xl px-8 py-4 shadow-lg flex items-center text-2xl font-serif">
            <span className="text-green-900 mr-2">You are in</span>
            <span className="bg-green-200 text-green-900 px-2 rounded">
              good company
            </span>
            <span className="text-green-900 ml-2">.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
