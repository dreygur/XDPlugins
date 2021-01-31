
import Vue from 'vue'
import Vuex from 'vuex'

import user from '@/store/modules/user'
import scenegraph from '@/store/modules/scenegraph'
import imageVariant from '@/store/modules/variant/imageVariant';
import copyVariant from '@/store/modules/variant/copyVariant';
import groupVariant from '@/store/modules/variant/groupVariant';
import design from '@/store/modules/design';

Vue.use(Vuex);

var store = new Vuex.Store({
  modules: {
    user,
    scenegraph,
    imageVariant,
    copyVariant,
    groupVariant,
    design,
  }
})

export default store
