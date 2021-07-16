import { nanoid, } from 'nanoid';

export default function UploadReducer(state, action) {
  switch (action.type) {
  case 'add':
    return [
      ...state,
      {
        id: nanoid(),
        started: false,
        completed: false,
        bytesUploaded: {},
        message: 'Parsing',
        file: action.payload,
      },
    ];
  case 'update':
    return state.map(item => {
      if (item.id === action.id) {
        return {
          ...item,
          ...action.payload,
        };
      }
      return item;
    });
  case 'progress':
    return state.map(item => {
      if (item.id === action.id) {
        return {
          ...item,
          bytesUploaded: {
            ...item.bytesUploaded,
            ...action.payload,
          },
        };
      }
      return item;
    });
  case 'start':
    return state.map(item => {
      if (item.id === action.id && !item.started) {
        return {
          ...item,
          started: true,
        };
      }
      return item;
    });
  default:
    return state;
  }
}