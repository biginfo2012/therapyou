import AuthRequired from "@/utils/client-auth-required";

export const clientRoutes = {
    path: '/client',
    redirect: "/client/appointment/list",
    component: () => import("@/layouts/full-layout/Layout"),
    beforeEnter: AuthRequired,
    children: [
        {
            name: "Appointments",
            path: "appointment/list",
            beforeEnter: AuthRequired,
            component: () =>
                import("@/views/client/AppointmentList.vue"),
        }
    ],
}