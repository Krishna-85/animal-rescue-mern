import bcrypt from "bcryptjs";

export const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
  },
];

export const animals = [
  {
    name: "Tommy",
    type: "Dog",
    age: 3,
    status: "Healthy",
  },
  {
    name: "Kitty",
    type: "Cat",
    age: 2,
    status: "Injured",
  },
];

export const rescues = [
  {
    description: "Dog injured near market",
    location: "City Market",
    status: "Pending",
  },
  {
    description: "Stray cat trapped on roof",
    location: "Main Street",
    status: "In Progress",
  },
];
