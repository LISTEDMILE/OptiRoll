import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function SupportPage() {
  const heroRef = useRef(null);
  const cardRefs = useRef([]);
  const formRef = useRef(null);

  useGSAP(() => {
    // Hero animation
    gsap.from(heroRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // Support cards animation
    cardRefs.current.forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.2,
        ease: "sine.out",
      });
    });

    // Form animation
    gsap.from(formRef.current, {
      scrollTrigger: {
        trigger: formRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-gray-900">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="text-center py-20 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white"
      >
        <h1 className="text-5xl font-extrabold mb-6">We’re Here to Help</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
          Need assistance? Find answers in our knowledge base, connect with live
          chat, or submit a support request below.
        </p>
      </section>

      {/* Support Options */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          {
            title: "Knowledge Base",
            desc: "Browse FAQs, guides, and tutorials to solve issues instantly.",
            icon: "📚",
          },
          {
            title: "Live Chat",
            desc: "Chat with our support team in real-time for quick help.",
            icon: "💬",
          },
          {
            title: "Email Support",
            desc: "Send us your query and we’ll respond within 24 hours.",
            icon: "✉️",
          },
        ].map((opt, i) => (
          <div
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition transform hover:-translate-y-2"
          >
            <div className="text-5xl mb-4">{opt.icon}</div>
            <h3 className="text-2xl font-semibold mb-2">{opt.title}</h3>
            <p className="text-gray-600">{opt.desc}</p>
          </div>
        ))}
      </section>

      {/* Support Request Form */}
      <section className="py-20 px-6 bg-gray-50">
        <div
          ref={formRef}
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">
            Submit a Support Request
          </h2>
          <form className="space-y-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Issue / Query
              </label>
              <textarea
                placeholder="Describe your issue..."
                rows="5"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Submit Request
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
