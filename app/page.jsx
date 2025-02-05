"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArrowRight, Target, BookOpen, CheckCircle } from "lucide-react";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-700">AI Interview Mocker</h1>
          </div>
          <div className="flex space-x-4">
            {!isSignedIn ? (
              <>
                <SignUpButton mode="modal">
                  <Button variant="outline" className="text-blue-700 hover:bg-blue-50">Sign Up</Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button className="bg-blue-700 hover:bg-blue-800">Sign In</Button>
                </SignInButton>
              </>
            ) : (
              <Button 
                onClick={() => router.push("/dashboard")}
                className="bg-blue-700 hover:bg-blue-800"
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 py-16 text-center"
      >
        <h1 className="text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
          Master Your Interview Skills with AI
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Experience hyper-realistic mock interviews powered by AI. Get personalized feedback, 
          improve your communication, and boost your confidence for your dream job.
        </p>
        <div className="flex justify-center space-x-4">
          <SignUpButton mode="modal">
            <Button size="lg" className="px-8 bg-blue-700 hover:bg-blue-800 group">
              Start Your Interview Journey 
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </SignUpButton>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        {/* Realistic Interview Experience */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="h-full border-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <BookOpen className="mr-3 text-blue-600" /> Realistic Mock Interviews
              </CardTitle>
              <CardDescription>
                Experience AI-powered interviews that simulate real-world scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <CheckCircle className="text-green-500" />
                  <span>Context-aware AI-generated questions</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <CheckCircle className="text-green-500" />
                  <span>Personalized industry-specific scenarios</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <CheckCircle className="text-green-500" />
                  <span>Comprehensive performance analysis</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Job Description Optimization */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="h-full border-green-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <Target className="mr-3 text-green-600" /> Job Description Optimization
              </CardTitle>
              <CardDescription>
                Tailor your interview performance to specific job requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <CheckCircle className="text-green-500" />
                  <span>Upload and analyze job descriptions</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <CheckCircle className="text-green-500" />
                  <span>Targeted interview preparation</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <CheckCircle className="text-green-500" />
                  <span>Align with employer expectations</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}