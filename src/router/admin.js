import AuthRequired from "@/utils/admin-auth-required"

export const adminRoutes = {
    path: "/admin",
    redirect: "/admin/dashboard",
    component: () => import("@/layouts/full-layout/Layout"),
    beforeEnter: AuthRequired,
    children: [
        {
            name: "Dashboard",
            path: "dashboard",
            beforeEnter: AuthRequired,
            component: () =>
                import("@/views/dashboards/Dashboard.vue"),
        },
        {
            name: "Appointments",
            path: "appointment/list",
            beforeEnter: AuthRequired,
            component: () =>
                import("@/views/admin/AppointmentList.vue"),
        },
        {
            name: "Invoices",
            path: "invoice/list",
            beforeEnter: AuthRequired,
            component: () =>
                import("@/views/admin/InvoiceList.vue"),
        },
        {
            name: "Clients",
            path: "client/list",
            beforeEnter: AuthRequired,
            component: () =>
                import("@/views/admin/ClientList.vue"),
        },
        {
            name: "Therapists",
            path: "therapist/list",
            beforeEnter: AuthRequired,
            component: () =>
                import("@/views/admin/TherapistList.vue"),
        },
    ],
}