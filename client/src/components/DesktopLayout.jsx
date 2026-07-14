import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function DesktopLayout({
  children,
  title,
  role,
  onRoleChange,
  user,
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar role={role} user={user} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar
          title={title}
          user={user}
          role={role}
          onRoleChange={onRoleChange}
        />
        <main className="flex-1 p-5 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
