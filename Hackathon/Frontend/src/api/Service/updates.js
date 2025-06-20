/** ****************************** Import libs *********************************** */
import { normalPutDataApi, patchDataApi, patchFormDataApi, putDataApi } from "./actions";
import { URL_CONSTANTS } from "./urls";

/* Submission */
export const updateOkrSubmission = (params, id) => putDataApi(URL_CONSTANTS.facultyCertificate, params, id);
