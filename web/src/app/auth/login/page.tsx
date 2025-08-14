"use client";

import Spinner from "@/components/loaders/Spinner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosClient from "@/config/axios.config";
import { useAuthModal } from "@/context/AuthModalContext";
import { BASE_API_URL } from "@/lib/api/urls";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { openAuthModal } = useAuthModal();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await axiosClient.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      toast.success("Verification required!", {
        description: response.data.message,
      });

      openAuthModal("login_verification", { email: data.email });
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred during login";
      toast.error("Sorry, we couldn't sign you in", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-24 lg:px-32 bg-white">
        <h1 className="text-3xl md:text-4xl font-serif mb-8 text-gray-900">Login to the Leading Digital Credentialing Platform</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Email address</Label>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your work email address"
                      className="py-6 focus:outline-none outline-none border border-gray-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="password">Password</Label>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="py-6 focus:outline-none outline-none border border-gray-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end my-4">
              <button type="button" onClick={() => openAuthModal("forgot_password")} className="cursor-pointer text-primary hover:underline">
                Forgot password?
              </button>
            </div>
            <Button
              type="submit"
              className="hover:cursor-pointer w-full py-6 text-lg font-medium bg-green-900 hover:bg-green-800"
              disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Spinner /> : "Sign In"}
            </Button>
          </form>
        </Form>
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="mx-4 text-gray-500">Or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <Button
          onClick={() => (window.location.href = `${BASE_API_URL}/auth/google`)}
          variant="outline"
          className="flex items-center justify-center gap-6 hover:cursor-pointer w-full border border-gray-300 rounded py-5 text-lg font-medium hover:bg-gray-50 transition">
          <Image src="/icons/google.svg" alt="Google" width={24} height={24} />
          Sign in with Google
        </Button>
        <div className="mt-6 text-center text-gray-700">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-green-900 font-medium hover:underline">
            Sign up
          </Link>
        </div>
      </div>

      {/* Right: Logos and Testimonial */}
      <div className="hidden lg:flex flex-col justify-center items-center flex-1 bg-green-900 relative">
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8 w-[32rem] max-w-full">
          <div className="h-[300px]">
            <Image src="/images/companies.png" alt="companies" width={1000} height={1000} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-white rounded-xl px-8 py-4 shadow-lg flex items-center text-2xl font-serif">
            <span className="text-green-900 mr-2">You are in</span>
            <span className="bg-green-200 text-green-900 px-2 rounded">good company</span>
            <span className="text-green-900 ml-2">.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
