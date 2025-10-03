import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesPage() {
  const featureRefs = useRef([]);
  const headingRef = useRef(null);

  const features = [
    {
      title: "Automated Attendance",
      description:
        "AI-powered facial recognition marks attendance instantly, reducing manual work.",
      icon: "🤖",
    },
    {
      title: "Real-Time Dashboard",
      description:
        "Track attendance trends in real-time with advanced analytics and insights.",
      icon: "📊",
    },
    {
      title: "Seamless Integration",
      description:
        "Easily integrate into your existing systems with minimal effort.",
      icon: "🔗",
    },
    {
      title: "Cloud-Based & Secure",
      description:
        "Enterprise-grade encryption and scalability to handle large organizations.",
      icon: "☁️",
    },
    {
      title: "Mobile Friendly",
      description:
        "Access attendance data from anywhere with our fully responsive design.",
      icon: "📱",
    },
    {
      title: "Custom Reports",
      description:
        "Export detailed reports tailored to your organization’s needs.",
      icon: "📑",
    },
  ];

  useGSAP(() => {
    // Heading animation
    gsap.from(headingRef.current, {
      y: -60,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    });

    // Animate each card with ScrollTrigger
    featureRefs.current.forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        y: 80,
        opacity: 0,
        duration: 0.8,
        ease: "sine.out",
        delay: i * 0.1,
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-gray-900">
      {/* Page Heading */}
      <section className="py-24 text-center">
        <h1
          ref={headingRef}
          className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent"
        >
          Powerful Features
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Explore the tools that make OptiRoll the best solution for smart
          attendance tracking.
        </p>
      </section>

      {/* Features Grid */}
      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div
              key={i}
              ref={(el) => (featureRefs.current[i] = el)}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-2xl font-semibold mb-3 text-indigo-700">
                {f.title}
              </h3>
              <p className="text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
