/** ****************************** Import libs *********************************** */
import { postDataApi, postFormApi } from './actions';
import { URL_CONSTANTS } from './urls';

/* Login */
export const loginAPI = (params) => {
  return postDataApi(URL_CONSTANTS.login, params);
};
