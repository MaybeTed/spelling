import store from '../../store';
import axios from 'axios';

const Actions = {};

Actions.fetchUser = async () => {
  const response = await axios.get('/api/user');
  store.dispatch({
    type: 'FETCH_USER',
    payload: response.data
  });
}

Actions.populateProfile = async (username) => {
  const response = await axios.get(`/api/profile?name=${username}`);
  store.dispatch({
    type: 'FETCH_PROFILE',
    payload: response.data
  });
}

export default Actions;
