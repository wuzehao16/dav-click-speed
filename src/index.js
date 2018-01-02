import dva, { connect } from 'dva';
import { Router, Route } from 'dva/router';
import fetch from 'dva/fetch';
import React from 'react';
import styled from 'styled-components';
import key from 'keymaster'
import './index.html';
import styles from './index.less';
// 1. Initialize
const app = dva();

// 2. Model
// Remove the comment and define your model.
//app.model({});

const Wrapper = styled.section`
  width: 200px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 0 20px #ccc;
`;
const Button = styled.button`
  width: 100px;
  height: 40px;
  color: palevioletred;
  font-size: 2em;
  margin: 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
  background-color: #ffffff;
`;
const Record = styled.div`
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;
  color: #ccc;
`
const Current = styled.div`
  text-align: center;
  font-size: 40px;
  padding: 40px 0;
`
const ButtonContainer = styled.div`
  text-align: center;
`;
app.model({
  namespace: 'count',
  effects: {
   *add(action, { call, put }) {
     yield call(delay, 2000);
     yield put({ type: 'minus' });
   },
 },
  state: {
    record: 0,
    current: 0,
  },
 reducers: {
   add(state) {
     const newCurrent = state.current + 1;
     return { ...state,
       record: newCurrent > state.record ? newCurrent : state.record,
       current: newCurrent,
     };
   },
   minus(state) {
     return { ...state, current: state.current - 1};
   },
 },
  subscriptions: {
   keyboardWatcher({ dispatch }) {
     key('⌘+up, ctrl+up', () => { dispatch({type:'add'}) });
   },
 },
});
function delay(timeout){
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
// 3. Router
const CountApp = ({count, dispatch}) => {
  return (
    <Wrapper>
      <Record>Highest Record: {count.record}</Record>
      <Current>{count.current}</Current>
      <ButtonContainer>
        <Button onClick={() => { dispatch({type: 'count/add'}); }}>+</Button>
      </ButtonContainer>
    </Wrapper>
  );
};
// const HomePage = () => <div>Hello Dva.</div>;
function mapStateToProps(state) {
  return { count: state.count };
}
const HomePage = connect(mapStateToProps)(CountApp);
app.router(({ history }) =>
  <Router history={history}>
    <Route path="/" component={HomePage} />
  </Router>
);

// 4. Start
app.start('#root');
