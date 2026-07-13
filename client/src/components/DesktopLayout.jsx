import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DesktopLayout({ children, title, role = 'organizer', user }) {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar role={role} user={user} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title={title} user={user} />
        <main className="flex-1 overflow-y-auto p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
