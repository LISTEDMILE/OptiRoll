import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const headingRef = useRef(null);
  const cardRefs = useRef([]);
  const formRef = useRef(null);

  const contacts = [
    {
      title: "Email",
      detail: "support@OptiRoll.com",
      icon: "✉️",
    },
    {
      title: "Phone",
      detail: "+1 (555) 123-4567",
      icon: "📞",
    },
    {
      title: "Office",
      detail: "123 Innovation Drive, Tech City",
      icon: "📍",
    },
  ];

  useGSAP(() => {
    // Heading animation
    gsap.from(headingRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // Contact cards animation
    cardRefs.current.forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "sine.out",
        delay: i * 0.1,
      });
    });

    // Form animation
    gsap.from(formRef.current, {
      scrollTrigger: {
        trigger: formRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      y: 80,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-gray-900">
      {/* Heading */}
      <section className="py-24 text-center">
        <h1
          ref={headingRef}
          className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent"
        >
          Contact Us
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Have questions? We’d love to hear from you. Reach out anytime.
        </p>
      </section>

      {/* Contact Info Cards */}
      <section className="pb-16 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {contacts.map((c, i) => (
          <div
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition transform hover:-translate-y-2"
          >
            <div className="text-5xl mb-4">{c.icon}</div>
            <h3 className="text-2xl font-semibold mb-2 text-indigo-700">
              {c.title}
            </h3>
            <p className="text-gray-600">{c.detail}</p>
          </div>
        ))}
      </section>

      {/* Contact Form */}
      <section className="pb-24 px-6 max-w-3xl mx-auto">
        <form
          ref={formRef}
          className="bg-white rounded-2xl shadow-lg p-10 space-y-6"
        >
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Message
            </label>
            <textarea
              rows="5"
              placeholder="Write your message..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
}
