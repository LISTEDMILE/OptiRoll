import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function DocumentationPage() {
  const headingRef = useRef(null);
  const sectionRefs = useRef([]);

  const docs = [
    {
      title: "Getting Started",
      content:
        "Learn how to install and set up AutoAttend quickly. Includes requirements, installation steps, and first run guide.",
    },
    {
      title: "Features Overview",
      content:
        "Explore core features like attendance tracking, reporting, analytics, and integrations.",
    },
    {
      title: "API Reference",
      content:
        "Detailed API documentation with endpoints, parameters, and example responses for developers.",
    },
    {
      title: "FAQ",
      content:
        "Answers to common questions about AutoAttend’s setup, usage, and troubleshooting.",
    },
    {
      title: "Support",
      content:
        "Need help? Learn how to contact our support team, file a bug report, or request new features.",
    },
  ];

  useGSAP(() => {
    // Animate heading
    gsap.from(headingRef.current, {
      y: -40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // Animate docs sections on scroll
    sectionRefs.current.forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "sine.out",
        delay: i * 0.1,
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      {/* Heading */}
      <section className="py-24 text-center">
        <h1
          ref={headingRef}
          className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent"
        >
          Documentation
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Everything you need to know about using AutoAttend, from setup to
          advanced features.
        </p>
      </section>

      {/* Docs Sections */}
      <section className="px-6 max-w-5xl mx-auto space-y-12 pb-24">
        {docs.map((doc, i) => (
          <div
            key={i}
            ref={(el) => (sectionRefs.current[i] = el)}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition transform hover:-translate-y-2"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-indigo-700">
              {doc.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">{doc.content}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
