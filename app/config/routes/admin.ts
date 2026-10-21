export const adminRoutes = {
  dashboard: "/admin",
  slider: "/admin/slider",
  rooms: "/admin/rooms",
  bookings: "/admin/bookings",
  bookingAdd: "/admin/bookings/add",
  users: "/admin/users",
  userAdd: "/admin/users/add",
  userDetail: (id: number | string) => `/admin/users/${id}`,
  profile: "/admin/profile",
  companyProfile: "/admin/settings/company-profile",
  locations: "/admin/locations",
  reviews: "/admin/reviews",
} as const;
