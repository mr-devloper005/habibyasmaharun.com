"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NavbarShell } from "@/components/shared/navbar-shell"
import { Footer } from "@/components/shared/footer"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F3F0FF_0%,#ffffff_55%)] text-[#1a1a1a]">
      <NavbarShell />
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-[2rem] border border-[#e9e0ff] bg-white p-8 shadow-[0_24px_64px_rgba(107,33,168,0.08)]"
      >
        <Link
          href="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#5b5568] hover:text-[#1a1a1a]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        {!isSubmitted ? (
          <>
            <h1 className="mb-2 text-3xl font-bold text-[#1a1a1a]">
              Reset your password
            </h1>
            <p className="mb-8 text-[#5b5568]">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full rounded-full bg-gradient-to-r from-[#A163F7] to-[#EE73B1] text-white hover:opacity-95" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-[#1a1a1a]">
              Check your email
            </h1>
            <p className="mb-8 text-[#5b5568]">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Button asChild variant="outline" className="w-full rounded-full border-[#e9e0ff]">
              <Link href="/login">Back to login</Link>
            </Button>
            <p className="mt-6 text-sm text-[#5b5568]">
              Didn't receive the email?{" "}
              <button
                onClick={() => setIsSubmitted(false)}
                className="font-semibold text-[#A163F7] hover:underline"
              >
                Try again
              </button>
            </p>
          </motion.div>
        )}
      </motion.div>
      </div>
      <Footer />
    </div>
  )
}
