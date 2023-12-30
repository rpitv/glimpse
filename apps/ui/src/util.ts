export enum DashboardPageCategory {
  Content = "Content",
  Organization = "Organization",
  Admin = "Admin",
}

export type DashboardPageMetadata = {
  title?: string;
  icon?: string;
  category?: DashboardPageCategory;
  visible?: () => boolean;
};
