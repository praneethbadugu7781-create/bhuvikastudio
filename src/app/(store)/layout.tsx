import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { AuthProvider } from "@/context/AuthContext";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Header />
      <main className="min-h-screen pb-20 md:pb-0">{children}</main>
      <Footer />
      <BottomTabBar />
      <WhatsAppWidget />
    </AuthProvider>
  );
}
