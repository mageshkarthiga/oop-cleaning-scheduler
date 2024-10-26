import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyAdminUser, verifyWorkerUser } from "../../../lib/db"; // Adjust the import based on your file structure

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
                role: { label: "Role", type: "text" }, // Optional
            },
            async authorize(credentials) {
                // Verify user based on the role
                let user;
                if (credentials.role === "Admin") {
                    user = await verifyAdminUser(credentials.username, credentials.password);
                } else if (credentials.role === "Worker") {
                    user = await verifyWorkerUser(credentials.username, credentials.password);
                }

                if (user) {
                    return user; // Return the user object
                } else {
                    return null; // Return null if authentication fails
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role; // Save user role in the token
            }
            return token;
        },
        async session({ session, token }) {
            session.user.role = token.role; // Attach role to session
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; // Support GET and POST methods
