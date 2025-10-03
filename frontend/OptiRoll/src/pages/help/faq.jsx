import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function FAQPage() {
  const headingRef = useRef(null);
  const faqRefs = useRef([]);
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is OptiRoll?",
      answer:
        "OptiRoll is a smart attendance management system that automates the process of tracking and recording attendance.",
    },
    {
      question: "How do I get started?",
      answer:
        "Simply sign up, add your organization details, and start managing attendance with ease. A quick-start guide is available in our documentation.",
    },
    {
      question: "Is OptiRoll secure?",
      answer:
        "Yes. We use industry-standard encryption and secure data handling practices to ensure your data is always safe.",
    },
    {
      question: "Can I integrate OptiRoll with other tools?",
      answer:
        "Absolutely! OptiRoll provides APIs and integrations with popular platforms for smooth workflows.",
    },
    {
      question: "Is there customer support available?",
      answer:
        "Yes, our support team is available 24/7 via email and chat. Premium plans include dedicated account managers.",
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

    // Animate each FAQ block
    faqRefs.current.forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: "sine.out",
        delay: i * 0.1,
      });
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
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Find answers to the most common questions about OptiRoll.
        </p>
      </section>

      {/* FAQ Section */}
      <section className="px-6 max-w-4xl mx-auto space-y-6 pb-24">
        {faqs.map((faq, i) => (
          <div
            key={i}
            ref={(el) => (faqRefs.current[i] = el)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex justify-between items-center text-left"
            >
              <h2 className="text-lg md:text-xl font-semibold text-indigo-700">
                {faq.question}
              </h2>
              <span className="text-indigo-600 font-bold text-xl">
                {openIndex === i ? "−" : "+"}
              </span>
            </button>

            {openIndex === i && (
              <p className="mt-4 text-gray-700 leading-relaxed">{faq.answer}</p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
