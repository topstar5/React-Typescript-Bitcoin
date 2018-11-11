import { Status } from "Models/Status";
import { IMPORT_FROM_EXCHANGE_STATUS, IState } from "./types";

const initialState: IState = {
  status: new Status(),
};

export default (state: IState = initialState, action) => {
  switch (action.type) {
    case IMPORT_FROM_EXCHANGE_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};

