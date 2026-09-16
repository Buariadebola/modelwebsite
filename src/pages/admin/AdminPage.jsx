import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ImagePlus,
  LogOut,
  MessageSquareText,
  UserRound,
  LayoutDashboard,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const cards = [
  {
    title: 'Profiles',
    description:
      'Open existing model profiles, update information, and manage portfolio content.',
    path: '/admin/profiles',
    number: '01',
    icon: UserRound,
  },
  {
    title: 'Create Profile',
    description:
      'Build a new model profile with biography, media, categories, and editorial details.',
    path: '/admin/create-profile',
    number: '02',
    icon: ImagePlus,
  },
  {
    title: 'Messages',
    description:
      'View private client conversations and respond to incoming enquiries.',
    path: '/admin/messages',
    number: '03',
    icon: MessageSquareText,
  },
];

const AdminPage = () => {
  const { logout } = useAuth();

  return (
    <main className="min-h-screen bg-[#f7f5fb] text-[#292132]">
      <div className="flex min-h-screen">

        {/* LEFT SIDEBAR */}
        <aside className="hidden w-[250px] shrink-0 flex-col bg-[#2f2540] text-white lg:flex">

          {/* Brand */}
          <div className="flex h-[88px] items-center border-b border-white/10 px-7">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/50">
                Aster
              </p>

              <p className="mt-1 text-sm font-medium text-white">
                Studio Manager
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-8">
            <p className="px-3 text-[10px] font-medium uppercase tracking-[0.25em] text-white/35">
              Workspace
            </p>

            <nav className="mt-4 space-y-1">

              <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3 text-sm text-white">
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
              </div>

              <Link
                to="/admin/profiles"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/55 transition hover:bg-white/5 hover:text-white"
              >
                <UserRound size={17} />
                <span>Profiles</span>
              </Link>

              <Link
                to="/admin/create-profile"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/55 transition hover:bg-white/5 hover:text-white"
              >
                <ImagePlus size={17} />
                <span>Create Profile</span>
              </Link>

              <Link
                to="/admin/messages"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/55 transition hover:bg-white/5 hover:text-white"
              >
                <MessageSquareText size={17} />
                <span>Messages</span>
              </Link>

            </nav>
          </div>

          {/* Sidebar bottom */}
          <div className="border-t border-white/10 p-5">
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/55 transition hover:bg-white/5 hover:text-white"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="min-w-0 flex-1">

          {/* TOP BAR */}
          <header className="flex h-[88px] items-center justify-between border-b border-[#e8e2f0] bg-white px-5 sm:px-8 lg:px-10">

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#93879f]">
                Studio
              </p>

              <p className="mt-1 text-sm font-medium text-[#40354d]">
                Administration
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg border border-[#e4deeb] bg-white px-3.5 py-2 text-sm font-medium text-[#5d5268] transition hover:border-[#7658c9] hover:text-[#7658c9] lg:hidden"
            >
              <LogOut size={16} />
              Logout
            </button>

            <button
              type="button"
              onClick={logout}
              className="hidden items-center gap-2 text-sm font-medium text-[#756b80] transition hover:text-[#7658c9] lg:flex"
            >
              Logout
              <LogOut size={16} />
            </button>
          </header>

          {/* CONTENT */}
          <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">

            {/* HERO */}
            <section className="relative overflow-hidden border border-[#e4dff0] bg-white">

              {/* Decorative purple block */}
              <div className="absolute right-0 top-0 h-full w-[35%] bg-[#f0ebff]" />

              <div className="relative grid gap-10 px-6 py-9 sm:px-9 sm:py-11 lg:grid-cols-[1fr_300px] lg:px-12 lg:py-14">

                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7658c9] text-white">
                      <LayoutDashboard size={15} />
                    </span>

                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8b8195]">
                      Control centre
                    </span>
                  </div>

                  <h1 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#292132] sm:text-5xl lg:text-6xl">
                    Manage your
                    <span className="block text-[#7658c9]">
                      studio presence.
                    </span>
                  </h1>

                  <p className="mt-6 max-w-xl text-sm leading-7 text-[#71677b] sm:text-base">
                    Manage model profiles, publish portfolio content, and
                    communicate with clients from one central workspace.
                  </p>
                </div>

                {/* Hero side info */}
                <div className="relative flex items-end lg:justify-end">
                  <div className="w-full max-w-[270px] border border-[#ddd5ec] bg-white p-5 shadow-[0_20px_50px_rgba(67,48,95,0.08)]">

                    <div className="mb-8 flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#91869d]">
                        Workspace
                      </span>

                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    </div>

                    <p className="text-3xl font-semibold tracking-tight text-[#30263b]">
                      03
                    </p>

                    <p className="mt-1 text-sm text-[#82788b]">
                      available tools
                    </p>

                    <div className="mt-6 h-px bg-[#eee9f3]" />

                    <p className="mt-4 text-xs leading-5 text-[#8a8092]">
                      Profiles, portfolio publishing and private client
                      conversations.
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* SECTION HEADER */}
            <div className="mt-12 flex items-end justify-between border-b border-[#e5dfea] pb-5">

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#93889e]">
                  Workspace
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#30263b]">
                  Quick access
                </h2>
              </div>

              <p className="hidden text-xs text-[#93899d] sm:block">
                Select a workspace to continue
              </p>
            </div>

            {/* CARDS */}
            <div className="mt-6 grid gap-4 md:grid-cols-3">

              {cards.map(
                ({ title, description, path, number, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className="group relative flex min-h-[330px] flex-col overflow-hidden border border-[#e4dfee] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#cfc3e5] hover:shadow-[0_20px_50px_rgba(67,48,95,0.09)] sm:p-7"
                  >
                    {/* Number */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold tracking-[0.2em] text-[#aaa0b3]">
                        {number}
                      </span>

                      <span className="flex h-10 w-10 items-center justify-center border border-[#e5dfee] bg-[#faf9fd] text-[#7658c9] transition group-hover:border-[#7658c9] group-hover:bg-[#7658c9] group-hover:text-white">
                        <Icon size={17} />
                      </span>
                    </div>

                    {/* Content */}
                    <div className="mt-auto">

                      <div className="mb-5 h-px w-full bg-[#eeeaf2]" />

                      <h3 className="text-2xl font-semibold tracking-tight text-[#30263b]">
                        {title}
                      </h3>

                      <p className="mt-3 max-w-sm text-sm leading-6 text-[#7b7184]">
                        {description}
                      </p>

                      <div className="mt-7 flex items-center justify-between">

                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7658c9]">
                          Open workspace
                        </span>

                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0ebff] text-[#7658c9] transition group-hover:bg-[#7658c9] group-hover:text-white">
                          <ArrowUpRight
                            size={15}
                            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </span>

                      </div>
                    </div>
                  </Link>
                )
              )}

            </div>

            {/* MOBILE NAV */}
            <div className="mt-8 grid grid-cols-3 gap-2 lg:hidden">

              <Link
                to="/admin/profiles"
                className="flex flex-col items-center gap-2 border border-[#e4dfee] bg-white px-3 py-4 text-center text-xs text-[#5f5369]"
              >
                <UserRound size={17} className="text-[#7658c9]" />
                Profiles
              </Link>

              <Link
                to="/admin/create-profile"
                className="flex flex-col items-center gap-2 border border-[#e4dfee] bg-white px-3 py-4 text-center text-xs text-[#5f5369]"
              >
                <ImagePlus size={17} className="text-[#7658c9]" />
                Create
              </Link>

              <Link
                to="/admin/messages"
                className="flex flex-col items-center gap-2 border border-[#e4dfee] bg-white px-3 py-4 text-center text-xs text-[#5f5369]"
              >
                <MessageSquareText size={17} className="text-[#7658c9]" />
                Messages
              </Link>

            </div>

            {/* FOOTER */}
            <footer className="mt-12 flex flex-col gap-2 border-t border-[#e5dfea] pt-5 text-[11px] text-[#9a91a2] sm:flex-row sm:items-center sm:justify-between">
              <span>
                Aster Studio Management
              </span>

              <span>
                Private administration workspace
              </span>
            </footer>

          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminPage;