import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Heart,
  Image as ImageIcon,
  LogOut,
  MapPin,
  MessageCircle,
  MoveUpRight,
  X,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useModels } from '../context/ModelContext';
import api from '../services/api';

const FALLBACK_PROFILE_IMAGE =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80';

const normalizeModel = (response = {}) => {
  const payload = response.data?.model || response.model || response;
  const posts = response.data?.posts || response.posts || [];

  const categories =
    Array.isArray(payload.categories) && payload.categories.length
      ? payload.categories
      : Array.isArray(payload.category)
        ? payload.category
        : [];

  const normalizedPosts = posts.map((post) => {
    const media =
      Array.isArray(post.media) && post.media.length > 0
        ? post.media
        : [
            {
              url:
                post.mediaUrl ||
                post.image ||
                post.video ||
                '',
              type:
                post.mediaType ||
                (post.video ? 'video' : 'image'),
              publicId: post.mediaPublicId || '',
              thumbnailUrl: post.thumbnailUrl || '',
            },
          ];

    const primary = media[0] || {
      url: '',
      type: 'image',
    };

    const isVideo = primary.type === 'video';

    return {
      id: post._id || post.id,
      type: isVideo ? 'video' : 'image',
      image: isVideo ? '' : primary.url,
      video: isVideo ? primary.url : '',
      caption: post.caption || '',
      likes: Number(post.likesCount ?? post.likes ?? 0),
      likesCount: Number(post.likesCount ?? post.likes ?? 0),
      likedByCurrentUser: false,
      media,
    };
  });

  return {
    id: payload._id || payload.id,
    username: payload.username || '',
    name: payload.name || '',
    profileImage: payload.profileImage || '',
    location: payload.location || '',
    bio: payload.bio || '',
    category: categories,
    posts: normalizedPosts,
    stats: {
      posts: Number(
        payload.postsCount ?? normalizedPosts.length ?? 0
      ),
      followers: Number(payload.followersCount ?? 0),
      following: Number(payload.followingCount ?? 0),
    },
  };
};

export default function ModelProfile() {
  const { username } = useParams();

  const [model, setModel] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedPost, setSelectedPost] = useState(null);

  const { isAuthenticated, logout } = useAuth();
  const { getTotalModelLikes, likePost, unlikePost } = useModels();

  const totalLikes = getTotalModelLikes(model);

  const handleLike = async (post) => {
    try {
      const response = post.likedByCurrentUser
        ? await unlikePost(post.id)
        : await likePost(post.id);

      const data = response?.data || response;

      const likesCount = Number(
        data.likesCount ??
          data.likes ??
          (post.likedByCurrentUser
            ? Math.max(Number(post.likes || 0) - 1, 0)
            : Number(post.likes || 0) + 1)
      );

      const liked =
        typeof data.liked === 'boolean'
          ? data.liked
          : !post.likedByCurrentUser;

      setModel((currentModel) => {
        if (!currentModel) return currentModel;

        return {
          ...currentModel,
          posts: currentModel.posts.map((item) =>
            item.id === post.id
              ? {
                  ...item,
                  likes: likesCount,
                  likesCount,
                  likedByCurrentUser: liked,
                }
              : item
          ),
        };
      });

      setSelectedPost((currentPost) =>
        currentPost?.id === post.id
          ? {
              ...currentPost,
              likes: likesCount,
              likesCount,
              likedByCurrentUser: liked,
            }
          : currentPost
      );
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
    }
  };

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const modelResponse = await api.get(
          `/models/${username}`
        );

        let likedPostIds = [];

        if (isAuthenticated) {
          try {
            const likedResponse = await api.get(
              '/model-posts/liked'
            );

            likedPostIds = likedResponse.data?.data || [];
          } catch (error) {
            console.warn(
              'Could not load liked post IDs:',
              error
            );
          }
        }

        const likedPostIdSet = new Set(
          likedPostIds.map((id) => String(id))
        );

        const normalizedModel = normalizeModel(
          modelResponse.data
        );

        const updatedPosts = normalizedModel.posts.map(
          (post) => ({
            ...post,
            likedByCurrentUser: likedPostIdSet.has(
              String(post.id)
            ),
          })
        );

        setModel({
          ...normalizedModel,
          posts: updatedPosts,
        });
      } catch (error) {
        console.error(
          'Failed to load model profile:',
          error
        );
      }
    };

    fetchProfile();
  }, [username, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!model) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf9ff] text-[#6d5a96]">
        <div className="text-center">
          <div className="mx-auto mb-5 h-9 w-9 animate-spin rounded-full border-2 border-[#d8cef4] border-t-[#7557c7]" />

          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#8d80ad]">
            Loading profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#faf9ff] text-[#292238]">

      {/* ================================================= */}
      {/* BACKGROUND */}
      {/* ================================================= */}

      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[550px] w-[550px] rounded-full bg-[#ddd2ff]/40 blur-[130px]" />

        <div className="absolute right-[-180px] top-[30%] h-[600px] w-[600px] rounded-full bg-[#eee9ff]/80 blur-[150px]" />

        <div className="absolute bottom-[-200px] left-[30%] h-[500px] w-[500px] rounded-full bg-[#e4dbff]/40 blur-[150px]" />
      </div>

      {/* ================================================= */}
      {/* NAVIGATION */}
      {/* ================================================= */}

      <header className="relative z-40 px-4 pt-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between rounded-2xl border border-[#e5def5] bg-white/85 px-4 py-3 shadow-[0_12px_40px_rgba(91,70,145,0.07)] backdrop-blur-xl">

          <button
            type="button"
            onClick={() => window.history.back()}
            className="group flex h-11 w-11 items-center justify-center rounded-xl border border-[#e6e0f3] bg-white text-[#67568f] transition hover:border-[#b9a7e9] hover:bg-[#f5f1ff]"
          >
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
          </button>

          <div className="hidden text-center sm:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#7458ba]">
              {model.name}
            </p>

            <p className="mt-1 text-[8px] uppercase tracking-[0.3em] text-[#aaa0c1]">
              @{model.username}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e6e0f3] bg-white text-[#67568f] transition hover:border-[#b9a7e9] hover:bg-[#f5f1ff]"
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <main className="relative z-10 mx-auto max-w-[1500px] px-4 pb-24 pt-5 sm:px-6 lg:px-10">

        <section className="relative overflow-hidden rounded-[1rem] border border-[#e4ddf2] bg-white shadow-[0_25px_80px_rgba(78,57,130,0.08)]">

          {/* Purple decorative block */}
          <div className="absolute right-0 top-0 h-full w-[35%] bg-gradient-to-br from-[#7658c9] via-[#8064d0] to-[#a38be0] opacity-[0.07]" />

          <div className="relative grid lg:grid-cols-[minmax(350px,0.8fr)_1.2fr]">
          <div className='h-full w-full not-sm:mt-10 flex justify-center items-center'>
            {/* IMAGE */}
            <div className="relative h-72 w-72 rounded-xl overflow-hidden bg-[#eee9fa]">

              <img
                src={
                  model.profileImage ||
                  FALLBACK_PROFILE_IMAGE
                }
                alt={model.name}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#201631]/55 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">

                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-white/70">
                    Profile
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    @{model.username}
                  </p>
                </div>
              </div>
            </div>
            </div>

            {/* PROFILE INFORMATION */}
            <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-14">

              <div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#f0ebff] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#7357b8]">
                    Model Profile
                  </span>

                  <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-[#aaa0ba]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8b6bd1]" />
                    Available
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-3">

                  <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.055em] text-[#282036] sm:text-6xl lg:text-7xl">
                    {model.name}
                  </h1>

                  <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7658c9] text-white shadow-lg shadow-[#7658c9]/20">
                    <Check size={10} />
                  </span>

                </div>

                <p className="mt-4 text-[10px] uppercase tracking-[0.35em] text-[#978ba9]">
                  @{model.username}
                </p>

                <div className="mt-5 max-w-2xl">
                  <p className="text-[16px] leading-8 text-[#71677e]">
                    {model.bio ||
                      'No biography available.'}
                  </p>
                </div>

                {/* CATEGORIES */}

                <div className="mt-5 flex flex-wrap gap-2">

                  {model.location && (
                    <span className="flex items-center gap-2 rounded-full border border-[#e4deef] bg-white px-4 py-2 text-[10px] text-[#81768f]">
                      <MapPin
                        size={13}
                        className="text-[#7658c9]"
                      />
                      {model.location}
                    </span>
                  )}
                </div>
              </div>

              {/* STATS + ACTIONS */}

              <div className="mt-10">

                <div className="grid grid-cols-3 gap-3">

                  <StatCard
                    value={model.stats.posts}
                    label="Posts"
                  />

                  <StatCard
                    value={formatNumber(totalLikes)}
                    label="Likes"
                  />

                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                  <button
                    type="button"
                    onClick={() => {
                      window.location.href =
                        '/client/messages';
                    }}
                    className="group flex flex-1 items-center justify-center gap-3 rounded-xl bg-[#7658c9] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_30px_rgba(118,88,201,0.2)] transition hover:bg-[#684bb9] hover:shadow-[0_15px_35px_rgba(118,88,201,0.28)]"
                  >
                    <MessageCircle size={16} />

                    Contact Model

                    <ArrowLeft
                      size={14}
                      className="rotate-180 transition-transform group-hover:translate-x-1"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      window.location.href =
                        '/payment';
                    }}
                    className="flex flex-1 items-center justify-center gap-3 rounded-xl border border-[#dcd3ef] bg-white px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6e559e] transition hover:border-[#b9a7e9] hover:bg-[#f8f5ff]"
                  >
                    Book / Payment
                  </button>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* CONTENT NAV */}
        {/* ================================================= */}

        <section className="mt-16">

          <div className="flex items-end justify-between border-b border-[#e5dff0]">

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#8065bc]">
                Portfolio
              </p>
            </div>

            <div className="flex gap-1">

              <TabButton
                active={activeTab === 'posts'}
                onClick={() =>
                  setActiveTab('posts')
                }
                icon={<ImageIcon size={14} />}
                label="Gallery"
              />

              <TabButton
                active={activeTab === 'about'}
                onClick={() =>
                  setActiveTab('about')
                }
                label="About"
              />

            </div>
          </div>

          {/* ================================================= */}
          {/* GALLERY */}
          {/* ================================================= */}

          {activeTab === 'posts' && (
            <section className="columns-1 gap-5 pt-7 sm:columns-2 lg:columns-3">

              {(model.posts || []).map(
                (post, index) => {
                  const isVideo =
                    post.type === 'video' ||
                    Boolean(post.video);

                  const mediaUrl = isVideo
                    ? post.video || post.image
                    : post.image;

                  return (
                    <article
                      key={post.id}
                      className={`group mb-5 break-inside-avoid overflow-hidden rounded-[1.4rem] border border-[#e5def2] bg-white shadow-[0_15px_45px_rgba(77,57,126,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(77,57,126,0.12)] ${
                        index % 4 === 1
                          ? 'lg:translate-y-8'
                          : ''
                      }`}
                    >

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedPost(post)
                        }
                        className="relative block w-full overflow-hidden bg-[#eeeafa]"
                      >

                        {isVideo ? (
                          <video
                            src={mediaUrl}
                            muted
                            playsInline
                            className="block max-h-[700px] w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                          />
                        ) : (
                          <img
                            src={mediaUrl}
                            alt={
                              post.caption ||
                              'Model post'
                            }
                            className="block max-h-[700px] w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                          />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#261a3c]/50 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

                        <div className="absolute bottom-4 left-4 right-4 flex translate-y-3 items-center justify-between opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">

                          <span className="rounded-full border border-white/20 bg-white/15 px-3 py-2 text-[8px] uppercase tracking-[0.18em] text-white backdrop-blur-md">
                            {isVideo
                              ? 'Video'
                              : 'View'}
                          </span>

                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#6e52a7]">
                            <MoveUpRight
                              size={15}
                            />
                          </span>

                        </div>
                      </button>

                      <div className="p-5">

                        {post.caption && (
                          <p className="text-sm leading-7 text-[#746a80]">
                            {post.caption}
                          </p>
                        )}

                        <div className="mt-4 flex items-center justify-between">

                          <button
                            type="button"
                            onClick={() =>
                              handleLike(post)
                            }
                            className="flex items-center gap-2 text-[#7658c9] transition hover:scale-105"
                          >
                            <Heart
                              size={17}
                              fill={
                                post.likedByCurrentUser
                                  ? '#7658c9'
                                  : 'none'
                              }
                            />

                            <span className="text-xs font-medium text-[#81768f]">
                              {formatNumber(
                                post.likes
                              )}
                            </span>
                          </button>

                          <span className="text-[8px] uppercase tracking-[0.2em] text-[#aaa1b7]">
                            {isVideo
                              ? 'Video'
                              : 'Editorial'}
                          </span>

                        </div>
                      </div>
                    </article>
                  );
                }
              )}

              {!model.posts?.length && (
                <EmptyState
                  icon={<ImageIcon size={25} />}
                  text="No posts yet"
                />
              )}

            </section>
          )}

          {/* ================================================= */}
          {/* ABOUT */}
          {/* ================================================= */}

          {activeTab === 'about' && (
            <section className="grid gap-10 py-14 lg:grid-cols-[1.3fr_0.7fr]">

              <div className="rounded-[1.5rem] border border-[#e5def2] bg-white p-7 shadow-[0_15px_45px_rgba(77,57,126,0.05)] sm:p-10">

                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#8065bc]">
                  About the model
                </p>

                <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#2b223a]">
                  {model.name}
                </h2>

                <p className="mt-7 max-w-3xl text-[15px] leading-8 text-[#756b81]">
                  {model.bio ||
                    'No biography available.'}
                </p>

                <div className="mt-9 flex flex-wrap gap-2">

                  {(model.category || []).map(
                    (category) => (
                      <span
                        key={category}
                        className="rounded-full bg-[#f0ebff] px-4 py-2 text-[9px] uppercase tracking-[0.16em] text-[#7257af]"
                      >
                        {category}
                      </span>
                    )
                  )}

                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[#e5def2] bg-[#f7f4ff] p-7 sm:p-10">

                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#8065bc]">
                  Profile Details
                </p>

                <div className="mt-8">

                  <InfoRow
                    label="Location"
                    value={
                      model.location ||
                      'Not specified'
                    }
                  />

                  <InfoRow
                    label="Categories"
                    value={
                      (model.category || []).join(
                        ', '
                      ) || 'Not specified'
                    }
                  />

                  <InfoRow
                    label="Posts"
                    value={model.stats.posts}
                  />

                  <InfoRow
                    label="Likes"
                    value={formatNumber(
                      totalLikes
                    )}
                  />

                </div>
              </div>
            </section>
          )}
        </section>
      </main>

      {/* ================================================= */}
      {/* POST VIEWER */}
      {/* ================================================= */}

      {selectedPost && (
        <PostViewer
          post={selectedPost}
          model={model}
          onLike={handleLike}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}

/* ================================================= */
/* STAT CARD */
/* ================================================= */

function StatCard({ value, label }) {
  return (
    <div className="rounded-xl border border-[#e6dff2] bg-[#fbfaff] p-4">
      <strong className="block text-xl font-semibold tracking-[-0.03em] text-[#34294a]">
        {value}
      </strong>

      <span className="mt-1 block text-[8px] uppercase tracking-[0.2em] text-[#a098aa]">
        {label}
      </span>
    </div>
  );
}

/* ================================================= */
/* TAB BUTTON */
/* ================================================= */

function TabButton({
  active,
  onClick,
  icon,
  label,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-5 text-[9px] font-semibold uppercase tracking-[0.18em] transition ${
        active
          ? 'text-[#7658c9]'
          : 'text-[#a49bac] hover:text-[#6f559f]'
      }`}
    >
      {icon}
      {label}

      {active && (
        <span className="absolute bottom-[-1px] left-3 right-3 h-[2px] rounded-full bg-[#7658c9]" />
      )}
    </button>
  );
}

/* ================================================= */
/* EMPTY STATE */
/* ================================================= */

function EmptyState({ icon, text }) {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-[#dcd2ef] bg-[#fbfaff]">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#eee9fb] text-[#8065bc]">
        {icon}
      </div>

      <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#8e829d]">
        {text}
      </p>
    </div>
  );
}

/* ================================================= */
/* INFO ROW */
/* ================================================= */

function InfoRow({ label, value }) {
  return (
    <div className="border-b border-[#e3ddef] py-5 first:pt-0">
      <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#a098aa]">
        {label}
      </p>

      <p className="mt-2 text-sm leading-6 text-[#655c70]">
        {value}
      </p>
    </div>
  );
}

/* ================================================= */
/* POST VIEWER */
/* ================================================= */

function PostViewer({
  post,
  model,
  onLike,
  onClose,
}) {
  const isVideo =
    post.type === 'video' ||
    Boolean(post.video);

  const mediaUrl = isVideo
    ? post.video || post.image
    : post.image;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#241936]/45 p-3 backdrop-blur-xl sm:p-6"
      onClick={onClose}
    >

      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/90 text-[#67548d] shadow-xl backdrop-blur-md transition hover:bg-white"
        aria-label="Close post viewer"
      >
        <X size={19} />
      </button>

      <div
        onClick={(event) =>
          event.stopPropagation()
        }
        className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[1.5rem] border border-white/50 bg-white shadow-[0_30px_100px_rgba(29,18,52,0.3)] lg:flex-row"
      >

        {/* MEDIA */}

        <div className="flex min-h-[45vh] flex-1 items-center justify-center bg-[#f3f0fa] p-3 lg:min-h-[80vh]">

          {isVideo ? (
            <video
              src={mediaUrl}
              controls
              className="max-h-[78vh] max-w-full rounded-xl object-contain"
            />
          ) : (
            <img
              src={mediaUrl}
              alt={
                post.caption ||
                'Model post'
              }
              className="max-h-[78vh] max-w-full rounded-xl object-contain"
            />
          )}

        </div>

        {/* DETAILS */}

        <div className="flex w-full flex-col bg-white lg:max-w-[360px]">

          <div className="flex items-center gap-3 border-b border-[#ebe6f2] p-6">

            <img
              src={
                model.profileImage ||
                FALLBACK_PROFILE_IMAGE
              }
              className="h-11 w-11 rounded-full border-2 border-[#ded4f1] object-cover"
              alt={model.name}
            />

            <div>
              <p className="text-sm font-semibold text-[#30253f]">
                {model.name}
              </p>

              <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-[#9c92a8]">
                @{model.username}
              </p>
            </div>

          </div>

          <div className="flex-1 p-6">

            <p className="text-sm leading-7 text-[#71677c]">
              {post.caption ||
                'No caption.'}
            </p>

          </div>

          <div className="border-t border-[#ebe6f2] p-6">

            <div className="flex items-center gap-5">

              <button
                type="button"
                onClick={() =>
                  onLike(post)
                }
                className="text-[#7658c9] transition hover:scale-110"
              >
                <Heart
                  size={21}
                  fill={
                    post.likedByCurrentUser
                      ? '#7658c9'
                      : 'none'
                  }
                />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();

                  window.location.href =
                    '/client/messages';
                }}
                className="flex items-center gap-2 text-[#7257a8] transition hover:text-[#543b87]"
              >
                <MessageCircle size={19} />

                <span className="text-[9px] font-semibold uppercase tracking-[0.16em]">
                  Message
                </span>
              </button>

            </div>

            <p className="mt-5 text-xs font-semibold text-[#514563]">
              {formatNumber(post.likes)} likes
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================= */
/* NUMBER FORMAT */
/* ================================================= */

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}