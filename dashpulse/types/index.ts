import { Id } from '$/convex/_generated/dataModel';
import { Icons } from '@/components/icons';
import { ReactNode } from 'react';

export type Crop = {
  _id?: Id<"crops">; // optional because new crops won't have it
  name: string;
  area: number;
  revenue: number;
  production: number;
};

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface Endpoints {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  source?: string;
  icon?: keyof typeof Icons;
  method: string;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface ModelEndpointsInterface {
  endpoint: Endpoints;
  children?: ReactNode;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
