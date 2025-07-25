import Article from "../models/article.model.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const getAllPublishedArticles = async (req, res) => {
  const articles = await Article.find({ status: "published" }).populate(
    "author",
    "username name"
  );
  res.status(StatusCodes.OK).json({ articles });
};

export const getArticleById = async (req, res) => {
  const article = await Article.findById(req.params.id).populate(
    "author",
    "username name"
  );

  if (!article) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Article not found" });
  }

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      req.user = null;
    }
  }

  if (
    article.status === "draft" &&
    (!req.user || article.author._id.toString() !== req.user.id)
  ) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Access denied to access this draft" });
  }

  res.status(StatusCodes.OK).json({ article });
};

export const createArticle = async (req, res) => {
  const { title, content, status } = req.body;

  if (!title || !content) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Title and content are required" });
  }

  const article = await Article.create({
    title,
    content,
    status: status || "draft",
    author: req.user.id,
  });

  res.status(StatusCodes.CREATED).json({ article });
};

export const updateArticle = async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Article not found" });
  }

  if (article.author.toString() !== req.user.id) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Not authorized to update" });
  }

  const { title, content, status } = req.body;
  if (title) article.title = title;
  if (content) article.content = content;
  if (status) article.status = status;
  article.updatedAt = Date.now();

  await article.save();
  res.status(StatusCodes.OK).json({ article });
};

export const deleteArticle = async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Article not found" });
  }

  if (article.author.toString() !== req.user.id) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Not authorized to delete" });
  }

  await Article.findByIdAndDelete(req.params.id);

  res.status(StatusCodes.OK).json({ message: "Article deleted" });
};
