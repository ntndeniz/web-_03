export default {
  namespaced: true,

  state: {
    theme: localStorage.getItem('theme') || 'light',
    sidebarOpen: false,
    modal: {
      isOpen: false,
      component: null,
      props: {}
    },
    toast: {
      show: false,
      message: '',
      type: 'info', // 'success', 'error', 'warning', 'info'
      duration: 3000
    },
    loading: {
      global: false,
      requests: new Set()
    },
    breakpoints: {
      isMobile: false,
      isTablet: false,
      isDesktop: true
    }
  },

  getters: {
    currentTheme: state => state.theme,
    isSidebarOpen: state => state.sidebarOpen,
    isModalOpen: state => state.modal.isOpen,
    modalComponent: state => state.modal.component,
    modalProps: state => state.modal.props,
    toastConfig: state => state.toast,
    isLoading: state => state.loading.global || state.loading.requests.size > 0,
    breakpoints: state => state.breakpoints
  },

  mutations: {
    SET_THEME(state, theme) {
      state.theme = theme;
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    },

    TOGGLE_SIDEBAR(state, value = !state.sidebarOpen) {
      state.sidebarOpen = value;
    },

    OPEN_MODAL(state, { component, props = {} }) {
      state.modal.isOpen = true;
      state.modal.component = component;
      state.modal.props = props;
      document.body.style.overflow = 'hidden';
    },

    CLOSE_MODAL(state) {
      state.modal.isOpen = false;
      state.modal.component = null;
      state.modal.props = {};
      document.body.style.overflow = '';
    },

    SHOW_TOAST(state, { message, type = 'info', duration = 3000 }) {
      state.toast.show = true;
      state.toast.message = message;
      state.toast.type = type;
      state.toast.duration = duration;
    },

    HIDE_TOAST(state) {
      state.toast.show = false;
      state.toast.message = '';
    },

    START_LOADING(state, requestId) {
      if (requestId) {
        state.loading.requests.add(requestId);
      } else {
        state.loading.global = true;
      }
    },

    STOP_LOADING(state, requestId) {
      if (requestId) {
        state.loading.requests.delete(requestId);
      } else {
        state.loading.global = false;
      }
    },

    UPDATE_BREAKPOINTS(state, breakpoints) {
      state.breakpoints = { ...state.breakpoints, ...breakpoints };
    }
  },

  actions: {
    setTheme({ commit }, theme) {
      commit('SET_THEME', theme);
    },

    toggleSidebar({ commit }, value) {
      commit('TOGGLE_SIDEBAR', value);
    },

    openModal({ commit }, modalConfig) {
      commit('OPEN_MODAL', modalConfig);
    },

    closeModal({ commit }) {
      commit('CLOSE_MODAL');
    },

    showToast({ commit }, toastConfig) {
      commit('SHOW_TOAST', toastConfig);
      
      if (toastConfig.duration !== 0) {
        setTimeout(() => {
          commit('HIDE_TOAST');
        }, toastConfig.duration || 3000);
      }
    },

    hideToast({ commit }) {
      commit('HIDE_TOAST');
    },

    startLoading({ commit }, requestId) {
      commit('START_LOADING', requestId);
    },

    stopLoading({ commit }, requestId) {
      commit('STOP_LOADING', requestId);
    },

    updateBreakpoints({ commit }, breakpoints) {
      commit('UPDATE_BREAKPOINTS', breakpoints);
    },

    initializeUI({ commit, dispatch }) {
      // Tema başlatma
      const theme = localStorage.getItem('theme') || 'light';
      commit('SET_THEME', theme);

      // Ekran boyutu dinleyicisi
      const updateBreakpoints = () => {
        const width = window.innerWidth;
        dispatch('updateBreakpoints', {
          isMobile: width < 640,
          isTablet: width >= 640 && width < 1024,
          isDesktop: width >= 1024
        });
      };

      window.addEventListener('resize', updateBreakpoints);
      updateBreakpoints();

      // Tema değişikliği dinleyicisi
      window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
        if (localStorage.getItem('theme') === 'system') {
          commit('SET_THEME', e.matches ? 'dark' : 'light');
        }
      });
    }
  }
} 