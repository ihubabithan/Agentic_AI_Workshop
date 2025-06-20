/** ****************************** Import libs *********************************** */
import { URL_CONSTANTS } from './urls';
import { deleteDataApi, deleteUserDataApi } from './actions';

/* Admin - User Delete */
export const deleteUser = (id) => {
  const url = URL_CONSTANTS.deleteUser.replace(':id', id);
  return deleteUserDataApi(url);
};

/* Student - Delete Profile Picture */
