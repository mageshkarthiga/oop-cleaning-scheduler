import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { saltAndHashPassword } from "@/utils/password";

const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                let user = null;

                // Logic to salt and hash password
                const pwHash = saltAndHashPassword(credentials.password);

                // Logic to verify if the user exists
                user = await getUserFromDb(credentials.username, pwHash);

                if (!user) {
                    throw new Error("User not found.");
                }

                // Return user object with their profile data
                return user;
            },
        }),
    ],
});

export { handlers, signIn, signOut, auth };
