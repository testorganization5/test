import type { Comment } from "../types.js";

const TEXT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra blandit donec pellentesque ut non mauris lobortis lacras leo. Purus scelerisque id lacus et malesuada ipsum.";

export const seedComments: Comment[] = [
  {
    id: "cm1",
    targetType: "cookbook",
    targetId: "c1",
    authorId: "u2",
    text: TEXT,
    createdAt: "2021-05-01T10:00:00.000Z",
  },
  {
    id: "cm2",
    targetType: "cookbook",
    targetId: "c1",
    authorId: "u2",
    text: TEXT,
    createdAt: "2021-05-01T10:05:00.000Z",
  },
  {
    id: "cm3",
    targetType: "cookbook",
    targetId: "c1",
    authorId: "u1",
    text: TEXT,
    createdAt: "2021-05-01T10:10:00.000Z",
  },
  {
    id: "cm4",
    targetType: "recipe",
    targetId: "r1",
    authorId: "u2",
    text: TEXT,
    createdAt: "2021-05-02T09:00:00.000Z",
  },
  {
    id: "cm5",
    targetType: "recipe",
    targetId: "r1",
    authorId: "u1",
    text: TEXT,
    createdAt: "2021-05-02T09:15:00.000Z",
  },
];
