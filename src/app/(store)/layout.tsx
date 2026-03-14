import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomTabBar from "@/components/BottomTabBar";
import { AuthProvider } from "@/context/AuthContext";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Header />
      <main className="min-h-screen">{children}</main>
      <div className="pb-20 md:pb-0">
        <Footer />
      </div>
      <BottomTabBar />
    </AuthProvider>
  );
}
