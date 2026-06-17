import React,{ useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

export default function ErrorPage() {
  const frogRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const btnRef = useRef(null);

  const messages = [
    "Bro... where are we? 🐸",
    "I don't think this page exists...",
    "Who let you cook this URL? 💀",
    "This ain't the page you're looking for.",
    "The server is just as confused as you.",
    "Mission Failed Successfully.",
  ];

  const randomMessage =
    messages[Math.floor(Math.random() * messages.length)];

  useEffect(() => {
    gsap.from(frogRef.current, {
      scale: 0,
      rotate: -180,
      duration: 1,
      ease: "elastic.out(1,0.5)",
    });

    gsap.to(frogRef.current, {
      y: -18,
      rotate: 8,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.from(titleRef.current, {
      opacity: 0,
      y: 40,
      delay: 0.3,
      duration: 0.8,
    });

    gsap.from(textRef.current, {
      opacity: 0,
      y: 25,
      delay: 0.6,
      duration: 0.8,
    });

    gsap.from(btnRef.current, {
      scale: 0,
      delay: 1,
      duration: 0.8,
      ease: "elastic.out(1,0.5)",
    });

    gsap.to(".floating", {
      y: "random(-30,30)",
      x: "random(-20,20)",
      duration: "random(2,4)",
      repeat: -1,
      yoyo: true,
      stagger: 0.2,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-violet-100 to-cyan-100 flex items-center justify-center px-6">

      {/* Floating Emojis */}
      <span className="floating absolute top-20 left-20 text-4xl">🐛</span>
      <span className="floating absolute top-32 right-24 text-4xl">💀</span>
      <span className="floating absolute bottom-28 left-24 text-4xl">📄</span>
      <span className="floating absolute bottom-20 right-20 text-4xl">❓</span>
      <span className="floating absolute top-1/2 left-10 text-3xl">🤷</span>
      <span className="floating absolute top-1/3 right-16 text-3xl">🚧</span>

      {/* Main Card */}
      <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-2xl p-10 max-w-2xl text-center">

        {/* Frog */}
        <div
          ref={frogRef}
          className="text-[120px] md:text-[150px] leading-none"
        >
          🐸
        </div>

        {/* Small Tag */}
        <p className="uppercase tracking-[0.4em] text-sm text-gray-500 mt-2">
          ERROR • 404
        </p>

        {/* Heading */}
        <h1
          ref={titleRef}
          className="mt-6 text-4xl md:text-6xl font-black text-gray-800"
        >
          {randomMessage}
        </h1>

        {/* Description */}
        <div
          ref={textRef}
          className="mt-8 text-gray-600 text-lg leading-8"
        >
          <p>I checked every folder.</p>
          <p>I even asked the server.</p>
          <p className="font-semibold text-gray-800">
            It has absolutely no idea what page you're looking for.
          </p>

          <div className="mt-6 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg p-4 text-left">
            <p className="font-semibold">🐸 Frog says:</p>
            <p className="mt-2">
              "Maybe stop freestyling the URL and let's head back home."
            </p>
          </div>
        </div>

        {/* Home Button */}
        <Link
          ref={btnRef}
          to="/"
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 px-8 py-4 mt-10 text-white font-bold shadow-xl hover:shadow-violet-400/40"
        >
          <span className="relative z-10">
            🚀 Take Me Home
          </span>

          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition duration-300"></span>
        </Link>

        {/* Bottom Joke */}
        <div className="mt-10 border-t border-gray-300 pt-6">
          <p className="text-sm text-gray-500">
            🏆 Achievement Unlocked
          </p>

          <p className="font-bold text-gray-700 mt-1">
            Professional URL Explorer
          </p>

          <p className="text-xs text-gray-400 mt-3">
            No frogs were harmed while generating this 404 page.
          </p>
        </div>
      </div>
    </div>
  );
}