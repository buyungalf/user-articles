import PageView from "../models/pageView.model.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

export const createPageView = async (req, res) => {
  const { article } = req.body;

  if (!article || !mongoose.Types.ObjectId.isValid(article)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid article ID" });
  }

  await PageView.create({ article });

  res.status(StatusCodes.CREATED).json({ message: "Page view recorded" });
};

export const countPageViews = async (req, res) => {
  const { article, startAt, endAt } = req.query;

  const filter = {};

  if (article && mongoose.Types.ObjectId.isValid(article)) {
    filter.article = article;
  }

  if (startAt || endAt) {
    filter.viewedAt = {};

    if (startAt) {
      const start = new Date(startAt);
      if (!isNaN(start)) {
        filter.viewedAt.$gte = start;
      }
    }

    if (endAt) {
      const end = new Date(endAt);
      if (!isNaN(end)) {
        const endOfDayUTC = new Date(
          Date.UTC(
            end.getUTCFullYear(),
            end.getUTCMonth(),
            end.getUTCDate(),
            23,
            59,
            59,
            999
          )
        );
        filter.viewedAt.$lte = endOfDayUTC;
      }
    }
  }

  const count = await PageView.countDocuments(filter);
  res.status(StatusCodes.OK).json({ count });
};

const generateDateRange = (start, end, interval) => {
  const dates = [];
  const current = new Date(start);

  while (current <= end) {
    let formatted;

    if (interval === "monthly") {
      formatted = current.toISOString().slice(0, 7); // "YYYY-MM"
      current.setMonth(current.getMonth() + 1);
    } else if (interval === "hourly") {
      formatted = current.toISOString().slice(0, 13) + ":00:00Z"; // "YYYY-MM-DDTHH:00:00Z"
      current.setHours(current.getHours() + 1);
    } else {
      formatted = current.toISOString().slice(0, 10); // "YYYY-MM-DD"
      current.setDate(current.getDate() + 1);
    }

    dates.push(formatted);
  }

  return dates;
};

export const aggregatePageViewsByDate = async (req, res) => {
  const { interval = "daily", article, startAt, endAt } = req.query;

  const match = {};
  if (article && mongoose.Types.ObjectId.isValid(article)) {
    match.article = new mongoose.Types.ObjectId(article);
  }

  let start = startAt ? new Date(startAt) : null;
  let end = endAt ? new Date(endAt) : null;

  if (end && !isNaN(end)) {
    end = new Date(
      Date.UTC(
        end.getUTCFullYear(),
        end.getUTCMonth(),
        end.getUTCDate(),
        interval === "hourly" ? 23 : 23,
        interval === "hourly" ? 59 : 59,
        interval === "hourly" ? 59 : 59,
        999
      )
    );
  }

  if (start || end) {
    match.viewedAt = {};
    if (start) match.viewedAt.$gte = start;
    if (end) match.viewedAt.$lte = end;
  }

  let dateFormat;
  switch (interval) {
    case "hourly":
      dateFormat = "%Y-%m-%dT%H:00:00Z";
      break;
    case "monthly":
      dateFormat = "%Y-%m";
      break;
    case "daily":
    default:
      dateFormat = "%Y-%m-%d";
      break;
  }

  const result = await PageView.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: "$viewedAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Generate full date range list
  let paddedResult = result;
  if (start && end) {
    const range = generateDateRange(start, end, interval);

    paddedResult = range.map((date) => {
      const found = result.find((r) => r._id === date);
      return {
        _id: date,
        count: found ? found.count : 0,
      };
    });
  }

  res.status(StatusCodes.OK).json({
    interval,
    data: paddedResult,
  });
};
