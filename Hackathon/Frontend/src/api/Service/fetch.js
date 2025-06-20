/** ****************************** Import libs *********************************** */
import { downloadFileApi, getListByApi, view_downloadApi, view_downloadTicketAttachment } from "./actions";
import { URL_CONSTANTS } from "./urls";

/* Pillars */
export const getAllPillarsList = (params) => getListByApi(URL_CONSTANTS.pillars, params);
