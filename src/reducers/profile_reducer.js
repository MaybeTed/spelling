
export default function(state = {}, action) {
  if (action.type === 'FETCH_PROFILE') {
    return action.payload;
  }
  return state;
}