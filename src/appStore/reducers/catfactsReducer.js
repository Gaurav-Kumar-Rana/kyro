import {
  GET_CAT_FACTS_LOADING,
  GET_CAT_FACTS_SUCESS,
  GET_CAT_FACTS_ERROR
} from "../types/catfactsActionTypes";
import get from "lodash.get";

const initialState = {};

const catFactsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CAT_FACTS_LOADING:
      return { ...initialState, loading: true };
    case GET_CAT_FACTS_SUCESS:
      return {
        ...state,
        loading: false,
        ...get(action, "data.data", true)
      };
    case GET_CAT_FACTS_ERROR:
      return { ...state, ...initialState };

    default: {
      return state;
    }
  }
};

export default catFactsReducer;
