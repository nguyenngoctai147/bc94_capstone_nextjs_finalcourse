export type NavItem = {
  label: string;
  href: string;
  exact?: boolean;
  aliases?: readonly string[];
  children?: readonly NavItem[];
};
