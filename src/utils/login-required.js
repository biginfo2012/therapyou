import {isLoggedIn} from "./index"

export default (to, from, next) => {
    if (isLoggedIn()) {
        next()
    } else {
        next('/login')
    }
}