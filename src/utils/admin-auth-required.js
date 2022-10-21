import {isLoggedIn, isLoggedInAsAdmin} from "./index"

export default (to, from, next) => {
    if (isLoggedIn()) {
        if(isLoggedInAsAdmin()){
            next()
        }
        else{
            next('/error/403')
        }
    } else {
        next('/login')
    }
}