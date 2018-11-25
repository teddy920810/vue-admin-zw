import { getOfficeInfo, getUserPermission } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, token) {
      const TOKEN = token.trim()
      return new Promise((resolve, reject) => {
        setToken(TOKEN)
        commit('SET_TOKEN', TOKEN)
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        resolve(TOKEN)
      })
    },
    // 从localStorage获取token
    GetToken({ commit }) {
      const TOKEN_KEY = 'token'
      return window.localStorage.getItem(TOKEN_KEY)
    },
    GetUserRole({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserPermission().then(response => {
          alert('11111111111111')
          const roles = response.data
          commit('SET_ROLES', roles)
          resolve(roles)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取政务号用户信息
    GetOfficeInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getOfficeInfo(state.token).then(response => {
          const data = response.data
          if (data) {
            commit('SET_NAME', 'OFFICE')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
