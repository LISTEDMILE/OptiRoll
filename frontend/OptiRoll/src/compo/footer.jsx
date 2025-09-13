import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">AutoAttend</h2>
          <p className="text-gray-400 text-sm">
            Simplifying attendance with AI-powered, real-time tracking for schools and organizations.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/features" className="hover:text-white transition">Features</Link></li>
            <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/docs" className="hover:text-white transition">Documentation</Link></li>
            <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
            <li><Link to="/support" className="hover:text-white transition">Support</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-indigo-600 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-indigo-600 transition">
              <FaTwitter />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-indigo-600 transition">
              <FaLinkedinIn />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-indigo-600 transition">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        {new Date().getFullYear()} OptiRoll. 
      </div>
    </footer>
  );
}
