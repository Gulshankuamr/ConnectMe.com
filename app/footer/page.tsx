"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { Mail, Github, Twitter, Instagram, Heart, Shield, FileText, HelpCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function FooterPage() {
  return (
    <DashboardLayout>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">About ConnectMe</h1>
            <p className="text-muted-foreground">Information about our platform and policies</p>
          </div>
        </div>

        <Card className="border border-white/20 shadow-lg backdrop-blur-sm bg-white/50 dark:bg-gray-950/50">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
              Our Mission
            </CardTitle>
            <CardDescription>Connecting people in a simple and meaningful way</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative h-32 w-32 flex-shrink-0">
                <Image src="/logo-connectMe.png" alt="ConnectMe Logo" fill className="object-contain rounded-full" />
              </div>
              <div>
                <p className="mb-4">
                  ConnectMe is a personal social connection platform designed to help people build meaningful
                  relationships in a simple, distraction-free environment. Our focus is on quality conversations and
                  genuine connections rather than endless scrolling and content consumption.
                </p>
                <p>
                  We believe that technology should bring people closer together, not further apart. That's why we've
                  built ConnectMe with privacy, simplicity, and meaningful interaction at its core.
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-pink-500" />
                  Privacy & Security
                </h3>
                <p className="text-muted-foreground">
                  Your privacy is important to us. We don't sell your data or use it for advertising. All conversations
                  on ConnectMe are private between you and your connections. We implement industry-standard security
                  measures to protect your information.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  Terms of Service
                </h3>
                <p className="text-muted-foreground">
                  By using ConnectMe, you agree to our Terms of Service. We expect all users to be respectful and
                  considerate. Any form of harassment, hate speech, or illegal activity will result in immediate account
                  termination.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-indigo-500" />
                  Support
                </h3>
                <p className="text-muted-foreground">
                  Need help with ConnectMe? Our support team is here to assist you. Please reach out to us via email,
                  and we'll get back to you as soon as possible.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  Community Guidelines
                </h3>
                <p className="text-muted-foreground">
                  ConnectMe is built on respect, kindness, and authentic connections. We encourage meaningful
                  conversations and genuine relationships. Please be respectful of others' boundaries and privacy.
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Contact Us</h3>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="mailto:gulshan73939314@email.com"
                  className="flex items-center gap-2 rounded-full bg-white/70 dark:bg-gray-900/70 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Mail className="h-4 w-4" />
                  <span>gulshan73939314@email.com</span>
                </Link>

                <Link
                  href="https://github.com/Gulshankuamr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-white/70 dark:bg-gray-900/70 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </Link>

                <Link
                  href="http://linkedin.com/in/gulshan-kumar-61b446253"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-white/70 dark:bg-gray-900/70 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5V24H0V8zm7.5 0h4.7v2.1h.1c.7-1.3 2.5-2.6 5.1-2.6 5.5 0 6.5 3.6 6.5 8.3V24h-5V14c0-2.4-.1-5.5-3.3-5.5-3.3 0-3.8 2.5-3.8 5.3V24h-5V8z" />
                  </svg>
                  <span>LinkedIn</span>
                </Link>

                <Link
                  href="https://www.instagram.com/developer_tipss?igsh=ZjQ1M2ZvZXhhcno2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-white/70 dark:bg-gray-900/70 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Instagram className="h-4 w-4" />
                  <span>Instagram</span>
                </Link>
              </div>
            </div>

            <Separator />

            <div className="text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} ConnectMe. All rights reserved.</p>
              <p className="mt-1">
                Made with{" "}
                <span className="inline-block animate-pulse text-pink-500">
                  <Heart className="h-4 w-4 inline" />
                </span>{" "}
                by the GulshanX.Dev && ConnectMe Team 
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  )
}

