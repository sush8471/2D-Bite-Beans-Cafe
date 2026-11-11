import VerticalMarqueeDemo from "@/components/ui/marquee-03";
import App1 from "@/components/ui/app-1";

export function App1Demo() {
  return (
    <div className="h-screen w-full overflow-auto">
      <App1 />
    </div>
  );
}

export default function DemoOne() {
  return (
    <main className="min-h-screen w-full bg-[#FAF9F6] flex flex-col items-center justify-center p-4">
      <VerticalMarqueeDemo />
    </main>
  );
}

