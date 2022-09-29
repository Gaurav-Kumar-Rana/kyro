import {
  GET_CAT_FACTS_LOADING,
  GET_CAT_FACTS_SUCESS,
  GET_CAT_FACTS_ERROR
} from "../types/catfactsActionTypes";

export const catFactAction = () => {
  return (dispatch, getState) => {
    dispatch({
      type: "API_REQUEST",
      options: {
        method: "GET",
        service: "facts",
        endpoint: `?limit=10`,
        actionTypes: {
          loading: GET_CAT_FACTS_LOADING,
          success: GET_CAT_FACTS_SUCESS,
          error: GET_CAT_FACTS_ERROR
        }
      }
    });
  };
};
