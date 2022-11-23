import {isLoggedIn, isLoggedInAsClient} from "./index"

export default (to, from, next) => {
    if (isLoggedIn()) {
        if(isLoggedInAsClient()){
            next()
        }
        else{
            next('/error/403')
        }
    } else {
        next('/login')
    }
}