import { MobileFooter } from "./MobileFooter";
import { SideNav } from "./SideNav";
import { TopNav } from "./TopNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <SideNav />
        <main className="flex flex-1 flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-surface-container-high/50 via-background to-background pb-16 md:ml-20 md:pb-0">
          {children}
        </main>
      </div>
      <MobileFooter />
    </div>
  );
}
