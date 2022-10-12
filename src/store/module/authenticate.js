import {poolData} from "@/constants/config"
import router from '@/router/router'
import {getLoggedUserInfo} from "../../utils/index"

var AmazonCognitoIdentity = require('amazon-cognito-identity-js')

const state = {
    userPool: [],
    authDetails: '',
    userData: '',
    cognitoUser: null,
    tokens: {
        accessToken: '',
        idToken: '',
        refreshToken: ''
    },
    username: '',
    cognitoId: '',
    errcode: '',
    attributes: [],
    authenticated: false
}

const getters = {
    getStateAttributes(state) {
        return state.attributes
    }
}

const mutations = {
    signOut(state) {
        if(state.cognitoUser != null){
            state.cognitoUser.signOut()
        }
        state.sessionToken = null
        state.authenticated = false
        state.username = ''
        state.cognitoId = ''
        state.userPool = []
        sessionStorage.setItem('userData', '');
    },
    setAttributes(state, attributes) {
        state.attributes = attributes
        state.username = state.attributes.filter(function (Obj) {
            return Obj.Name === 'email'
        })[0].Value
        state.cognitoId = state.attributes.filter(function (Obj) {
            return Obj.Name === 'sub'
        })[0].Value
        getLoggedUserInfo(state.cognitoId)
    },
    setUsername(state, payload) {
        state.username = payload
    },
    setCognitoId(state, payload) {
        state.cognitoId = payload
    },
    signIn(state) {
        state.authenticated = true
    },
    setUserPool(state) {
        state.userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
    },
    setTokens(state, payload) {
        console.log(payload)
        state.tokens.accessToken = payload.getAccessToken().getJwtToken()
        state.tokens.idToken = payload.getIdToken().getJwtToken()
        state.tokens.refreshToken = payload.getRefreshToken().getToken()
    },
    setCognitoUser(state, payload) {
        state.cognitoUser = payload
    },
    setCognitoDetails(state, authData) {
        state.authDetails = new AmazonCognitoIdentity.AuthenticationDetails(authData)
        state.userData = {Username: authData.Username, Pool: state.userPool}
        console.log(this.state.userData)
        state.cognitoUser = new AmazonCognitoIdentity.CognitoUser(state.userData)
    },
    setError(state, payload) {
        state.errcode = payload
    },
    clearError(state) {
        state.errcode = ''
    }
}

const actions = {
    signIn({state, commit, dispatch}, authData) {
        commit('clearError')
        commit('setUserPool')
        commit('setCognitoDetails', authData)
        state.cognitoUser.authenticateUser(state.authDetails, {
            onSuccess: (result) => {
                console.log('sign in success')
                commit('setTokens', result)
                commit('signIn')
                dispatch('getUserAttributes')
                dispatch('setLogoutTimer', 3600)
            },
            onFailure: (err) => {
                console.log('sign in failure')
                commit('setError', JSON.stringify(err.code))
            }
        })
    },
    tryAutoSignIn({state, commit, dispatch}) {
        commit('setUserPool')
        let cognitoUser = state.userPool.getCurrentUser()
        if (cognitoUser != null) {
            commit('setCognitoUser', cognitoUser)
            state.cognitoUser.getSession(function (err, session) {
                if (err) {
                    console.error(JSON.stringify(err))
                } else {
                    commit('setTokens', session)
                    commit('signIn')
                    dispatch('getUserAttributes')
                    dispatch('setLogoutTimer', 3600)
                }
            })
        }
    },
    // eslint-disable-next-line no-unused-vars
    getUserAttributes({commit, dispatch}) {
        state.cognitoUser.getUserAttributes(function (err, attributes) {
            if (err) {
                console.error(JSON.stringify(err))
            } else {
                commit('setAttributes', attributes)
            }
        })
    },
    // eslint-disable-next-line no-unused-vars
    setLogoutTimer({state, commit, dispatch}, expirationTime) {
        setTimeout(() => {
            dispatch('signOut')
        }, expirationTime * 1000)
    },
    signOut({commit}) {
        commit('signOut')
        router.push('/login')
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
