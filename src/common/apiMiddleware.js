import axios from "axios";
import get from "lodash.get";

const params = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "X-Requested-With",
    "content-type": "application/json;charset=utf-8",
  },
  crossdomain: true,
};

function createAxiosConfig(options) {
  let axiosConfig = {
    method: options.method.toLowerCase(),
    url: buildURL(options),
    withCredentials:
      options.withCredentials !== undefined ? options.withCredentials : true,
    headers: params.headers,
  };

  if (options.data !== undefined) axiosConfig.data = options.data;

  return axiosConfig;
}

function buildURL(options) {
  if (options.service === undefined) {
    if (options.url !== undefined) {
      // add false for withCredentials for static base urls
      if (!!options.staticBase && options.url.indexOf("static") > -1) {
        options.withCredentials = false;
      }
      return options.url;
    } else {
      throw "Please define 'service' for options.";
    }
  }

  let URL = window.location.origin;

  switch (options.service) {
    case "facts":
      URL = "https://catfact.ninja";
      params.headers["accept"] = "application/json";
      params.headers["X-CSRF-TOKEN"] =
        "oIkicya2G30SLWGgJLQdGzlQn31MIHZxOFVpU86h";
      return URL + "/facts" + getOptionsData(options, "endpoint");
    default:
      throw `service '${options.service}' does not exist`;
  }
}

function getOptionsData(options = "", pathToData = "", urlParam = "") {
  const optionsData = get(options, pathToData, "");
  if (optionsData) {
    return (urlParam ? urlParam : "") + optionsData;
  }
  return "";
}

function successDispatch(dispatch, axiosConfig, options, response) {
  if (options.actionTypes.success === undefined) {
    throw `Please define 'success' actionType for request ${axiosConfig.url}`;
  }

  if (typeof options.actionTypes.success === "string") {
    return dispatch({
      type: options.actionTypes.success,
      data: response.data,
      headers: {
        ...response.headers,
        status: response.status,
        input: options.input,
      },
    });
  } else if (typeof options.actionTypes.success === "function") {
    return dispatch(
      options.actionTypes.success(
        Array.isArray(response) ? response : response.data,
        {
          ...response.headers,
          status: response.status,
        }
      )
    );
  }
}

function errorDispatch(dispatch, axiosConfig, options, response) {
  if (typeof options.actionTypes.error === "string") {
    const errorData = response.response
      ? {
          status: response.response.status,
          message: response.message,
          data: response.response.data ? response.response.data : {},
        }
      : response.message;
    return dispatch({
      type: options.actionTypes.error,
      errorno: response.errno ? response.errorno : null,
      data: errorData,
    });
  } else if (typeof options.actionTypes.error === "function") {
    return dispatch(options.actionTypes.error(response));
  }
}

function apiMiddleWare({ dispatch, getState }) {
  return (next) => (action) => {
    if (!action || !next) {
      throw "No action defined in ApiMiddleWare.";
    }

    const options = action.options ? { ...action.options } : {};

    switch (action.type) {
      case "API_REQUEST": {
        if (!options.service === undefined && options.url === undefined) {
          return next(action);
        } else if (options.actionTypes === undefined) {
          throw "Please define actionTypes for API_REQUEST action";
        }
        const axiosConfig = createAxiosConfig(options);
        axios(axiosConfig)
          .then((response) =>
            successDispatch(dispatch, axiosConfig, options, response)
          )
          .catch((responseError) =>
            errorDispatch(dispatch, axiosConfig, options, responseError)
          );
        break;
      }
      default:
        return next(action);
    }

    if (options.actionTypes.loading !== undefined) {
      return typeof options.actionTypes.loading === "function"
        ? dispatch(options.actionTypes.loading())
        : dispatch({ type: options.actionTypes.loading });
    }
  };
}

export default { apiMiddleWare, buildURL, getOptionsData };
