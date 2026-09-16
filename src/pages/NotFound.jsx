import { motion } from "framer-motion";
import { ArrowLeft, Home, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useModels } from "../context/ModelContext";

const NotFound = () => {
  const navigate = useNavigate();
  const { getDefaultModel } = useModels();

  const [modelUsername, setModelUsername] = useState("");

  useEffect(() => {
    const loadDefaultModel = async () => {
      try {
        const model = await getDefaultModel();

        if (model?.username) {
          setModelUsername(model.username);
        }
      } catch (error) {
        console.error("Failed to load default model:", error);
      }
    };

    loadDefaultModel();
  }, [getDefaultModel]);

  const handleViewProfile = () => {
    if (!modelUsername) {
      navigate("/login");
      return;
    }

    navigate(`/model/${modelUsername}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#faf9ff] text-[#2c233d]">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-[#dcd2ff]/35 blur-3xl" />

        <div className="absolute -bottom-48 -right-40 h-[36rem] w-[36rem] rounded-full bg-[#eee8ff]/70 blur-3xl" />

        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-[#f4f1ff]/80 blur-3xl" />

        {/* Floating circles */}
        <motion.div
          animate={{
            y: [0, -18, 0],
            rotate: [0, 8, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[13%] top-[17%] h-24 w-24 rounded-full border border-[#7658c9]/15"
        />

        <motion.div
          animate={{
            y: [0, 14, 0],
            rotate: [0, -8, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[17%] left-[10%] h-14 w-14 rounded-full border border-[#7658c9]/15"
        />

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[28%] bottom-[22%] h-3 w-3 rounded-full bg-[#7658c9]"
        />
      </div>

      {/* Main */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl text-center">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-7 flex items-center justify-center gap-3"
          >
            <span className="h-px w-8 bg-[#7658c9]/25" />

            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#7658c9]">
              <Sparkles size={12} />
              Page not found
            </div>

            <span className="h-px w-8 bg-[#7658c9]/25" />
          </motion.div>

          {/* 404 */}
          <div className="relative mx-auto w-fit">
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="select-none bg-gradient-to-br from-[#9a82e0] via-[#7658c9] to-[#5b429e] bg-clip-text text-[clamp(8rem,27vw,17rem)] font-black leading-[0.72] tracking-[-0.1em] text-transparent"
            >
              404
            </motion.h1>

            {/* Center label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5,
                duration: 0.7,
              }}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-white/70 bg-white/65 px-4 py-2 shadow-[0_10px_40px_rgba(91,66,158,0.08)] backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#7658c9]" />

              <span className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.35em] text-[#5d4b78]">
                Lost in the moment
              </span>
            </motion.div>
          </div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.25,
              duration: 0.7,
            }}
            className="mx-auto mt-14 max-w-lg"
          >
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#2c233d] sm:text-4xl">
              This page slipped away.
            </h2>

            <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#5d526c] sm:text-base">
              The page you're looking for doesn't exist or may have moved.
              Let's take you back to the profile and continue exploring.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.45,
              duration: 0.7,
            }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="group flex w-full items-center justify-center gap-2 rounded-full border border-[#e1daf0] bg-white px-7 py-3.5 text-sm font-medium text-[#3b304d] shadow-[0_8px_30px_rgba(67,47,103,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#cfc3e8] hover:bg-[#faf8ff] hover:shadow-[0_12px_35px_rgba(67,47,103,0.09)] sm:w-auto"
            >
              <ArrowLeft
                size={17}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />

              Go back
            </button>

            <button
              type="button"
              onClick={handleViewProfile}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#7658c9] px-7 py-3.5 text-sm font-medium text-white shadow-[0_12px_30px_rgba(118,88,201,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#694bb9] hover:shadow-[0_16px_38px_rgba(118,88,201,0.28)] sm:w-auto"
            >
              <Home
                size={17}
                className="transition-transform duration-300 group-hover:scale-110"
              />

              View Profile
            </button>
          </motion.div>

          {/* Bottom detail */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.8,
              duration: 1,
            }}
            className="mt-16 flex items-center justify-center gap-4"
          >
            <span className="h-px w-12 bg-[#ddd5ec]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#a396b8]">
              404 / Portfolio
            </span>

            <span className="h-px w-12 bg-[#ddd5ec]" />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;