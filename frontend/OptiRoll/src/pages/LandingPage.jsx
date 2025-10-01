import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const heroRef = useRef(null);
  const featureRefs = useRef([]);
  const ctaRef = useRef(null);
  const testimonialRefs = useRef([]);
  const pricingRefs = useRef([]);

  const features = [
    {
      title: "Automated Attendance",
      description:
        "AI-powered facial recognition marks attendance instantly, reducing manual work.",
    },
    {
      title: "Real-Time Dashboard",
      description:
        "Track attendance trends in real-time with advanced analytics and insights.",
    },
    {
      title: "Seamless Integration",
      description:
        "Easily integrate into your existing systems with minimal effort.",
    },
    {
      title: "Cloud-Based & Secure",
      description:
        "Enterprise-grade encryption and scalability to handle large organizations.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      feedback:
        "This system completely transformed our attendance tracking! It's fast and easy.",
    },
    {
      name: "John D.",
      feedback:
        "We saved hours of admin work every week. Highly recommend this platform!",
    },
    {
      name: "Priya S.",
      feedback:
        "The insights we get from this tool are game-changing for our organization.",
    },
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "$9/mo",
      features: ["100 Students", "Basic Dashboard", "Email Support"],
    },
    {
      name: "Pro",
      price: "$29/mo",
      features: ["500 Students", "Advanced Analytics", "Priority Support"],
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Unlimited Students",
        "Custom Integrations",
        "Dedicated Support",
      ],
    },
  ];

  useGSAP(() => {
    // Hero section animation
    gsap.from(heroRef.current, {
      opacity: 0,
      y: -50,
      duration: 1.2,
      ease: "power3.out",
    });

    gsap.from(".insideHero", {
      opacity: 0,
      x: -50,
      duration: 0.8,
      delay: 1,
      ease: "expo.out",
      stagger:0.3
    })

     gsap.from(".insideHeroLink", {
      opacity: 0,
      duration: 0.8,
      delay: 1.5,
      ease: "expo.out",
    })

    // Features cards animation
    featureRefs.current.forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 65%",
          toggleActions: "play  none reverse none ",

        },
        opacity: 0,
        y: 80,
        duration: 0.8,
        ease:"sine.inOut",
      });
    });

    // Testimonials animation
    testimonialRefs.current.forEach((el, i) => {
       gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 65%",
          toggleActions: "play  none reverse none ",
   
        },
        opacity: 0,
        y: 80,
        duration: 0.8,
        ease:"sine.inOut",
      });
    });

    // Pricing cards animation
    pricingRefs.current.forEach((el, i) => {
       gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 65%",
          toggleActions: "play  none reverse none ",
         
        },
        opacity: 0,
        y: 80,
        duration: 0.8,
        ease:"sine.inOut",
      });
    });

    // CTA bounce in
    gsap.from(ctaRef.current, {
      scrollTrigger: {
        trigger: ctaRef.current,
        start: "top 90%",
        toggleActions: "play  none reverse none ",
      },
      scale: 0.9,
      opacity: 0,
      duration: 1,
      ease: "back.out(1.7)",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative p-5 md:text-center py-28 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden"
      >
      
        <h1 className="insideHero text-3xl md:text-7xl font-extrabold mb-4">
          Automate Attendance Seamlessly
        </h1>
        <p className="insideHero text-lg md:text-2xl mb-6 max-w-3xl mx-auto text-white/90">
          A next-gen attendance platform designed for schools, colleges, and
          organizations to save time and improve accuracy.
        </p>
        <Link
          to="/auth/signup"
          className="insideHeroLink px-10 py-4 bg-white text-indigo-600 rounded-xl font-semibold shadow-lg hover:bg-gray-100 "
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          Why Choose AutoAttend?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (featureRefs.current[index] = el)}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-gray-100 to-gray-50">
        <h2 className="text-4xl font-bold text-center mb-16">
          Loved by Educators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto px-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              ref={(el) => (testimonialRefs.current[i] = el)}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition"
            >
              <p className="text-gray-700 italic mb-4">"{t.feedback}"</p>
              <h4 className="font-semibold text-lg text-gray-900">{t.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          Pricing That Fits You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {pricingPlans.map((plan, i) => (
            <div
              key={i}
              ref={(el) => (pricingRefs.current[i] = el)}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <h3 className="text-3xl font-bold mb-4">{plan.name}</h3>
              <p className="text-4xl font-extrabold mb-6 text-indigo-600">
                {plan.price}
              </p>
              <ul className="mb-6 text-gray-600 space-y-2">
                {plan.features.map((f, idx) => (
                  <li key={idx}>✅ {f}</li>
                ))}
              </ul>
              <Link
                to="/auth/signup"
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
              >
                Choose Plan
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        ref={ctaRef}
        className="py-20 bg-indigo-700 text-center text-white"
      >
        <h2 className="text-4xl font-bold mb-4">Get Started Today</h2>
        <p className="mb-6 max-w-2xl mx-auto text-white/90">
          Join thousands of organizations already using AutoAttend for seamless
          attendance tracking.
        </p>
        <Link
          to="/auth/signup"
          className="px-10 py-4 bg-white text-indigo-700 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Sign Up Now
        </Link>
      </section>

      
    </div>
  );
}
