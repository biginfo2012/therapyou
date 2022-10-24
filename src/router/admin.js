import AuthRequired from "@/utils/admin-auth-required"

export const adminRoutes = {
    path: "/admin",
    redirect: "/admin/appointment/list",
    component: () => import("@/layouts/full-layout/Layout"),
    beforeEnter: AuthRequired,
    children: [
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
        {
            name: "Messages",
            path: "message/list",
            beforeEnter: AuthRequired,
            component: () =>
                import("@/views/admin/MessageList.vue"),
        },
    ],
}