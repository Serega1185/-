import reducer from './rootReducer';

import {createStore} from 'redux';
export const store = createStore(reducer);