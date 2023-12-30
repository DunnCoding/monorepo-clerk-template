import { SignedIn, SignedOut } from "@clerk/nextjs";

import { api } from "../trpc/server";
import styles from "./page.module.css";
import SignUpPage from "./sign-up";

export default async function Page() {
  const posts = await api.post.all.query();
  return (
    <main className={styles.main}>
      <SignedIn>{posts?.[0]?.name}</SignedIn>
      <SignedOut>
        <SignUpPage />
      </SignedOut>
    </main>
  );
}
