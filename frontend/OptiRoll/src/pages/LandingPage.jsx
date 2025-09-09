import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const heroRef = useRef(null);
  const featureRefs = useRef([]);

  const features = [
    {
      title: "Automated Attendance",
      description:
        "Our system uses AI and facial recognition to automatically mark attendance, saving time and reducing manual errors.",
    },
    {
      title: "Real-Time Dashboard",
      description:
        "Track attendance in real-time with detailed insights and reporting tools for administrators.",
    },
    {
      title: "Seamless Integration",
      description:
        "Easily integrate with your existing systems, ensuring a smooth adoption process.",
    },
  ];

  // useEffect(() => {
  //   gsap.from(heroRef.current, { opacity: 0, y: -50, duration: 1 });
  //   gsap.from(featureRefs.current, {
  //     opacity: 0,
  //     y: 50,
  //     duration: 0.8,
  //     stagger: 0.3,
  //   });
  // }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="text-center py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white"
      >
        <h1 className="text-5xl font-bold mb-4">Automatic Attendance System</h1>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Revolutionize attendance management with our AI-powered, real-time
          platform.
        </p>
        <Link
          to="/auth/signup"
          className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (featureRefs.current[index] = el)}
              className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Automate Attendance?
        </h2>
        <p className="mb-6 max-w-xl mx-auto">
          Start saving time and increasing accuracy today with our simple and
          efficient solution.
        </p>
        <Link
          to="/auth/signup"
          className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Sign Up Now
        </Link>
      </section>
    </div>
  );
}
