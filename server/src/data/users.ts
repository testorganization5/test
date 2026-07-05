// Seed users. Passwords are plaintext here and get hashed with bcrypt when the
// store boots (see store.ts). The demo login is john@feedme.dev / password123.

export interface SeedUser {
  id: string;
  name: string;
  email: string;
  password: string;
  bio: string;
  avatarUrl: string;
}

export const seedUsers: SeedUser[] = [
  {
    id: "u1",
    name: "John Doe",
    email: "john@feedme.dev",
    password: "password123",
    bio: "I don't know about you but I love pizza. Especially when that pizza comes with Papa John's very own garlic pizza sticks.",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "u2",
    name: "Vasya Kid",
    email: "vasya@feedme.dev",
    password: "password123",
    bio: "Home cook, weekend baker, and enthusiastic soup taster.",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
  },
];
