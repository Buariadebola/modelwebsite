import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Camera,
  Check,
  Edit3,
  ImagePlus,
  Trash2,
  X,
  MapPin,
  MoreHorizontal,
  Plus,
  Play,
  Sparkles,
} from "lucide-react";
import { useModels } from "../../context/ModelContext";

const normalizeModel = (model = {}) => {
  const categories =
    Array.isArray(model.categories) && model.categories.length
      ? model.categories
      : Array.isArray(model.category)
        ? model.category
        : [];

  return {
    id: model._id || model.id,
    _id: model._id || model.id,
    username: model.username || "",
    name: model.name || "",
    isDefault: Boolean(model.isDefault),
    profileImage: model.profileImage || "",
    location: model.location || "",
    bio: model.bio || "",
    category: categories,
    posts: Array.isArray(model.posts) ? model.posts : [],
    postsCount: Number(
      model.postsCount ??
        (Array.isArray(model.posts) ? model.posts.length : 0)
    ),
    followersCount: Number(model.followersCount ?? 0),
    followingCount: Number(model.followingCount ?? 0),
  };
};

export default function AdminModelProfile() {
  const { username } = useParams();

  const {
    models,
    fetchModelDetails,
    updateModel,
    updateProfileImage,
    addPost,
    updatePost,
    deletePost,
    setDefaultModel,
  } = useModels();

  const profileInputRef = useRef(null);
  const postInputRef = useRef(null);

  const [model, setModel] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [profileForm, setProfileForm] = useState({
    name: "",
    username: "",
    location: "",
    bio: "",
    category: "",
  });

  const [postForm, setPostForm] = useState({
    media: [],
    mediaType: "image",
    caption: "",
    files: [],
  });

  const currentModel = useMemo(() => {
    if (model) {
      return model;
    }

    return (
      models.find((item) => item.username === username) || null
    );
  }, [model, models, username]);

  useEffect(() => {
    const selectedModel = models.find(
      (item) => item.username === username
    );

    if (selectedModel) {
      const normalized = normalizeModel(selectedModel);

      setModel(normalized);

      setProfileForm({
        name: normalized.name,
        username: normalized.username,
        location: normalized.location,
        bio: normalized.bio,
        category: normalized.category.join(", "),
      });

      return;
    }

    if (username) {
      fetchModelDetails(username).then((nextModel) => {
        if (!nextModel) return;

        const normalized = normalizeModel(nextModel);

        setModel(normalized);

        setProfileForm({
          name: normalized.name,
          username: normalized.username,
          location: normalized.location,
          bio: normalized.bio,
          category: normalized.category.join(", "),
        });
      });
    }
  }, [username, models, fetchModelDetails]);

  if (!currentModel) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f7fb] text-sm text-[#756d80]">
        Loading model profile...
      </div>
    );
  }

  /* =========================================================
     PROFILE IMAGE
  ========================================================= */

  const handleProfileImage = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    await updateProfileImage(currentModel.id, file);
  };

  /* =========================================================
     SAVE PROFILE
  ========================================================= */

  const saveProfile = async () => {
    await updateModel(currentModel.id, {
      name: profileForm.name,
      username: profileForm.username,
      location: profileForm.location,
      bio: profileForm.bio,
      categories: profileForm.category
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });

    setEditProfile(false);
  };

  /* =========================================================
     PUBLISH POST
  ========================================================= */

  const publishPost = async () => {
    if (!postForm.files.length) {
      alert("Please select an image or video");
      return;
    }

    await addPost(currentModel.id, {
      files: postForm.files,
      caption:
        postForm.caption ||
        (postForm.mediaType === "video"
          ? "New video post"
          : "New post"),
      mediaType: postForm.mediaType,
    });

    setPostForm({
      media: [],
      mediaType: "image",
      caption: "",
      files: [],
    });

    setShowPostModal(false);
  };

  /* =========================================================
     EDIT POST
  ========================================================= */

  const startEditPost = (post) => {
    setEditingPost(post);

    setPostForm({
      media:
        post.type === "video"
          ? [post.video || post.image]
          : [post.image || post.video],
      mediaType: post.type === "video" ? "video" : "image",
      caption: post.caption,
      files: [],
    });

    setShowPostModal(true);
  };

  const saveEditedPost = async () => {
    await updatePost(currentModel.id, editingPost.id, {
      files: postForm.files,
      caption: postForm.caption,
      mediaType: postForm.mediaType,
    });

    setEditingPost(null);

    setPostForm({
      media: [],
      mediaType: "image",
      caption: "",
      files: [],
    });

    setShowPostModal(false);
  };

  /* =========================================================
     SET DEFAULT MODEL
  ========================================================= */

  const handleSetDefault = async () => {
    try {
      const modelId = currentModel._id || currentModel.id;

      if (!modelId) {
        console.error("No model ID found:", currentModel);
        return;
      }

      const updatedModel = await setDefaultModel(modelId);

      if (updatedModel) {
        setModel(normalizeModel(updatedModel));
      }
    } catch (error) {
      console.error(
        "Failed to set default model:",
        error.response?.data || error
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6fa] text-[#29242f]">

      {/* =====================================================
          TOP NAVIGATION
      ====================================================== */}

      <header className="sticky top-0 z-40 border-b border-[#e9e5ee] bg-[#f7f6fa]/90 backdrop-blur-xl">

        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 sm:px-8">

          <div className="flex items-center gap-4">

            <div>
              <p className="text-[9px] hidden sm:block font-semibold uppercase tracking-[0.2em] text-[#9b93a3]">
                Studio
              </p>

              <h1 className="text-sm font-semibold text-[#302a38]">
                Model profile
              </h1>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden items-center gap-2 rounded-full border border-[#e6e1eb] bg-white px-3 py-1.5 sm:flex">

              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  currentModel.isDefault
                    ? "bg-emerald-500"
                    : "bg-[#b8b1c0]"
                }`}
              />

              <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#77707e]">
                {currentModel.isDefault
                  ? "Active profile"
                  : "Inactive profile"}
              </span>

            </div>

            <button
              onClick={() => setShowPostModal(true)}
              className="flex items-center gap-2 rounded-xl bg-[#7658c9] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(118,88,201,0.2)] transition hover:-translate-y-0.5 hover:bg-[#684db5]"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">
                New post
              </span>
            </button>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-[1400px] px-5 py-6 sm:px-8 sm:py-8">

        {/* =================================================
            PROFILE HEADER
        ================================================== */}

        <section className="overflow-hidden rounded-3xl border border-[#e8e3ec] bg-white shadow-[0_15px_50px_rgba(55,45,70,0.05)]">

          {/* Cover */}

          <div className="relative h-36 overflow-hidden bg-[#7658c9] sm:h-44">

            <div className="absolute inset-0 bg-[linear-gradient(120deg,#7658c9,#9a84d8_45%,#d6ccef)]" />

            <div className="absolute inset-0 opacity-40">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 30%, white 0, transparent 18%), radial-gradient(circle at 80% 60%, white 0, transparent 20%)",
                }}
              />
            </div>

            <div className="absolute right-6 top-5">
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25">
                <MoreHorizontal size={18} />
              </button>
            </div>

          </div>

          {/* Profile content */}

          <div className="relative px-5 pb-6 sm:px-8">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

              {/* Avatar */}

              <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end">

                <div className="relative w-fit">

                  <img
                    src={
                      currentModel.profileImage ||
                      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"
                    }
                    alt={currentModel.name}
                    className="h-32 w-32 rounded-2xl border-4 border-white object-cover shadow-[0_12px_30px_rgba(40,30,55,0.14)] sm:h-36 sm:w-36"
                  />

                  <button
                    onClick={() =>
                      profileInputRef.current?.click()
                    }
                    className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-lg border-2 border-white bg-[#7658c9] text-white shadow-lg transition hover:bg-[#684db5]"
                  >
                    <Camera size={16} />
                  </button>

                  <input
                    ref={profileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImage}
                    className="hidden"
                  />

                </div>

                {/* Name */}

                <div className="pb-1">

                  <div className="flex items-center gap-2">

                    <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#29232f]">
                      {currentModel.name}
                    </h2>

                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7658c9]">
                      <Check
                        size={12}
                        strokeWidth={3}
                        className="text-white"
                      />
                    </span>

                  </div>

                  <p className="mt-1 text-xs text-[#928a99]">
                    @{currentModel.username}
                  </p>

                </div>

              </div>

              {/* Actions */}

              <div className="flex flex-wrap gap-2">

                <button
                  type="button"
                  onClick={handleSetDefault}
                  disabled={Boolean(currentModel.isDefault)}
                  className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                    currentModel.isDefault
                      ? "cursor-default bg-[#eeeaf3] text-[#817989]"
                      : "bg-[#7658c9] text-white shadow-[0_7px_18px_rgba(118,88,201,0.18)] hover:bg-[#684db5]"
                  }`}
                >
                  {currentModel.isDefault
                    ? "Active model"
                    : "Set as active"}
                </button>

                <button
                  type="button"
                  onClick={() => setEditProfile(true)}
                  className="flex items-center gap-2 rounded-xl border border-[#e2dce8] bg-white px-4 py-2.5 text-xs font-semibold text-[#514a59] transition hover:bg-[#f8f6fa]"
                >
                  <Edit3 size={15} />
                  Edit profile
                </button>

              </div>

            </div>

            {/* Stats */}

            <div className="mt-7 flex flex-wrap gap-8 border-t border-[#eeeaf1] pt-6">

              <Stat
                label="Posts"
                value={Number(
                  currentModel.postsCount ||
                    currentModel.posts?.length ||
                    0
                )}
              />

            </div>

            {/* Bio */}

            <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_auto]">

              <div>

                <p className="max-w-2xl text-sm leading-7 text-[#625a68]">
                  {currentModel.bio ||
                    "No profile biography has been added yet."}
                </p>

                {currentModel.location && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-[#8c8492]">

                    <MapPin size={14} />

                    {currentModel.location}

                  </div>
                )}

              </div>

              <div className="flex flex-wrap content-start gap-2">

                {(currentModel.category || []).map(
                  (category) => (
                    <span
                      key={category}
                      className="rounded-full border border-[#e2daf0] bg-[#f4f0fb] px-3 py-1.5 text-[10px] font-medium text-[#7658c9]"
                    >
                      {category}
                    </span>
                  )
                )}

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            POSTS SECTION
        ================================================== */}

        <section className="mt-10">

          <div className="mb-5 flex items-end justify-between">

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#2c2632]">
                  Content
                </h2>

                <span className="rounded-full bg-[#eeeaf5] px-2 py-0.5 text-[9px] font-semibold text-[#776e82]">
                  {currentModel.posts?.length || 0}
                </span>

              </div>

              <p className="mt-1 text-xs text-[#958c9d]">
                Manage photos and videos published to the profile.
              </p>

            </div>

            <button
              onClick={() => setShowPostModal(true)}
              className="hidden items-center gap-2 rounded-xl border border-[#e1dbe8] bg-white px-4 py-2 text-xs font-semibold text-[#554d5e] transition hover:bg-[#f8f6fa] sm:flex"
            >
              <ImagePlus size={15} />
              Upload
            </button>

          </div>

          {/* Empty */}

          {!currentModel.posts?.length ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#dcd5e4] bg-white">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0ebf8]">
                <ImagePlus
                  size={22}
                  className="text-[#7658c9]"
                />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-[#3b3441]">
                No content yet
              </h3>

              <p className="mt-2 max-w-xs text-center text-xs leading-5 text-[#958c9d]">
                Upload your first photo or video to start building the model profile.
              </p>

              <button
                onClick={() => setShowPostModal(true)}
                className="mt-5 rounded-xl bg-[#7658c9] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#684db5]"
              >
                Create first post
              </button>

            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

              {(currentModel.posts || []).map((post) => {

                const isVideo =
                  post.type === "video" ||
                  Boolean(post.video);

                return (
                  <div
                    key={post.id}
                    className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#eeeaf2]"
                  >

                    {isVideo ? (
                      <video
                        src={post.video || post.image}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                        controls
                      />
                    ) : (
                      <img
                        src={post.image}
                        alt={post.caption || "Model post"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    )}

                    {/* Video indicator */}

                    {isVideo && (
                      <div className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md">
                        <Play
                          size={12}
                          fill="currentColor"
                        />
                      </div>
                    )}

                    {/* Hover controls */}

                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/75 via-black/30 to-transparent p-3 pt-10 transition-transform duration-300 group-hover:translate-y-0">

                      <div className="flex items-center justify-between">

                        <button
                          onClick={() =>
                            startEditPost(post)
                          }
                          className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-2 text-[10px] font-medium text-white backdrop-blur-md transition hover:bg-white/25"
                        >
                          <Edit3 size={12} />
                          Edit
                        </button>

                        <button
                          onClick={async () => {
                            const confirmed =
                              window.confirm(
                                "Delete this post?"
                              );

                            if (confirmed) {
                              await deletePost(
                                currentModel.id,
                                post.id
                              );
                            }
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-red-200 backdrop-blur-md transition hover:bg-red-500/30"
                        >
                          <Trash2 size={14} />
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>

      </main>

      {/* =====================================================
          EDIT PROFILE MODAL
      ====================================================== */}

      {editProfile && (
        <Modal
          title="Edit profile"
          subtitle="Update the information displayed on the model profile."
          onClose={() => setEditProfile(false)}
        >

          <div className="space-y-5">

            <Input
              label="Name"
              value={profileForm.name}
              onChange={(value) =>
                setProfileForm({
                  ...profileForm,
                  name: value,
                })
              }
            />

            <Input
              label="Username"
              value={profileForm.username}
              onChange={(value) =>
                setProfileForm({
                  ...profileForm,
                  username: value,
                })
              }
            />

            <Input
              label="Location"
              value={profileForm.location}
              onChange={(value) =>
                setProfileForm({
                  ...profileForm,
                  location: value,
                })
              }
            />

            <Input
              label="Categories"
              value={profileForm.category}
              onChange={(value) =>
                setProfileForm({
                  ...profileForm,
                  category: value,
                })
              }
              placeholder="Fashion, Commercial, Lifestyle"
            />

            <div>

              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#777080]">
                Biography
              </label>

              <textarea
                value={profileForm.bio}
                onChange={(event) =>
                  setProfileForm({
                    ...profileForm,
                    bio: event.target.value,
                  })
                }
                rows={5}
                className="w-full resize-none rounded-xl border border-[#e2dce8] bg-[#fbfafc] p-4 text-sm text-[#332d38] outline-none transition focus:border-[#9985ce] focus:ring-4 focus:ring-[#7658c9]/[0.06]"
              />

            </div>

            <button
              onClick={saveProfile}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7658c9] py-3 text-xs font-semibold text-white shadow-[0_10px_22px_rgba(118,88,201,0.2)] transition hover:bg-[#684db5]"
            >
              <Check size={16} />
              Save changes
            </button>

          </div>

        </Modal>
      )}

      {/* =====================================================
          POST MODAL
      ====================================================== */}

      {showPostModal && (
        <Modal
          title={editingPost ? "Edit post" : "Create post"}
          subtitle={
            editingPost
              ? "Update the content and caption."
              : "Upload new content to the model profile."
          }
          onClose={() => {
            setShowPostModal(false);
            setEditingPost(null);

            setPostForm({
              media: [],
              mediaType: "image",
              caption: "",
              files: [],
            });
          }}
        >

          <div className="space-y-5">

            {/* Upload */}

            <div>

              {postForm.media.length ? (
                <div className="grid grid-cols-2 gap-3">

                  {postForm.media.map(
                    (item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="relative overflow-hidden rounded-xl border border-[#e5dfea] bg-[#f4f1f6]"
                      >

                        {postForm.mediaType ===
                        "video" ? (
                          <video
                            src={item}
                            controls
                            className="max-h-[220px] w-full object-cover"
                          />
                        ) : (
                          <img
                            src={item}
                            alt="Preview"
                            className="max-h-[220px] w-full object-cover"
                          />
                        )}

                        <button
                          onClick={() =>
                            setPostForm(
                              (current) => ({
                                ...current,
                                media:
                                  current.media.filter(
                                    (_, currentIndex) =>
                                      currentIndex !==
                                      index
                                  ),
                                files:
                                  current.files.filter(
                                    (_, currentIndex) =>
                                      currentIndex !==
                                      index
                                  ),
                              })
                            )
                          }
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md"
                        >
                          <X size={15} />
                        </button>

                      </div>
                    )
                  )}

                </div>
              ) : (
                <button
                  onClick={() =>
                    postInputRef.current?.click()
                  }
                  className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8d0df] bg-[#faf9fc] transition hover:border-[#9985ce] hover:bg-[#f7f4fb]"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eee9f7]">
                    <ImagePlus
                      size={21}
                      className="text-[#7658c9]"
                    />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-[#3d3643]">
                    Upload media
                  </p>

                  <p className="mt-1 text-xs text-[#9a91a1]">
                    Photos or videos
                  </p>

                </button>
              )}

              <input
                ref={postInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(event) => {
                  const files = Array.from(
                    event.target.files || []
                  );

                  if (!files.length) return;

                  setPostForm((current) => ({
                    ...current,
                    media: files.map((file) =>
                      URL.createObjectURL(file)
                    ),
                    mediaType: files[0].type.startsWith(
                      "video/"
                    )
                      ? "video"
                      : "image",
                    files,
                  }));
                }}
                className="hidden"
              />

            </div>

            {/* Caption */}

            <div>

              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#777080]">
                Caption
              </label>

              <textarea
                value={postForm.caption}
                onChange={(event) =>
                  setPostForm({
                    ...postForm,
                    caption: event.target.value,
                  })
                }
                rows={4}
                placeholder="Write a caption..."
                className="w-full resize-none rounded-xl border border-[#e2dce8] bg-[#fbfafc] p-4 text-sm text-[#332d38] outline-none placeholder:text-[#aaa2b0] transition focus:border-[#9985ce] focus:ring-4 focus:ring-[#7658c9]/[0.06]"
              />

            </div>

            {/* Submit */}

            <button
              onClick={
                editingPost
                  ? saveEditedPost
                  : publishPost
              }
              disabled={!postForm.media.length}
              className="w-full rounded-xl bg-[#7658c9] py-3 text-xs font-semibold text-white shadow-[0_10px_22px_rgba(118,88,201,0.2)] transition hover:bg-[#684db5] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {editingPost
                ? "Save changes"
                : "Publish post"}
            </button>

          </div>

        </Modal>
      )}

    </div>
  );
}


/* =========================================================
   STAT
========================================================= */

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-lg font-semibold tracking-[-0.02em] text-[#302a37]">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-[#99919f]">
        {label}
      </p>
    </div>
  );
}


/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>

      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#777080]">
        {label}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-[#e2dce8] bg-[#fbfafc] p-3.5 text-sm text-[#332d38] outline-none transition placeholder:text-[#aaa2b0] focus:border-[#9985ce] focus:bg-white focus:ring-4 focus:ring-[#7658c9]/[0.06]"
      />

    </div>
  );
}


/* =========================================================
   MODAL
========================================================= */

function Modal({
  title,
  subtitle,
  children,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#241d2c]/55 p-4 backdrop-blur-md">

      <div className="max-h-[90vh] w-full max-w-xl overflow-hidden rounded-3xl border border-[#e5dfea] bg-white shadow-[0_30px_100px_rgba(35,25,50,0.18)]">

        {/* Header */}

        <div className="flex items-start justify-between border-b border-[#eeeaf1] px-6 py-5">

          <div>

            <h2 className="text-base font-semibold tracking-[-0.02em] text-[#302a37]">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1 max-w-md text-xs leading-5 text-[#958c9d]">
                {subtitle}
              </p>
            )}

          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#8d8494] transition hover:bg-[#f3f0f5] hover:text-[#4e4654]"
          >
            <X size={17} />
          </button>

        </div>

        {/* Content */}

        <div className="max-h-[calc(90vh-90px)] overflow-y-auto p-6">
          {children}
        </div>

      </div>

    </div>
  );
}