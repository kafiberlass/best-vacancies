// Иконки боковой панели (как на макете): список, список с галочкой, создание, выход
const base = {
  width: 30,
  height: 30,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const ListIcon = () => (
  <svg {...base}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M8 8h8M8 12h8M8 16h8" />
  </svg>
);

export const CheckListIcon = () => (
  <svg {...base}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 2.5h6v3H9z" />
    <path d="M8 10h8M8 13.5h4" />
    <path d="m12 17 1.5 1.5L16.5 15" />
  </svg>
);

export const CreateIcon = () => (
  <svg {...base}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 2.5h6v3H9z" />
    <path d="m9 17 1-3 5-5 2 2-5 5z" />
  </svg>
);

export const LogoutIcon = () => (
  <svg {...base}>
    <path d="M14 4H6v16h8" />
    <path d="M10 12h10M17 9l3 3-3 3" />
  </svg>
);

export const PeopleIcon = () => (
  <svg {...base} width={20} height={20}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
  </svg>
);
