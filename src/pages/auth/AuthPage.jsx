import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Eye,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { FaEyeSlash } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { useModels } from "../../context/ModelContext";

const initialState = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

export default function AuthPage({ mode = "login" }) {
  const { loading, isAuthenticated, login, register, user } =
    useAuth();

  const { getDefaultModel } = useModels();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isAdminMode = location.pathname.startsWith("/admin");
  const finalMode = isAdminMode ? "admin-login" : mode;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      /* =========================
         REGISTER
      ========================== */

      if (finalMode === "register") {
        await register(form);

        const model = await getDefaultModel();

        if (!model) {
          throw new Error("No active model is available.");
        }

        navigate(`/model/${model.username}`, {
          replace: true,
        });

        return;
      }

      /* =========================
         MODEL / ADMIN LOGIN
      ========================== */

      if (finalMode === "admin-login") {
        await login(
          {
            email: form.email,
            password: form.password,
          },
          "model"
        );

        navigate("/admin", {
          replace: true,
        });

        return;
      }

      /* =========================
         CLIENT LOGIN
      ========================== */

      await login(
        {
          email: form.email,
          password: form.password,
        },
        "client"
      );

      const model = await getDefaultModel();

      if (!model) {
        throw new Error("No active model is available.");
      }

      navigate(`/model/${model.username}`, {
        replace: true,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to sign in right now. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     REDIRECT AUTHENTICATED USER
  ========================== */

  useEffect(() => {
    if (loading || !isAuthenticated || !user) {
      return;
    }

    if (user.type === "model") {
      navigate("/admin", {
        replace: true,
      });

      return;
    }

    const redirectToDefaultModel = async () => {
      try {
        const model = await getDefaultModel();

        if (!model) {
          setError("No active model is available.");
          return;
        }

        navigate(`/model/${model.username}`, {
          replace: true,
        });
      } catch (error) {
        console.error(
          "Failed to redirect to default model:",
          error
        );

        setError("Unable to load the model profile.");
      }
    };

    redirectToDefaultModel();
  }, [
    loading,
    isAuthenticated,
    user,
    getDefaultModel,
    navigate,
  ]);

  /* =========================
     PAGE CONTENT
  ========================== */

  const content = {
    register: {
      label: "Create account",
      title: "A space made for connection.",
      description:
        "Create your private account and connect directly with the model.",
      button: "Create account",
    },

    "admin-login": {
      label: "Studio",
      title: "Welcome back.",
      description:
        "Sign in to manage your profile, content and conversations.",
      button: "Enter studio",
    },

    login: {
      label: "Welcome back",
      title: "Good to see you again.",
      description:
        "Sign in to continue your private experience.",
      button: "Continue",
    },
  };

  const current =
    content[finalMode] || content.login;

  return (
    <main className="min-h-screen bg-[#f8f7fb] text-[#27212f]">

      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <header className="absolute left-0 right-0 top-0 z-30">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">

          {/* Right side */}

          <div className="flex items-center gap-3">

            <span className="hidden text-[10px] uppercase tracking-[0.18em] text-[#938b9c] sm:block">
              {finalMode === "admin-login"
                ? "Studio"
                : "Private access"}
            </span>

            <div className="h-1.5 w-1.5 rounded-full bg-[#7658c9]" />

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <section className="relative flex min-h-screen items-center overflow-hidden px-5 py-3 sm:px-8">

        {/* =================================================
            BACKGROUND GRID
        ================================================== */}

        <div className="pointer-events-none absolute inset-0 opacity-[0.45]">

          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(118,88,201,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(118,88,201,0.07) 1px, transparent 1px)",
              backgroundSize: "70px 70px",
            }}
          />

        </div>

        {/* Purple glow */}

        <div className="pointer-events-none absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full bg-[#ddd4f7]/50 blur-[100px]" />

        <div className="pointer-events-none absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#eee9f8] blur-[100px]" />

        {/* =================================================
            CONTENT
        ================================================== */}

        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[1fr_440px]">

          {/* =================================================
              LEFT INTRO
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -25,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="hidden lg:block"
          >

            {/* Number */}

            <div className="mb-10 flex items-center gap-4">

              <span className="text-[10px] font-medium tracking-[0.2em] text-[#7658c9]">
                01
              </span>

              <div className="h-px w-16 bg-[#cfc5e4]" />

              <span className="text-[9px] uppercase tracking-[0.2em] text-[#a29aaa]">
                Private space
              </span>

            </div>

            {/* Heading */}

            <h1 className="max-w-xl text-[clamp(3rem,5vw,5rem)] font-medium leading-[0.88] tracking-[-0.07em] text-[#292230]">

              {finalMode === "admin-login" ? (
                <>
                  Your studio.
                </>
              ) : (
                <>
                  Stay connected.
                </>
              )}

            </h1>

            {/* Description */}

            <p className="mt-9 max-w-md text-sm leading-7 text-[#756c80]">
              {current.description}
            </p>

            {/* Decorative line */}

            <div className="mt-12 flex items-center gap-5">

              <div className="h-px w-24 bg-[#7658c9]" />

              <span className="text-[9px] uppercase tracking-[0.2em] text-[#9b92a4]">
                Private • Personal • Direct
              </span>

            </div>

            {/* Bottom statement */}

            <div className="mt-10 flex items-center gap-4">

              <div className="flex -space-x-2">

                <div className="h-8 w-8 rounded-full border-2 border-[#f8f7fb] bg-[#d8ccef]" />

                <div className="h-8 w-8 rounded-full border-2 border-[#f8f7fb] bg-[#bba9df]" />

                <div className="h-8 w-8 rounded-full border-2 border-[#f8f7fb] bg-[#8d76c7]" />

              </div>

              <span className="text-[9px] uppercase tracking-[0.14em] text-[#938a9d]">
                A more personal experience
              </span>

            </div>

          </motion.div>

          {/* =================================================
              LOGIN CARD
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full"
          >

            <div className="rounded-[1.75rem] border border-[#e7e1ed] bg-white p-6 shadow-[0_25px_80px_rgba(55,42,75,0.08)]">

              {/* Card header */}

              <div className="mb-4 flex items-start justify-between">

                <div>

                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#f1edfa] px-3 py-1.5">

                    <span className="h-1.5 w-1.5 rounded-full bg-[#7658c9]" />

                    <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#7658c9]">
                      {current.label}
                    </span>

                  </div>

                  <h2 className="text-2xl font-medium tracking-[-0.045em] text-[#2d2635]">
                    {current.title}
                  </h2>

                </div>

                <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#f5f2f9] sm:flex">

                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.5}
                    className="text-[#7658c9]"
                  />

                </div>

              </div>

              {/* Description */}

              <p className="mb-5 text-xs leading-5 text-[#918898]">
                {current.description}
              </p>

              {/* =================================================
                  FORM
              ================================================== */}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {finalMode === "register" && (
                  <FormInput
                    label="Full name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    icon={UserRound}
                  />
                )}

                {finalMode === "register" && (
                  <FormInput
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="08012345678"
                    icon={Phone}
                  />
                )}

                <FormInput
                  label="Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  icon={Mail}
                />

                <FormInput
                  label="Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  icon={LockKeyhole}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />

                {/* Error */}

                {error && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Button */}

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileTap={{
                    scale: 0.985,
                  }}
                  className="group flex h-12 w-full items-center justify-between rounded-xl bg-[#7658c9] px-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_12px_25px_rgba(118,88,201,0.2)] transition-all duration-300 hover:bg-[#684db5] hover:shadow-[0_16px_30px_rgba(118,88,201,0.26)] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  <span>
                    {submitting
                      ? "Please wait..."
                      : current.button}
                  </span>

                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">

                    <ArrowUpRight
                      size={14}
                    />

                  </span>

                </motion.button>

              </form>

              {/* Divider */}

              <div className="my-5 flex items-center gap-3">

                <div className="h-px flex-1 bg-[#eeeaf1]" />

                <span className="text-[8px] uppercase tracking-[0.16em] text-[#b0a7b8]">
                  secure access
                </span>

                <div className="h-px flex-1 bg-[#eeeaf1]" />

              </div>

              {/* Account link */}

              <div className="text-center">

                {finalMode === "register" ? (
                  <p className="text-[11px] text-[#817888]">

                    Already have an account?{" "}

                    <Link
                      to="/login"
                      className="font-semibold text-[#7658c9] transition hover:text-[#59429b]"
                    >
                      Sign in
                    </Link>

                  </p>
                ) : (
                  <p className="text-[11px] text-[#817888]">

                    {isAdminMode
                      ? "Looking for client access?"
                      : "New here?"}{" "}

                    <Link
                      to={
                        isAdminMode
                          ? "/login"
                          : "/register"
                      }
                      className="font-semibold text-[#7658c9] transition hover:text-[#59429b]"
                    >
                      {isAdminMode
                        ? "Client login"
                        : "Create an account"}
                    </Link>

                  </p>
                )}

              </div>

            </div>

            {/* Bottom privacy */}

            <div className="mt-5 flex items-center justify-center gap-2">

              <LockKeyhole
                size={10}
                className="text-[#9c92a7]"
              />

              <span className="text-[8px] uppercase tracking-[0.16em] text-[#9c92a7]">
                Your information stays private
              </span>

            </div>

          </motion.div>

        </div>

      </section>

    </main>
  );
}


/* =========================================================
   FORM INPUT
========================================================= */

function FormInput({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  setShowPassword,
  showPassword,
}) {
  return (
    <div>

      <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#756c80]">
        {label}
      </label>

      <div className="group relative">

        {/* Icon */}

        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">

          <Icon
            size={15}
            strokeWidth={1.5}
            className="text-[#a69cad] transition-colors duration-200 group-focus-within:text-[#7658c9]"
          />

        </div>

        <input
          type={
            type === "password" && showPassword
              ? "text"
              : type
          }
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="h-12 w-full rounded-xl border border-[#e6e0ea] bg-[#fcfbfd] pl-11 pr-11 text-xs text-[#332c3a] outline-none transition-all duration-200 placeholder:text-[#b5adbb] hover:border-[#d6cce1] focus:border-[#9985ce] focus:bg-white focus:ring-4 focus:ring-[#7658c9]/[0.07]"
        />

        {type === "password" && (
          <button
            type="button"
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            onClick={() =>
              setShowPassword(
                (previous) => !previous
              )
            }
            className="absolute right-0 top-0 flex h-12 w-11 items-center justify-center text-[#a49baa] transition-colors hover:text-[#7658c9]"
          >
            {showPassword ? (
              <FaEyeSlash className="h-4 w-4" />
            ) : (
              <Eye
                size={16}
                strokeWidth={1.5}
              />
            )}
          </button>
        )}

      </div>

    </div>
  );
}