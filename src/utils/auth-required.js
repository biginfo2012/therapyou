import {isLoggedIn, isLoggedInAsUser} from "./index"

export default (to, from, next) => {
    if (isLoggedIn()) {
        if(isLoggedInAsUser()){
            next()
        }
        else{
            next('/error/403')
        }
    } else {
        next('/login')
    }
}