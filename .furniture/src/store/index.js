import { createStore } from 'vuex'
import supabase from '@/lib/supabaseClient';

export default createStore({
  state: {
    cartProducts: [],
    favoritesProducts: [],
    loading: false,
    authenticated: false,
    storageUrl: import.meta.env.VITE_STORAGE_URL
  },
  mutations: {
    setCartProducts(state, cartProducts) {
      state.cartProducts = cartProducts;
    },
    setFavoritesProducts(state, favoritesProducts) {
      state.favoritesProducts = favoritesProducts;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setAuthenticated(state, authenticated) {
      state.authenticated = authenticated;
    },
  },
  actions: {
    async fetchCart({ commit }) {
        let { data, error } = await supabase.rpc('loadCarrito')

        if (data) {
            commit('setCartProducts', data);
        }
    },
    async fetchFavorites({ commit }) {
        let { data, error } = await supabase.rpc('loadFavoritesProducts')
      
        if (data) {
            commit('setFavoritesProducts', data);
        }
    }
  },
  getters: {
    getCartProducts(state) {
      return state.cartProducts;
    },
    getFavoritesProducts(state) {
      return state.favoritesProducts;
    },
    getFavoritesProducts(state) {
      return state.favoritesProducts;
    }
  }
});