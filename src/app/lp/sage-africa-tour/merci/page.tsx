import type { Metadata } from "next";
import MerciClient from "./MerciClient";

export const metadata: Metadata = {
  title: "Inscription confirmée | Sage Africa Tour — Thalès Informatique",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MerciClient />;
}
