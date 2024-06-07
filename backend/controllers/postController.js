import Post from "../database/models/posts.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    res.success({ data: posts });
  } catch (error) {
    res.error({ error, status: 500 });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user._id;

    if (!content) return res.error({ message: "Some content is required." });

    const newPost = new Post({
      content,
      userId,
    });

    await newPost.save();

    res.success({ message: "Thread posted successfully." });
  } catch (error) {
    res.error({ error, status: 500 });
  }
};
