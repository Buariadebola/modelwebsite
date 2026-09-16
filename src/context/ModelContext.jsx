import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import api from '../services/api';

const normalizeMediaItem = (
  item,
  fallback = {}
) => {
  const media = item || fallback;

  const url =
    media.url ||
    media.secure_url ||
    media.mediaUrl ||
    media.image ||
    media.video ||
    '';

  const type =
    media.type ||
    media.mediaType ||
    (media.video ? 'video' : 'image');

  return {
    url,
    publicId:
      media.publicId ||
      media.public_id ||
      media.mediaPublicId ||
      '',
    type,
    thumbnailUrl:
      media.thumbnailUrl ||
      media.thumbnail_url ||
      '',
  };
};

const normalizePost = (post = {}) => {
  const mediaData =
    Array.isArray(post.media) &&
    post.media.length > 0
      ? post.media.map((item) =>
          normalizeMediaItem(item)
        )
      : [
          {
            url:
              post.mediaUrl ||
              post.image ||
              post.video ||
              '',
            publicId:
              post.mediaPublicId || '',
            type:
              post.mediaType ||
              (post.video ? 'video' : 'image'),
            thumbnailUrl:
              post.thumbnailUrl || '',
          },
        ];

  const primaryMedia = mediaData[0] || {
    url: '',
    type: 'image',
    publicId: '',
    thumbnailUrl: '',
  };

  const isVideo =
    primaryMedia.type === 'video';

  return {
    id: post._id || post.id,
    _id: post._id || post.id,

    media: mediaData,

    image: isVideo
      ? ''
      : primaryMedia.url,

    video: isVideo
      ? primaryMedia.url
      : '',

    type: isVideo
      ? 'video'
      : 'image',

    caption: post.caption || '',

    likes: Number(
      post.likesCount ??
        post.likes ??
        0
    ),

    likesCount: Number(
      post.likesCount ??
        post.likes ??
        0
    ),

    likedByCurrentUser:
      Boolean(
        post.likedByCurrentUser ??
          post.isLiked ??
          false
      ),

    createdAt:
      post.createdAt ||
      new Date().toISOString(),

    isPublished:
      post.isPublished ?? true,
  };
};

const normalizeModel = (
  model = {}
) => {
  const categories =
    Array.isArray(model.categories) &&
    model.categories.length
      ? model.categories
      : Array.isArray(model.category)
        ? model.category
        : [];

  const posts =
    Array.isArray(model.posts)
      ? model.posts.map((post) =>
          normalizePost(post)
        )
      : [];

  return {
    id: model._id || model.id,
    _id: model._id || model.id,

    username:
      model.username || '',

    name:
      model.name || '',

    slug:
      model.slug ||
      model.username ||
      '',

    profileImage:
      model.profileImage || '',

    location:
      model.location || '',

    bio:
      model.bio || '',

    category: categories,
    categories,

    posts,

    postsCount: Number(
      model.postsCount ??
        posts.length ??
        0
    ),

    followersCount: Number(
      model.followersCount ?? 0
    ),

    followingCount: Number(
      model.followingCount ?? 0
    ),

    totalLikes: Number(
      model.totalLikes ??
        posts.reduce(
          (total, post) =>
            total +
            Number(
              post.likesCount || 0
            ),
          0
        )
    ),

    stats: {
      posts: Number(
        model.postsCount ??
          posts.length ??
          0
      ),

      followers: Number(
        model.followersCount ?? 0
      ),

      following: Number(
        model.followingCount ?? 0
      ),

      likes: Number(
        model.totalLikes ??
          posts.reduce(
            (total, post) =>
              total +
              Number(
                post.likesCount || 0
              ),
            0
          )
      ),
    },

    availability:
      model.availability ||
      'Available',

    height:
      model.height || '',

    experience:
      model.experience || '',

    isVerified:
      Boolean(model.isVerified),

    isActive:
      model.isActive !== false,

    isDefault:
      Boolean(model.isDefault),
  };
};

const ModelContext =
  createContext(null);

export function ModelProvider({
  children,
}) {
  const [models, setModels] =
    useState([]);

    const getDefaultModel = async () => {
  try {
    const response = await api.get('/models/default');

    const model = response.data?.data?.model;

    if (!model) {
      return null;
    }

    return normalizeModel(model);
  } catch (error) {
    console.error('Failed to load default model:', error);
    return null;
  }
};

  const loadModels = async () => {
  try {
    const response = await api.get('/models');

    // Get the IDs of posts liked by the logged-in client
    let likedPostIds = [];

    try {
      const likedResponse = await api.get('/model-posts/liked');

      likedPostIds =
        likedResponse.data?.data ||
        likedResponse.data ||
        [];
    } catch (error) {
      // Guests or users without liked posts may receive an auth error
      console.warn('Could not load liked posts:', error);
    }

    const likedPostIdSet = new Set(
      likedPostIds.map((id) => String(id))
    );

    const nextModels = (
      response.data?.data?.models || []
    ).map((model) => {
      const normalizedModel = normalizeModel(model);

      return {
        ...normalizedModel,
        posts: normalizedModel.posts.map((post) => ({
          ...post,
          likedByCurrentUser: likedPostIdSet.has(
            String(post.id)
          ),
        })),
      };
    });

    setModels(nextModels);

    return nextModels;
  } catch (error) {
    console.error(
      'Failed to load models:',
      error
    );

    return [];
  }
};

  useEffect(() => {
    loadModels();
  }, []);

  const fetchModelDetails =
    async (identifier) => {
      const list =
        await loadModels();

      const target =
        list.find((model) => {
          if (!identifier)
            return false;

          return (
            model.id === identifier ||
            model._id === identifier ||
            model.username ===
              identifier ||
            model.slug === identifier
          );
        });

      const matchedModel =
        target ||
        models.find((model) => {
          if (!identifier)
            return false;

          return (
            model.id === identifier ||
            model._id === identifier ||
            model.username ===
              identifier ||
            model.slug === identifier
          );
        });

      if (!matchedModel) {
        return null;
      }

      try {
        const response =
          await api.get(
            `/models/${
              matchedModel.username ||
              matchedModel._id
            }`
          );

        const detail =
          response.data?.data
            ?.model || {};

        const posts =
          response.data?.data
            ?.posts || [];

        const normalized =
          normalizeModel({
            ...detail,
            posts,
          });

        setModels(
          (currentModels) => {
            const withoutOld =
              currentModels.filter(
                (model) =>
                  (model.id ||
                    model._id) !==
                  (normalized.id ||
                    normalized._id)
              );

            return [
              normalized,
              ...withoutOld,
            ];
          }
        );

        return normalized;
      } catch (error) {
        console.error(
          'Failed to fetch model details:',
          error
        );

        return matchedModel;
      }
    };

  const updateModel = async (
    modelId,
    updatedData
  ) => {
    if (!modelId) return null;

    const payload = {
      ...updatedData,
    };

    if (
      Array.isArray(
        payload.categories
      )
    ) {
      payload.categories =
        payload.categories;
    }

    const response =
      await api.put(
        `/admin/models/${modelId}`,
        payload
      );

    const updated =
      normalizeModel(
        response.data?.data ||
          payload
      );

    setModels(
      (currentModels) =>
        currentModels.map(
          (model) => {
            if (
              (model.id ||
                model._id) !==
              modelId
            ) {
              return model;
            }

            return updated;
          }
        )
    );

    return updated;
  };


  const setDefaultModel = async (modelId) => {
    try {
      if (!modelId) {
        throw new Error('Model ID is missing.');
      }

      const response = await api.patch(
        `/admin/models/${modelId}/default`
      );

      const updatedModel = response.data?.data?.model;

      if (!updatedModel) {
        throw new Error('Updated model was not returned by the server.');
      }

      setModels((currentModels) =>
        currentModels.map((item) => ({
          ...item,
          isDefault:
            String(item._id || item.id) === String(modelId),
        }))
      );

      return normalizeModel(updatedModel);
    } catch (error) {
      console.error(
        'Failed to set default model:',
        error.response?.data || error
      );

      throw error;
    }
  };


  const updateProfileImage =
    async (
      modelId,
      imageFile
    ) => {
      if (!modelId || !imageFile)
        return null;

      const formData =
        new FormData();

      formData.append(
        'profileImage',
        imageFile
      );

      const response =
        await api.put(
          `/admin/models/${modelId}/profile-image`,
          formData,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        );

      const updated =
        normalizeModel(
          response.data?.data ||
            {}
        );

      setModels(
        (currentModels) =>
          currentModels.map(
            (model) => {
              if (
                (model.id ||
                  model._id) !==
                modelId
              ) {
                return model;
              }

              return {
                ...model,
                ...updated,
                profileImage:
                  updated.profileImage ||
                  model.profileImage,
              };
            }
          )
      );

      return updated;
    };

  const addPost = async (
    modelId,
    post
  ) => {
    const files = Array.isArray(
      post?.files
    )
      ? post.files
      : post?.file
        ? [post.file]
        : [];

    const formData =
      new FormData();

    if (post?.caption) {
      formData.append(
        'caption',
        post.caption
      );
    }

    if (
      post?.isPublished !==
      undefined
    ) {
      formData.append(
        'isPublished',
        String(post.isPublished)
      );
    }

    files.forEach((file) => {
      formData.append(
        'media',
        file
      );
    });

    const response =
      await api.post(
        `/admin/models/${modelId}/posts`,
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      );

    const createdPost =
      normalizePost(
        response.data?.data ||
          {}
      );

    setModels(
      (currentModels) =>
        currentModels.map(
          (model) => {
            if (
              (model.id ||
                model._id) !==
              modelId
            ) {
              return model;
            }

            const nextPosts = [
              createdPost,
              ...model.posts,
            ];

            const nextCount =
              Number(
                model.postsCount ||
                  nextPosts.length ||
                  0
              );

            return {
              ...model,
              posts: nextPosts,
              postsCount: nextCount,

              totalLikes:
                nextPosts.reduce(
                  (total, item) =>
                    total +
                    Number(
                      item.likesCount ||
                        0
                    ),
                  0
                ),

              stats: {
                ...model.stats,

                posts: nextCount,

                likes:
                  nextPosts.reduce(
                    (
                      total,
                      item
                    ) =>
                      total +
                      Number(
                        item.likesCount ||
                          0
                      ),
                    0
                  ),
              },
            };
          }
        )
    );

    await fetchModelDetails(
      modelId
    );

    return createdPost;
  };

  const updatePost = async (
    modelId,
    postId,
    updatedData
  ) => {
    const files =
      Array.isArray(
        updatedData?.files
      )
        ? updatedData.files
        : updatedData?.file
          ? [updatedData.file]
          : [];

    const formData =
      new FormData();

    if (
      updatedData?.caption !==
      undefined
    ) {
      formData.append(
        'caption',
        updatedData.caption || ''
      );
    }

    if (
      updatedData?.isPublished !==
      undefined
    ) {
      formData.append(
        'isPublished',
        String(
          updatedData.isPublished
        )
      );
    }

    files.forEach((file) => {
      formData.append(
        'media',
        file
      );
    });

    const response =
      await api.put(
        `/admin/models/${modelId}/posts/${postId}`,
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      );

    const updated =
      normalizePost(
        response.data?.data ||
          {}
      );

    setModels(
      (currentModels) =>
        currentModels.map(
          (model) => {
            if (
              (model.id ||
                model._id) !==
              modelId
            ) {
              return model;
            }

            const nextPosts =
              model.posts.map(
                (post) =>
                  post.id === postId
                    ? updated
                    : post
              );

            return {
              ...model,
              posts: nextPosts,
              totalLikes:
                nextPosts.reduce(
                  (total, item) =>
                    total +
                    Number(
                      item.likesCount ||
                        0
                    ),
                  0
                ),
              stats: {
                ...model.stats,
                likes:
                  nextPosts.reduce(
                    (
                      total,
                      item
                    ) =>
                      total +
                      Number(
                        item.likesCount ||
                          0
                      ),
                    0
                  ),
              },
            };
          }
        )
    );

    await fetchModelDetails(
      modelId
    );

    return updated;
  };

  const deletePost = async (
    modelId,
    postId
  ) => {
    await api.delete(
      `/admin/models/${modelId}/posts/${postId}`
    );

    setModels(
      (currentModels) =>
        currentModels.map(
          (model) => {
            if (
              (model.id ||
                model._id) !==
              modelId
            ) {
              return model;
            }

            const remainingPosts =
              model.posts.filter(
                (post) =>
                  post.id !== postId
              );

            const nextPostCount =
              Math.max(
                (
                  model.postsCount ||
                  remainingPosts.length
                ) - 1,
                0
              );

            const totalLikes =
              remainingPosts.reduce(
                (total, post) =>
                  total +
                  Number(
                    post.likesCount ||
                      0
                  ),
                0
              );

            return {
              ...model,
              posts:
                remainingPosts,

              postsCount:
                nextPostCount,

              totalLikes,

              stats: {
                ...model.stats,
                posts:
                  nextPostCount,
                likes: totalLikes,
              },
            };
          }
        )
    );

    await fetchModelDetails(
      modelId
    );

    return true;
  };

  /*
   * LIKE POST
   */
  const likePost = async (
    postId
  ) => {
    const response =
      await api.post(
        `/model-posts/${postId}/like`
      );

    const data = response.data?.data || response.data;

    const likesCount = Number(data.likesCount ?? 0);
    const liked = Boolean(data.liked);

    setModels(
      (currentModels) =>
        currentModels.map(
          (model) => {
            const hasPost =
              model.posts.some(
                (post) =>
                  post.id === postId
              );

            if (!hasPost) {
              return model;
            }

            const nextPosts =
              model.posts.map(
                (post) =>
                  post.id === postId
                    ? {
                        ...post,
                        likes:
                          likesCount,
                        likesCount,
                        likedByCurrentUser:
                          liked,
                      }
                    : post
              );

            const totalLikes =
              nextPosts.reduce(
                (total, post) =>
                  total +
                  Number(
                    post.likesCount ||
                      0
                  ),
                0
              );

            return {
              ...model,
              posts: nextPosts,
              totalLikes,

              stats: {
                ...model.stats,
                likes: totalLikes,
              },
            };
          }
        )
    );

    return response.data;
  };

  /*
   * UNLIKE POST
   */
  const unlikePost = async (
    postId
  ) => {
    const response =
      await api.delete(
        `/model-posts/${postId}/like`
      );

    const data = response.data?.data || response.data;

  const likesCount = Number(data.likesCount ?? 0);
  const liked = Boolean(data.liked);

    setModels(
      (currentModels) =>
        currentModels.map(
          (model) => {
            const hasPost =
              model.posts.some(
                (post) =>
                  post.id === postId
              );

            if (!hasPost) {
              return model;
            }

            const nextPosts =
              model.posts.map(
                (post) =>
                  post.id === postId
                    ? {
                        ...post,
                        likes:
                          likesCount,
                        likesCount,
                        likedByCurrentUser:
                          liked,
                      }
                    : post
              );

            const totalLikes =
              nextPosts.reduce(
                (total, post) =>
                  total +
                  Number(
                    post.likesCount ||
                      0
                  ),
                0
              );

            return {
              ...model,
              posts: nextPosts,
              totalLikes,

              stats: {
                ...model.stats,
                likes: totalLikes,
              },
            };
          }
        )
    );

    return response.data;
  };

  const fetchLikedPostIds = async () => {
  try {
    const response = await api.get("/model-posts/liked");

    const data = response.data?.data || response.data;

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch liked posts:", error);
    return [];
  }
};

  /*
   * GET LIKE STATUS
   */
  const getPostLikeStatus =
    async (postId) => {
      const response =
        await api.get(
          `/model-posts/${postId}/like`
        );

      const liked =
        Boolean(
          response.data?.liked
        );

      const likesCount =
        Number(
          response.data?.likesCount ??
            0
        );

      setModels(
        (currentModels) =>
          currentModels.map(
            (model) => {
              const hasPost =
                model.posts.some(
                  (post) =>
                    post.id ===
                    postId
                );

              if (!hasPost) {
                return model;
              }

              const nextPosts =
                model.posts.map(
                  (post) =>
                    post.id ===
                    postId
                      ? {
                          ...post,
                          likes:
                            likesCount,
                          likesCount,
                          likedByCurrentUser:
                            liked,
                        }
                      : post
                );

              const totalLikes =
                nextPosts.reduce(
                  (
                    total,
                    post
                  ) =>
                    total +
                    Number(
                      post.likesCount ||
                        0
                    ),
                  0
                );

              return {
                ...model,
                posts:
                  nextPosts,
                totalLikes,
                stats: {
                  ...model.stats,
                  likes:
                    totalLikes,
                },
              };
            }
          )
      );

      return response.data;
    };

  const getTotalModelLikes =
    (model) => {
      if (!model) return 0;

      return (
        model.posts?.reduce(
          (total, post) =>
            total +
            Number(
              post.likesCount ||
                post.likes ||
                0
            ),
          0
        ) || 0
      );
    };

  const getModel = (
    username
  ) =>
    models.find(
      (model) =>
        model.username ===
          username ||
        model.slug === username
    ) || null;

  const value = useMemo(
    () => ({
      models,
      getDefaultModel,
      getModel,
      fetchModelDetails,
      updateModel,
      updateProfileImage,
      addPost,
      updatePost,
      deletePost,
      loadModels,
      setDefaultModel,

      likePost,
      unlikePost,
      getPostLikeStatus,
      getTotalModelLikes,
      fetchLikedPostIds,
    }),
    [models]
  );

  return (
    <ModelContext.Provider
      value={value}
    >
      {children}
    </ModelContext.Provider>
  );
}

export function useModels() {
  return useContext(ModelContext);
}