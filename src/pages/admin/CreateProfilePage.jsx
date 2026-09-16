import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  CheckCircle2,
  UserRound,
  MapPin,
  Tag,
  Ruler,
  BriefcaseBusiness,
  CalendarDays,
  Upload,
  X,
} from 'lucide-react';
import api from '../../services/api';

const initialForm = {
  name: '',
  username: '',
  bio: '',
  location: '',
  categories: '',
  height: '',
  experience: '',
  availability: 'Available',
};

export default function CreateProfilePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError('');

    try {
      const payload = new FormData();

      payload.append('name', form.name);
      payload.append('username', form.username);
      payload.append('bio', form.bio);
      payload.append('location', form.location);

      const categories = form.categories
        .split(',')
        .map((category) => category.trim())
        .filter(Boolean);

      categories.forEach((category) => {
        payload.append('categories', category);
      });

      payload.append('height', form.height);
      payload.append('experience', form.experience);
      payload.append('availability', form.availability);

      if (selectedImage) {
        payload.append('profileImage', selectedImage);
      }

      await api.post('/admin/models', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/admin/profiles', { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Unable to create the profile right now.'
      );
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  return (
    <main className="min-h-screen bg-[#f7f5fb] text-[#292132]">

      {/* TOP BAR */}
      <header className="border-b border-[#e6e1ed] bg-white">
        <div className="mx-auto flex h-[82px] max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-10">

          <div className="flex items-center gap-4">

            <Link
              to="/admin"
              className="flex h-10 w-10 items-center justify-center border border-[#e3deea] bg-white text-[#63586e] transition hover:border-[#7658c9] hover:text-[#7658c9]"
            >
              <ArrowLeft size={17} />
            </Link>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#968c9f]">
                Studio / Profiles
              </p>

              <h1 className="mt-1 text-sm font-semibold text-[#332a3d]">
                Create new profile
              </h1>
            </div>

          </div>

          <Link
            to="/admin/profiles"
            className="hidden items-center gap-2 text-sm font-medium text-[#71667c] transition hover:text-[#7658c9] sm:flex"
          >
            View profiles
            <ArrowLeft
              size={15}
              className="rotate-180"
            />
          </Link>

        </div>
      </header>

      {/* PAGE */}
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">

        {/* INTRO */}
        <div className="mb-10 max-w-3xl">

          <div className="mb-4 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7658c9]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#93889e]">
              New model
            </span>
          </div>

          <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#2c2435] sm:text-5xl">
            Create a profile
            <span className="text-[#7658c9]">.</span>
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#766c80] sm:text-base">
            Add the essential information that will shape the model's public
            profile, portfolio and availability across the platform.
          </p>

        </div>

        {/* FORM LAYOUT */}
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">

          {/* LEFT INFORMATION PANEL */}
          <aside className="h-fit border border-[#e3deea] bg-[#30263f] text-white lg:sticky lg:top-6">

            <div className="p-6 sm:p-7">

              <div className="flex h-11 w-11 items-center justify-center bg-[#7658c9]">
                <UserRound size={19} />
              </div>

              <h3 className="mt-7 text-2xl font-semibold tracking-tight">
                Profile details
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/55">
                Complete the information on this page before publishing the
                model profile.
              </p>

              <div className="mt-8 space-y-5">

                <div className="flex gap-3">
                  <div className="mt-0.5 text-white/45">
                    <UserRound size={15} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-white/80">
                      Identity
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/45">
                      Name and public username
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-0.5 text-white/45">
                    <MapPin size={15} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-white/80">
                      Location
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/45">
                      Where the model is based
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-0.5 text-white/45">
                    <Tag size={15} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-white/80">
                      Categories
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/45">
                      Fashion, commercial, lifestyle, etc.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-0.5 text-white/45">
                    <CalendarDays size={15} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-white/80">
                      Availability
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/45">
                      Current booking status
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="border-t border-white/10 p-6 sm:p-7">

              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={15}
                  className="text-[#a994e8]"
                />

                <span className="text-xs font-medium text-white/75">
                  Admin workspace
                </span>
              </div>

              <p className="mt-2 text-[11px] leading-5 text-white/40">
                You can edit profile information and portfolio content after
                the profile has been created.
              </p>

            </div>
          </aside>

          {/* FORM */}
          <section className="border border-[#e3deea] bg-white">

            <form onSubmit={handleSubmit}>

              {/* FORM HEADER */}
              <div className="border-b border-[#ebe7f0] px-6 py-6 sm:px-8">

                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#958a9e]">
                  Information
                </p>

                <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#30263b]">
                  Model information
                </h3>

                <p className="mt-1 text-sm text-[#82788b]">
                  Enter the details that will appear on the public profile.
                </p>

              </div>

              {/* FORM BODY */}
              <div className="space-y-10 p-6 sm:p-8">

                {/* IDENTITY */}
                <section>

                  <div className="mb-5 flex items-center gap-3">

                    <div className="flex h-8 w-8 items-center justify-center bg-[#f0ebff] text-[#7658c9]">
                      <UserRound size={15} />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-[#3b3146]">
                        Identity
                      </h4>

                      <p className="text-xs text-[#958b9e]">
                        Basic public profile information
                      </p>
                    </div>

                  </div>

                  <div className="grid gap-5 md:grid-cols-2">

                    <Field
                      label="Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Amara Johnson"
                      required
                    />

                    <Field
                      label="Username"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="amara_j"
                      required
                    />

                  </div>

                </section>

                {/* BIO */}
                <section>

                  <div className="mb-5">

                    <h4 className="text-sm font-semibold text-[#3b3146]">
                      Biography
                    </h4>

                    <p className="mt-1 text-xs text-[#958b9e]">
                      A short introduction for the public profile
                    </p>

                  </div>

                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={5}
                    className="w-full resize-none border border-[#e2dce9] bg-[#fcfbfe] px-4 py-3 text-sm text-[#332a3d] outline-none transition placeholder:text-[#aaa1b0] focus:border-[#7658c9] focus:bg-white"
                    placeholder="Fashion, commercial, and lifestyle model based in Lagos..."
                  />

                </section>

                {/* DETAILS */}
                <section>

                  <div className="mb-5">

                    <h4 className="text-sm font-semibold text-[#3b3146]">
                      Professional details
                    </h4>

                    <p className="mt-1 text-xs text-[#958b9e]">
                      Information used to describe the model
                    </p>

                  </div>

                  <div className="grid gap-5 md:grid-cols-2">

                    <Field
                      label="Location"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Lagos, Nigeria"
                      icon={MapPin}
                    />

                    <Field
                      label="Categories"
                      name="categories"
                      value={form.categories}
                      onChange={handleChange}
                      placeholder="Fashion, Commercial, Lifestyle"
                      icon={Tag}
                    />

                    <Field
                      label="Height"
                      name="height"
                      value={form.height}
                      onChange={handleChange}
                      placeholder={'5\'9"'}
                      icon={Ruler}
                    />

                    <Field
                      label="Experience"
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      placeholder="5 years"
                      icon={BriefcaseBusiness}
                    />

                    <div className="space-y-2">

                      <label className="block text-xs font-semibold text-[#544a5e]">
                        Availability
                      </label>

                      <div className="relative">

                        <CalendarDays
                          size={15}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#91879b]"
                        />

                        <select
                          name="availability"
                          value={form.availability}
                          onChange={handleChange}
                          className="w-full appearance-none border border-[#e2dce9] bg-[#fcfbfe] px-10 py-3 text-sm text-[#332a3d] outline-none transition focus:border-[#7658c9] focus:bg-white"
                        >
                          <option value="Available">
                            Available
                          </option>

                          <option value="Booked">
                            Booked
                          </option>

                          <option value="Open for collaborations">
                            Open for collaborations
                          </option>
                        </select>

                      </div>

                    </div>

                  </div>

                </section>

                {/* IMAGE */}
                <section>

                  <div className="mb-5">

                    <h4 className="text-sm font-semibold text-[#3b3146]">
                      Profile image
                    </h4>

                    <p className="mt-1 text-xs text-[#958b9e]">
                      Choose the primary image displayed on the profile
                    </p>

                  </div>

                  {!selectedImage ? (
                    <label className="group flex cursor-pointer flex-col items-center justify-center border border-dashed border-[#d9d1e4] bg-[#fcfbfe] px-6 py-12 text-center transition hover:border-[#7658c9] hover:bg-[#faf8ff]">

                      <div className="flex h-14 w-14 items-center justify-center bg-[#f0ebff] text-[#7658c9] transition group-hover:bg-[#7658c9] group-hover:text-white">
                        <Upload size={20} />
                      </div>

                      <p className="mt-5 text-sm font-semibold text-[#4a4053]">
                        Upload profile image
                      </p>

                      <p className="mt-2 text-xs text-[#91879b]">
                        JPG, PNG, WEBP or GIF · Maximum 10MB
                      </p>

                      <span className="mt-5 inline-flex items-center gap-2 border border-[#ded7e7] bg-white px-4 py-2 text-xs font-medium text-[#655a70]">
                        <ImagePlus size={14} />
                        Choose image
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) =>
                          setSelectedImage(
                            event.target.files?.[0] || null
                          )
                        }
                      />

                    </label>
                  ) : (
                    <div className="border border-[#ded7e7] bg-[#fcfbfe] p-4">

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex min-w-0 items-center gap-4">

                          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden bg-[#f0ebff] text-[#7658c9]">
                            {selectedImage.type.startsWith('image/') ? (
                              <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Selected profile"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ImagePlus size={20} />
                            )}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-medium text-[#40364b]">
                              {selectedImage.name}
                            </p>

                            <p className="mt-1 text-xs text-[#91879b]">
                              {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                            </p>

                          </div>

                        </div>

                        <button
                          type="button"
                          onClick={removeImage}
                          className="inline-flex items-center justify-center gap-2 self-start border border-[#e2dce9] bg-white px-3 py-2 text-xs font-medium text-[#71667c] transition hover:border-red-200 hover:text-red-500 sm:self-auto"
                        >
                          <X size={14} />
                          Remove
                        </button>

                      </div>

                    </div>
                  )}

                </section>

                {/* ERROR */}
                {error ? (
                  <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

              </div>

              {/* FOOTER */}
              <div className="flex flex-col-reverse gap-3 border-t border-[#ebe7f0] bg-[#fcfbfe] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">

                <Link
                  to="/admin"
                  className="text-center text-sm font-medium text-[#756a80] transition hover:text-[#7658c9]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 bg-[#7658c9] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6548b5] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Creating profile...
                    </>
                  ) : (
                    <>
                      Create profile
                      <ArrowLeft
                        size={16}
                        className="rotate-180"
                      />
                    </>
                  )}
                </button>

              </div>

            </form>
          </section>

        </div>
      </div>
    </main>
  );
}

/* ---------------------------------------------
   REUSABLE FIELD
--------------------------------------------- */

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  icon: Icon,
}) {
  return (
    <label className="block space-y-2">
      <span className="block text-xs font-semibold text-[#544a5e]">
        {label}
      </span>

      <div className="relative">

        {Icon ? (
          <Icon
            size={15}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#91879b]"
          />
        ) : null}

        <input
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full border border-[#e2dce9] bg-[#fcfbfe] py-3 text-sm text-[#332a3d] outline-none transition placeholder:text-[#aaa1b0] focus:border-[#7658c9] focus:bg-white ${
            Icon ? 'pl-10 pr-4' : 'px-4'
          }`}
        />

      </div>
    </label>
  );
}