import Navbar from "@/components/Navbar";
import DemoWrapper from "@/components/DemoWrapper";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      <div className="flex-1 overflow-auto">{children}</div>
      <DemoWrapper />
    </div>
  );
}
