import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

export function Sidebar() {
  const location = useLocation();
  const userType = 'Student';

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard' },
    { to: '/student/profile', label: 'Profile' },
    { to: '/student/alumni', label: 'Browse Alumni' },
    { to: '/student/opportunities', label: 'Opportunities' },
  ];

  const alumniLinks = [
    { to: '/alumni/dashboard', label: 'Dashboard' },
    { to: '/alumni/profile', label: 'Profile' },
    { to: '/alumni/students', label: 'Browse Students' },
    { to: '/alumni/post-opportunity', label: 'Post Opportunity' },
  ];

  const links = userType === 'Student' ? studentLinks : alumniLinks;

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="">Student-Alumni Portal</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {links.map((link) => (
              <Button
                key={link.to}
                variant={location.pathname === link.to ? 'default' : 'ghost'}
                className="w-full justify-start"
                asChild
              >
                <Link to={link.to}>{link.label}</Link>
              </Button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Separator className="my-4" />
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/settings">Settings</Link>
            </Button>
            <Button variant="outline" className="w-full">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
