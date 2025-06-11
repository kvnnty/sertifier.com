"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4 text-center">
      <div className="max-w-3xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              Sertifier
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-gray-600 md:text-xl">
            Create, manage, and distribute digital certificates and badges with ease.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
          <Button asChild className="group bg-green-700 px-6 py-6 text-lg hover:bg-green-800">
            <Link href="/auth/login">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="px-6 py-6 text-lg">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>

        <div className="mt-10 flex justify-center space-x-6">
          <div className="rounded-lg bg-white p-4 shadow-md">
            <div className="text-3xl font-bold text-green-700">10K+</div>
            <div className="text-sm text-gray-500">Certificates Issued</div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-md">
            <div className="text-3xl font-bold text-green-700">5K+</div>
            <div className="text-sm text-gray-500">Organizations</div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-md">
            <div className="text-3xl font-bold text-green-700">50+</div>
            <div className="text-sm text-gray-500">Countries</div>
          </div>
        </div>
      </div>
    </div>
  )
}
