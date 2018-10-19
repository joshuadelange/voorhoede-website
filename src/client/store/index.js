import Vuex from 'vuex'
import * as types from './mutation-types'
import { getData } from '../lib/get-data'

const createStore = () => {
  return new Vuex.Store({

    state: {
      showGrid: false,
      locales: ['nl', 'en'],
      currentLocale: process.env.DEFAULT_LOCALE,
      menu: {
        nl: [
          {
            title: 'Services',
            slug: 'services',
          },
          {
            title: 'Cases',
            slug: 'cases',
          },
          {
            title: 'Blog',
            slug: 'blog',
          },
          {
            title: 'Over Ons',
            slug: 'about-us',
          },
          {
            title: 'Contact',
            slug: 'contact',
            button: true,
          }
        ],
        en: [
          {
            title: 'Services',
            slug: 'services',
          },
          {
            title: 'Cases',
            slug: 'cases',
          },
          {
            title: 'Blog',
            slug: 'blog',
          },
          {
            title: 'About Us',
            slug: 'about-us',
          },
          {
            title: 'Contact',
            slug: 'contact',
            button: true,
          }
        ]
      },
    },
    getters: {
      alternateLocale: state => {
        return state.locales.find(locale => locale !== state.currentLocale)
      },
      localizedMenuItems: state => state.menu[state.currentLocale]
    },
    actions: {
      async getData({ commit, getters, state }, { route }) {

        try {
          const data = await getData(route.path)

          const alternateParentSlug = data.alternateParent ? `/${data.alternateParent.slug}` : ''
          const alternateSlug = (data.alternate && !state.locales.includes(data.alternate.slug)) ? `/${data.alternate.slug}` : ''
          const url = `/${getters.alternateLocale}${alternateParentSlug}${alternateSlug}/`

          commit(types.SET_ALTERNATE_URL, { url })
          return data
        } catch (e) {
          console.error(e) // eslint-disable-line no-console
          throw e
        }
      },
      nuxtServerInit({ commit }, { params }) {
        commit(types.SET_CURRENT_LOCALE, { locale: params.locale })
      },
      setCurrentLocale({ commit, dispatch }, { locale }) {
        commit(types.SET_CURRENT_LOCALE, { locale })
        dispatch('getLayoutData')
      },
      async getLayoutData({ state, commit }) {
        const currentLocale = state.currentLocale || process.env.defaultLocale
        const layout = 'default'
        const data = await getData(`${currentLocale}/layout/${layout}`)
        commit(types.SET_LAYOUT_DATA, { data })
      }
    },
    mutations: {
      [types.SHOW_GRID](state) {
        state.showGrid = true
      },
      [types.HIDE_GRID](state) {
        state.showGrid = true
      },
      [types.SET_CURRENT_LOCALE](state, { locale }) {
        state.currentLocale = locale
      },
      [types.SET_ALTERNATE_URL](state, { url }) {
        state.alternateUrl = url
      },
      [types.SET_LAYOUT_DATA](state, { data }) {
        state.layoutData = data
      }
    }
  })
}

export default createStore
