interface CommonState {
  language: string;
  updateInfo: any;
  updateDismissed: boolean;
}

const initialState: CommonState = {
  language: 'en',
  updateInfo: null,
  updateDismissed: false,
};

const Common = (state = initialState, action: any): CommonState => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_UPDATE_INFO':
      return { ...state, updateInfo: action.payload };
    case 'SET_UPDATE_DISMISSED':
      return { ...state, updateDismissed: action.payload };
    default:
      return state;
  }
};

export default Common;
