import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  Camera,
  Plus,
  MapPin,
  UserRound,
} from 'lucide-react';
import { useModels } from '../../context/ModelContext';

export default function AdminProfilesPage() {
  const { models } = useModels();

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
                Model profiles
              </h1>
            </div>

          </div>

          <Link
            to="/admin/create-profile"
            className="inline-flex items-center gap-2 bg-[#7658c9] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6548b5]"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Create profile</span>
            <span className="sm:hidden">Create</span>
          </Link>

        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">

        {/* PAGE INTRO */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div className="max-w-2xl">

            <div className="mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7658c9]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#93889e]">
                Studio directory
              </span>
            </div>

            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#2c2435] sm:text-5xl">
              Select a profile
              <span className="text-[#7658c9]">.</span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#766c80] sm:text-base">
              Choose a model profile to manage its information, portfolio
              content, availability, and public presentation.
            </p>

          </div>

          {/* PROFILE COUNT */}
          <div className="flex w-fit items-center gap-4 border border-[#e3deea] bg-white px-5 py-4">

            <div className="flex h-9 w-9 items-center justify-center bg-[#f0ebff] text-[#7658c9]">
              <UserRound size={16} />
            </div>

            <div>
              <p className="text-2xl font-semibold leading-none text-[#30263b]">
                {models.length}
              </p>

              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#958b9e]">
                {models.length === 1 ? 'Profile' : 'Profiles'}
              </p>
            </div>

          </div>

        </div>

        {/* EMPTY STATE */}
        {models.length === 0 ? (
          <div className="border border-dashed border-[#d8d0e2] bg-white px-6 py-20 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center bg-[#f0ebff] text-[#7658c9]">
              <UserRound size={21} />
            </div>

            <h3 className="mt-6 text-xl font-semibold text-[#352b3e]">
              No profiles yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#84798d]">
              Create your first model profile to start building the studio
              portfolio.
            </p>

            <Link
              to="/admin/create-profile"
              className="mt-7 inline-flex items-center gap-2 bg-[#7658c9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6548b5]"
            >
              <Plus size={16} />
              Create first profile
            </Link>

          </div>
        ) : (

          /* PROFILE GRID */
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {models.map((model) => {

              const image =
                model.profileImage ||
                model.posts?.[0]?.image ||
                'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80';

              const postCount = model.posts?.length || 0;

              return (
                <article
                  key={model.username}
                  className="group overflow-hidden border border-[#e3deea] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#cfc5df] hover:shadow-[0_20px_50px_rgba(67,48,95,0.10)]"
                >

                  {/* IMAGE */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#eeeaf4]">

                    <img
                      src={image}
                      alt={model.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    />

                    {/* IMAGE OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#241c30]/80 via-transparent to-transparent opacity-80" />

                    {/* USERNAME */}
                    <div className="absolute left-5 top-5">

                      <span className="inline-flex bg-white/90 px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-[#51465c] backdrop-blur-sm">
                        @{model.username}
                      </span>

                    </div>

                    {/* OPEN BUTTON */}
                    <Link
                      to={`/admin/models/${model.username}`}
                      className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center bg-white text-[#7658c9] opacity-0 shadow-sm transition group-hover:opacity-100"
                      aria-label={`Open ${model.name} profile`}
                    >
                      <ArrowUpRight size={16} />
                    </Link>

                    {/* NAME */}
                    <div className="absolute bottom-5 left-5 right-5">

                      <h3 className="text-2xl font-semibold tracking-tight text-white">
                        {model.name}
                      </h3>

                      {model.location ? (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-white/70">
                          <MapPin size={12} />
                          {model.location}
                        </div>
                      ) : null}

                    </div>

                  </div>

                  {/* CONTENT */}
                  <div className="p-5">

                    {/* META */}
                    <div className="flex items-center justify-between border-b border-[#eeeaf2] pb-4">

                      <div className="flex items-center gap-2 text-xs font-medium text-[#71667c]">
                        <Camera
                          size={14}
                          className="text-[#7658c9]"
                        />

                        {postCount}{' '}
                        {postCount === 1 ? 'post' : 'posts'}
                      </div>

                      {model.availability ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6d806f]">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {model.availability}
                        </span>
                      ) : null}

                    </div>

                    {/* BIO */}
                    <p className="mt-4 min-h-[72px] line-clamp-3 text-sm leading-6 text-[#756b7e]">
                      {model.bio || 'No bio available yet.'}
                    </p>

                    {/* FOOTER */}
                    <div className="mt-5 flex items-center justify-between">

                      <Link
                        to={`/admin/models/${model.username}`}
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7658c9] transition hover:text-[#6045ad]"
                      >
                        Manage profile
                        <ArrowUpRight size={14} />
                      </Link>

                      <span className="text-[10px] text-[#aaa1b0]">
                        @{model.username}
                      </span>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

        {/* FOOTER */}
        <footer className="mt-12 flex flex-col gap-2 border-t border-[#e5dfea] pt-5 text-[11px] text-[#9a91a2] sm:flex-row sm:items-center sm:justify-between">

          <span>
            Aster Studio Management
          </span>

          <span>
            {models.length} {models.length === 1 ? 'profile' : 'profiles'} in directory
          </span>

        </footer>

      </div>
    </main>
  );
}