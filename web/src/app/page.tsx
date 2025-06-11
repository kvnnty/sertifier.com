import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Welcome to Sertifier</h1>
      <Link href="/auth/login" className="bg-green-900 text-white px-4 py-2 rounded-md">Get Started</Link>
    </div>
  )
}