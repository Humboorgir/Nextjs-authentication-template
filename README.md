# Next.js Authentication Template

Database sessions implemented from scratch.

## signUp, signIn, signOut

Use the `useAuth` hook to perform auth-related operations. <br/>

```ts
const { signUp, signIn, signOut } = useAuth();
```

## Session info

Use the `useUser` hook to get user info on the client-side.

- (If it doesn't return a user object, it means the user is not logged in)

```ts
const { user, isLoading } = useUser();
```

<br/>

Use `getSession` to get session info on the server-side.

- (If it returns null, it means the user is not logged in)

```ts
const session = getSession(req);
```

<br/>

## Code structure

Hooks can be found under the `src/hooks` folder.
Note that the code for `useAuth` is separated into umltiple files due to its large size.

Other utility functions (such as server-side authentication utils) can be found under the `src/lib/auth` folder.

## Database

This project uses PostgreSQL (with Prisma as the ORM) to store sessions.
The Prisma schema used in the project looks like the following:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id       Int      @id @default(autoincrement())
  name     String
  email    String   @unique
  password String
  sessions Session[]
}

model Session {
  id        String   @id @default(uuid())
  userId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
}
```

### Extra note: Why not JWT?

Imagine someone somehow got access to your account on an application, and that application happened to be using JWT for authentication.
You would probably go on to change your password as soon as possible. But no matter what you do, the newly authenticated user
will NOT be logged out of your account, and there is nothing you can do about it. <br/> <br/>
Why? because JWT is stateless. The only thing it cares about is: <br/> Is the token expired? Yes or no <br/>
It does not care if you changed your password in the database.
<br/><br/>
To fix this, we're introduced to a concept called refresh token rotation. It's like a mixture of database sessions and JWT.
You have a "refresh token" that is stored on the server. And an unstored "access token" that is used to process your requests. <br/>
The "access token" is given a short expiry (15 minutes for instance), and after the "access token" is expired,
a database check takes place. If the "refresh token" is still valid, it gives you a new "access token". If not, you'll be logged out of your account.
<br/>
<br/> The good thing about this approach is that only **one** database query takes place every 15 minutes, instead of on every request. Making it great for scalability.
<br/> Bad thing is: it comes with unnecessary complexity, considering that in most cases database sessions get the job done just fine.

in short: JWT **without** refresh token rotation is a huge security risk. <br/>
And JWT **with** refresh token rotation comes with unwanted complexity. <br/>

Database sessions get the job done 99% of the time and they are much simpler to implement.
