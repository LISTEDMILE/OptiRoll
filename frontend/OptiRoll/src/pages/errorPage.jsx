import { useRef, useEffect } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  const doodleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // Animate doodle bouncing
    gsap.fromTo(
      doodleRef.current,
      { y: -50, rotate: -10 },
      { y: 0, rotate: 10, duration: 1.2, ease: "bounce.out", repeat: -1, yoyo: true }
    );

    // Animate text fade-in
    gsap.from(textRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.5,
      ease: "power3.out",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 px-6 text-center">
      {/* Funny Doodle */}
      <div ref={doodleRef} className="text-8xl mb-8 animate-bounce">
        🐸🤷‍♂️💥
      </div>

      {/* Main Text */}
      <h1
        ref={textRef}
        className="text-5xl md:text-6xl font-extrabold mb-4 text-indigo-700"
      >
        Oops! You are lost.
      </h1>
      <p className="text-gray-700 mb-8 text-lg md:text-xl max-w-xl">
        Looks like this page doesn’t exist… maybe the internet ate it, or a frog stole it 🐸.
      </p>

      {/* Back Home Button */}
      <Link
        to="/"
        className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition"
      >
        Take Me Home
      </Link>
    </div>
  );
}
