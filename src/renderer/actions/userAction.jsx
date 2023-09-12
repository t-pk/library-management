import { fetchApi } from '../utils/apiCaller';
import FETCH_USERS_SUCCESS from '../constants/actions/UserConstants';
import makeActionCreator from '../utils/makeActionCreator';


export const actGetUser = () => {
    return fetchApi(
      'https://run.mocky.io/v3/2f41b55d-45d3-4fcb-95d5-3a49aefe6bf1',
      'GET'
    ).then(
      (response) => {
        let a = [];
        let index = 0;
        // response.data.length = 3;
        let data = response.data;
        for (let i = 0; i < 10; i++) {
          data = data.concat(response.data);
        }
       

        return data;
      },
      (error) => {
        throw error;
      }
    );
  };
};

export const actDelLanguage = () => {
  return Promise.all([
    fetchApi(
      'https://run.mocky.io/v3/c89baede-c9cb-4c68-b3f8-0195537a9d6c',
      'GET'
    ),
    fetchApi(
      'https://run.mocky.io/v3/c89baede-c9cb-4c68-b3f8-0195537a9d6c',
      'GET'
    ),
  ])
    .then(() => true)
    .catch(() => {
      //console.log(err);
    });
};

export const actGetLanguage = () => {
  return fetchApi(
    'https://run.mocky.io/v3/c89baede-c9cb-4c68-b3f8-0195537a9d6c',
    'GET'
  ).then(
    () => {
      // console.log('get', response);
      return true;
    },
    (error) => {
      throw error;
    }
  );
};
