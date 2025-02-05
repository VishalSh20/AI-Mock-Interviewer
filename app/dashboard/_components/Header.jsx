"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Questions", href: "/questions" },
];

function Header() {
  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <header className="w-full px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-400 shadow-md flex items-center justify-between">
      {/* Logo / Branding */}
      <motion.h1
        className="text-2xl font-bold text-white tracking-wide"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        AI Mock Interviewer
      </motion.h1>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-8">
        {navItems.map((item) => (
          <motion.a
            key={item.href}
            href={item.href}
            className={cn(
              "text-white text-lg font-medium transition duration-300 hover:text-yellow-300 hover:underline",
              path === item.href ? "text-yellow-300 font-semibold underline" : ""
            )}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {item.name}
          </motion.a>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="text-white w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-white">
            <div className="flex flex-col gap-6 mt-6">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-gray-800 text-lg font-medium transition duration-300 hover:text-purple-600 hover:underline",
                    path === item.href ? "text-purple-600 font-semibold underline" : ""
                  )}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* User Button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <UserButton afterSignOutUrl="/" />
      </motion.div>
    </header>
  );
}

export default Header;
