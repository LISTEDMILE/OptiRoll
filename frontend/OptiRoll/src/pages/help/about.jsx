import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const headingRef = useRef(null);
  const missionRef = useRef(null);
  const teamRefs = useRef([]);

  const team = [
    {
      name: "Kunal Sharma",
      role: "Founder & CEO",
      img: "Owner.jpg", // replace with real photo
    },
  ];

  useGSAP(() => {
    // Heading
    gsap.from(headingRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // Mission section
    gsap.from(missionRef.current, {
      scrollTrigger: {
        trigger: missionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      y: 60,
      opacity: 0,
      duration: 1,
      ease: "sine.out",
    });

    // Team cards
    teamRefs.current.forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
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
          About Us
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Learn more about our mission, vision, and the team behind OptiRoll.
        </p>
      </section>

      {/* Mission / Vision */}
      <section
        ref={missionRef}
        className="py-20 px-6 max-w-5xl mx-auto text-center"
      >
        <h2 className="text-4xl font-bold mb-6 text-indigo-700">Our Mission</h2>
        <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
          At OptiRoll, our mission is to revolutionize attendance management
          through automation, accuracy, and simplicity. We believe technology
          should empower schools and organizations to save time and focus on
          what truly matters — education and growth.
        </p>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-indigo-700">
          Meet the Team
        </h2>
        <div className="flex flex-col">
          {team.map((member, i) => (
            <div
              key={i}
              ref={(el) => (teamRefs.current[i] = el)}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-[300px] h-[300px] rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
