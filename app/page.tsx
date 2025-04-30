"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, MessageSquare, Users, LinkIcon, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col ">
      <header className="border-b bg-background/80 backdrop-blur-sm fixed w-full z-10">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="relative h-8 w-8">
              <Image src="/logo-connectMe.png" alt="ConnectMe Logo" fill className="object-contain rounded-full"  />
            </div>
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
              ConnectMe
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="rounded-full px-4">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="rounded-full px-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 pt-16">
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-indigo-500/20 -z-10"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl"></div>

          <div className="container px-4 md:px-6 relative ">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
                    Your Personal Connection Platform
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Connect with others, share your profiles, and chat in one simple platform. Perfect for networking
                    and staying in touch.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="gap-1.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600"
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="rounded-full">
                      Login
                    </Button>
                  </Link>
                </div>
              </motion.div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="grid grid-cols-2 gap-4 md:gap-8">
                  <motion.div
                    className="flex flex-col items-center gap-2 rounded-lg bg-white/10 backdrop-blur-sm p-4 md:p-6 border border-white/20 shadow-lg"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Users className="h-10 w-10 text-pink-500" />
                    <h3 className="text-xl font-bold">User Profiles</h3>
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      Create and customize your profile with social links
                    </p>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center gap-2 rounded-lg bg-white/10 backdrop-blur-sm p-4 md:p-6 border border-white/20 shadow-lg"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <MessageSquare className="h-10 w-10 text-purple-500" />
                    <h3 className="text-xl font-bold">Real-Time Chat</h3>
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      Connect and chat with other users instantly
                    </p>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center gap-2 rounded-lg bg-white/10 backdrop-blur-sm p-4 md:p-6 border border-white/20 shadow-lg"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <LinkIcon className="h-10 w-10 text-indigo-500" />
                    <h3 className="text-xl font-bold">Social Links</h3>
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      Integrate your external social profiles
                    </p>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center gap-2 rounded-lg bg-white/10 backdrop-blur-sm p-4 md:p-6 border border-white/20 shadow-lg"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Sparkles className="h-10 w-10 text-pink-500" />
                    <h3 className="text-xl font-bold">Admin Controls</h3>
                    <p className="text-center text-gray-500 dark:text-gray-400">Manage users and monitor activity</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="mx-auto mt-4 max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Connect, chat, and collaborate in three simple steps
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              <motion.div
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold">Create Your Profile</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Sign up and customize your profile with your information and social links
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold">Connect With Others</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Browse profiles and connect with other users on the platform
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold">Chat in Real-Time</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Engage in real-time conversations with users and admins
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8 bg-background/80 backdrop-blur-sm">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <Image src="/logo-connectMe.png" alt="ConnectMe Logo" fill className="object-contain rounded-full" />
            </div>
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text font-bold">
              ConnectMe
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/footer" className="hover:underline hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/footer" className="hover:underline hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/footer" className="hover:underline hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/footer" className="hover:underline hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} ConnectMe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
