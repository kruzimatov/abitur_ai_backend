import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  IconLayoutDashboard,
  IconBooks,
  IconClipboardList,
  IconClipboardCheck,
  IconBrain,
  IconBook,
  IconChartBar,
  IconTrophy,
  IconHistory,
  IconLogout,
  IconUsers,
  IconFileText,
  IconServer,
} from '@tabler/icons-react';
import { message } from 'antd';
import { useAuth } from '../../hooks/useAuth';

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
  roles?: Array<'student' | 'teacher' | 'admin'>;
}

interface SidebarSection {
  sectionTitle: string;
  items: SidebarItem[];
}

const sidebarMenuGroups: SidebarSection[] = [
  {
    sectionTitle: "ASOSIY",
    items: [
      { title: "Dashboard", path: "/dashboard", icon: IconLayoutDashboard, roles: ['student'] },
      { title: "Dashboard", path: "/teacher-dashboard", icon: IconLayoutDashboard, roles: ['teacher'] },
      { title: "Dashboard", path: "/admin-dashboard", icon: IconLayoutDashboard, roles: ['admin'] },
      { title: "Fanlar", path: "/subjects", icon: IconBooks, roles: ['student', 'admin'] },
      { title: "Mavzular", path: "/topics", icon: IconClipboardList, roles: ['student', 'admin'] },
    ],
  },
  {
    sectionTitle: "O'QISH",
    items: [
      { title: "Mock testlar", path: "/mock-testlar", icon: IconClipboardCheck, roles: ['student'] },
      { title: "AI Tutor", path: "/ai-tutor", icon: IconBrain, roles: ['student', 'teacher'] },
      { title: "Darsliklar", path: "/darsliklar", icon: IconBook, roles: ['student'] },
    ],
  },
  {
    sectionTitle: "O'QITUVCHI",
    items: [
      { title: "Talabalar", path: "/teacher-dashboard", icon: IconUsers, roles: ['teacher'] },
      { title: "Kontent", path: "/teacher-dashboard", icon: IconFileText, roles: ['teacher'] },
    ],
  },
  {
    sectionTitle: "BOSHQARUV",
    items: [
      { title: "Foydalanuvchilar", path: "/admin-dashboard", icon: IconUsers, roles: ['admin'] },
      { title: "Tizim", path: "/admin-dashboard", icon: IconServer, roles: ['admin'] },
    ],
  },
  {
    sectionTitle: "TAHLIL",
    items: [
      { title: "Progress", path: "/progress", icon: IconChartBar, roles: ['student'] },
      { title: "Leaderboard", path: "/leaderboard", icon: IconTrophy, roles: ['student'] },
      { title: "Tarix", path: "/history", icon: IconHistory, roles: ['student'] },
    ],
  },
];

export const Aside = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const role = user?.role ?? 'student';
  const fullName = user ? `${user.firstname} ${user.lastname}`.trim() : 'AbiturAI';
  const initials = user ? `${user.firstname[0] ?? ''}${user.lastname[0] ?? ''}`.toUpperCase() : 'A';
  const roleLabel = role === 'admin' ? 'Admin' : role === 'teacher' ? "O'qituvchi" : "O'quvchi";

  const handleLogout = async () => {
    await logout();
    message.success('Tizimdan chiqildi');
    navigate('/login', { replace: true });
  };

  return (
    <aside
      className="flex flex-col justify-between select-none"
      style={{
        width: 220,
        minHeight: '100vh',
        background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      <div>
        {/* Logo */}
        <div
          className="flex items-center gap-2.5"
          style={{ padding: '22px 20px 20px', borderBottom: '1px solid var(--border)' }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--teal)',
            }}
          >
            <IconBrain size={16} color="#07090F" />
          </div>
          <span className="font-semibold" style={{ fontSize: 16, color: 'var(--text)', letterSpacing: '-0.3px' }}>
            AbiturAI
          </span>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-5" style={{ padding: '0 12px' }}>
          {sidebarMenuGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <div
                className="uppercase font-semibold"
                style={{
                  padding: '20px 12px 8px',
                  fontSize: 10,
                  color: 'var(--text3)',
                  letterSpacing: '0.1em',
                }}
              >
                {group.sectionTitle}
              </div>
              <div className="flex flex-col gap-0.5">
                {group.items.filter((item) => !item.roles || item.roles.includes(role)).map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center justify-between relative no-underline"
                      style={{
                        padding: '9px 12px',
                        borderRadius: 'var(--r-sm)',
                        fontSize: 13,
                        color: isActive ? 'var(--teal)' : 'var(--text2)',
                        background: isActive ? 'var(--teal-dim)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        gap: 10,
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'var(--bg3)';
                          e.currentTarget.style.color = 'var(--text)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--text2)';
                        }
                      }}
                    >
                      {isActive && (
                        <div
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 6,
                            bottom: 6,
                            width: 2,
                            background: 'var(--teal)',
                            borderRadius: '0 2px 2px 0',
                          }}
                        />
                      )}
                      <div className="flex items-center gap-2.5">
                        <Icon
                          size={17}
                          // style={{ color: isActive ? 'var(--teal)' : 'var(--text3)', flexShrink: 0 }}
                        />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <span
                          className="font-semibold"
                          style={{
                            background: 'var(--red-dim)',
                            color: 'var(--red)',
                            fontSize: 10,
                            padding: '2px 7px',
                            borderRadius: 20,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div
        className="flex items-center gap-2.5"
        style={{
          padding: '12px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg)',
        }}
      >
        <div
          className="flex items-center gap-2.5"
          style={{ padding: 10, borderRadius: 'var(--r-sm)', transition: 'background 0.15s', width: '100%' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg3)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <div
            className="flex items-center justify-center font-semibold text-white flex-shrink-0"
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--teal), var(--purple))',
              fontSize: 13,
            }}
          >
            {initials || 'A'}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="font-medium" style={{ fontSize: 13, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{roleLabel}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Chiqish"
            style={{ width: 30, height: 30, borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text3)', display: 'grid', placeItems: 'center', cursor: 'pointer', flexShrink: 0 }}
          >
            <IconLogout size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};
