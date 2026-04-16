import { ReactNode } from "react";

export const metadata = {
  title: "Turing Duel - AI in the Middle",
  description:
    "Chat with a stranger while an AI tries to take over your conversation.",
};

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div>{children}</div>;
}
