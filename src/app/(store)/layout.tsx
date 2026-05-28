import Header from "@/components/Header";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import { AuthProvider } from "@/context/AuthContext";

const ChatStylist = dynamic(() => import("@/components/ChatStylist"));

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <ChatStylist />
    </AuthProvider>
  );
}
