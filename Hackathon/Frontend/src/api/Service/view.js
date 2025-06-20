/** ****************************** Import libs *********************************** */
import { viewDataByApi } from "./actions";
import { URL_CONSTANTS } from "./urls";

/* Fetch Pillar Data */
export const viewPillarData = (id) => viewDataByApi(URL_CONSTANTS.pillarsView, id);
