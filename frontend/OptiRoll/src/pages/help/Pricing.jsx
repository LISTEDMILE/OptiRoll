import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export default function PricingPage() {
  const headingRef = useRef(null);
  const pricingRefs = useRef([]);

  const pricingPlans = [
    {
      name: "Basic",
      price: "$9/mo",
      highlight: false,
      features: ["100 Students", "Basic Dashboard", "Email Support"],
    },
    {
      name: "Pro",
      price: "$29/mo",
      highlight: true,
      features: [
        "500 Students",
        "Advanced Analytics",
        "Priority Support",
        "Export Reports",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      highlight: false,
      features: [
        "Unlimited Students",
        "Custom Integrations",
        "Dedicated Account Manager",
        "Enterprise-Grade Security",
      ],
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

    // Animate pricing cards
    pricingRefs.current.forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
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
          Pricing Plans
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Choose the plan that fits your organization’s needs.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {pricingPlans.map((plan, i) => (
            <div
              key={i}
              ref={(el) => (pricingRefs.current[i] = el)}
              className={`rounded-2xl p-10 text-center shadow-lg transition transform hover:-translate-y-2 hover:shadow-2xl ${
                plan.highlight
                  ? "bg-gradient-to-br from-indigo-600 to-pink-600 text-white scale-105"
                  : "bg-white"
              }`}
            >
              <h3
                className={`text-3xl font-bold mb-4 ${
                  plan.highlight ? "text-white" : "text-indigo-700"
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-4xl font-extrabold mb-6 ${
                  plan.highlight ? "text-white" : "text-indigo-600"
                }`}
              >
                {plan.price}
              </p>
              <ul
                className={`mb-6 space-y-3 text-lg ${
                  plan.highlight ? "text-indigo-100" : "text-gray-600"
                }`}
              >
                {plan.features.map((f, idx) => (
                  <li key={idx}>✅ {f}</li>
                ))}
              </ul>
              <Link
                to="/auth/signup"
                className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition ${
                  plan.highlight
                    ? "bg-white text-indigo-600 hover:bg-gray-100"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Choose Plan
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
