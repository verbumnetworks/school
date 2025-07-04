import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import  {  UserModel } from "@/models"

 const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if(!credentials) return null;
        if (!credentials.username || !credentials.password) {
          return null
        }
        const user = await UserModel.findOne({ username: credentials.username }).select("+password").lean()
        
        if (!user) return null;
        
        const isValid = await compare(credentials.password, user.password)
        if (!isValid) return null

        return {
          id: user._id.toString(),
          name: `${user.firstName} ${user.surname}`,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
}
export default authOptions;