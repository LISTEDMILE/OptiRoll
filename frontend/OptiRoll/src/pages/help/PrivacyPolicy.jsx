import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function PrivacyPolicy() {
  const headingRef = useRef(null);
  const sectionRefs = useRef([]);

  useGSAP(() => {
    // Animate main heading
    gsap.from(headingRef.current, {
      y: -40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // Animate each section
    sectionRefs.current.forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: "sine.out",
      });
    });
  }, []);

  const sections = [
    {
      title: "1. Information We Collect",
      content:
        "We collect personal information such as your name, email, and organization details when you sign up. We may also collect usage data like login history, device information, and browsing activity for security and analytics purposes.",
    },
    {
      title: "2. How We Use Your Information",
      content:
        "Your data helps us deliver services, personalize your experience, improve our platform, and communicate with you about updates or support.",
    },
    {
      title: "3. Data Security",
      content:
        "We implement strict technical and organizational measures to protect your personal information from unauthorized access, loss, or misuse.",
    },
    {
      title: "4. Sharing of Data",
      content:
        "We do not sell or rent your personal information. Data may only be shared with trusted partners to help us provide services, subject to confidentiality agreements.",
    },
    {
      title: "5. Your Rights",
      content:
        "You can request access, correction, or deletion of your data. You may also opt-out of marketing emails anytime.",
    },
    {
      title: "6. Updates to Privacy Policy",
      content:
        "We may update this Privacy Policy periodically. Continued use of our services after updates implies agreement with the revised policy.",
    },
    {
      title: "7. Contact Us",
      content:
        "If you have any questions regarding this Privacy Policy, please contact our support team via email or through the contact page.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-indigo-50 text-gray-900">
      {/* Hero */}
      <section className="py-20 text-center px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <h1
          ref={headingRef}
          className="text-5xl md:text-6xl font-extrabold mb-6"
        >
          Privacy Policy
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
          Your privacy is important to us. This policy explains how we collect,
          use, and protect your information.
        </p>
      </section>

      {/* Sections */}
      <section className="px-6 max-w-4xl mx-auto py-20 space-y-12">
        {sections.map((sec, i) => (
          <div
            key={i}
            ref={(el) => (sectionRefs.current[i] = el)}
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition"
          >
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
              {sec.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">{sec.content}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
