import UserService from '@/services/user.service';

export default {
  namespaced: true,

  state: {
    profile: null,
    addresses: [],
    orders: [],
    favorites: [],
    notifications: [],
    loading: false,
    error: null
  },

  mutations: {
    SET_PROFILE(state, profile) {
      state.profile = profile;
    },
    SET_ADDRESSES(state, addresses) {
      state.addresses = addresses;
    },
    ADD_ADDRESS(state, address) {
      state.addresses.push(address);
    },
    UPDATE_ADDRESS(state, updatedAddress) {
      const index = state.addresses.findIndex(a => a.id === updatedAddress.id);
      if (index !== -1) {
        state.addresses.splice(index, 1, updatedAddress);
      }
    },
    REMOVE_ADDRESS(state, addressId) {
      state.addresses = state.addresses.filter(a => a.id !== addressId);
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },

  actions: {
    async fetchProfile({ commit }) {
      try {
        commit('SET_LOADING', true);
        const response = await UserService.getProfile();
        commit('SET_PROFILE', response.data);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateProfile({ commit }, profileData) {
      try {
        commit('SET_LOADING', true);
        const response = await UserService.updateProfile(profileData);
        commit('SET_PROFILE', response.data);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async fetchAddresses({ commit }) {
      try {
        commit('SET_LOADING', true);
        const response = await UserService.getAddresses();
        commit('SET_ADDRESSES', response.data);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async addAddress({ commit }, addressData) {
      try {
        commit('SET_LOADING', true);
        const response = await UserService.addAddress(addressData);
        commit('ADD_ADDRESS', response.data);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },

  getters: {
    isProfileComplete: state => {
      if (!state.profile) return false;
      const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
      return requiredFields.every(field => !!state.profile[field]);
    },
    defaultAddress: state => {
      return state.addresses.find(address => address.isDefault);
    },
    addressById: state => id => {
      return state.addresses.find(address => address.id === id);
    }
  }
}; 