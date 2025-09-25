import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Demo: hardcoded user
        const user = {
          id: 1,
          name: "jsmith",
          username: "jsmith",
          email: "jsmith@example.com",
          password: "password123",
        };
        if (
          credentials.username === user.username &&
          credentials.password === user.password
        ) {
          return user;
        }
        return null;
      },
    }),
  ],
};

export const getAuthSession = () => getServerSession(authOptions);
