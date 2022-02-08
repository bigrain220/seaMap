import {
  CHANGE_ASIDE_VISIBLE, CHANGE_BERTH,
  CHANGE_NAV_MENU_DRAWER_VISIBLE, SET_TIME_OUT,
  SET_USER,
  UNREAD_MESSAGE_NUM_CHANGE,
} from "@/store/mutations/mutations_type";
import {each} from "@/util/common";

export default {
  /**
   * 改变侧边导航栏是否显示
   * @param state
   * @param visibility boolean值
   */
  [CHANGE_ASIDE_VISIBLE](state, visibility) {
    state.asideVisible = visibility;
  },
  /**
   * 改变侧边导航栏抽屉是否显示
   * @param state
   * @param visibility boolean值
   */
  [CHANGE_NAV_MENU_DRAWER_VISIBLE](state, visibility) {
    state.navMenuDrawerVisible = visibility
  },
  /**
   * 设置用户的username和token
   * @param state
   * @param user {username,token}
   */
  [SET_USER](state, user) {
    each(user, (key, value) => {
      state.user[key] = value;
    })
  },
  /**
   * 改变未读消息的数量
   * @param state
   * @param num
   */
  [UNREAD_MESSAGE_NUM_CHANGE](state, num) {
    state.user.unreadMessageNum = num;
  },

}
