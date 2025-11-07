import "./globals.css";
import TopBar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Football Site",
  description: "Navigation layout with topbar and sidebar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <TopBar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
