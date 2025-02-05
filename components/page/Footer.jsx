import Link from 'next/link';
import { Mail, Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4 border-b border-blue-700 pb-2">
            Contact
          </h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="text-blue-300" />
              <a 
                href="mailto:vishal.sharma14052002@gmail.com" 
                className="hover:text-blue-200 transition-colors"
              >
                vishal.sharma14052002@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4 border-b border-blue-700 pb-2">
            Connect
          </h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Github className="text-blue-300" />
              <Link 
                href="https://github.com/VishalSh20" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-200 transition-colors"
              >
                GitHub Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4 border-b border-blue-700 pb-2">
            Legal
          </h4>
          <div className="space-y-3">
            <p className="text-blue-300 flex items-center">
              © {new Date().getFullYear()} AI Interview Mocker. 
              All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Made with Love Section */}
      <div className="text-center mt-8 pt-6 border-t border-blue-700">
        <p className="text-blue-300 flex justify-center items-center space-x-2">
          <span>Made with</span>
          <Heart className="text-red-400 fill-red-400" size={16} />
          <span>by Vishal Sharma</span>
        </p>
      </div>
    </footer>
  );
}