import { NavigationActions } from '@react-navigation/native';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  try {
    _navigator.navigate(routeName, params);
  } catch (error) {
    console.error("Navigation error:", error);
  }
}

function goBack() {
  try {
    _navigator.dispatch(NavigationActions.back());
  } catch (error) {
    console.error("Navigation error:", error);
  }
}

export default {
  navigate,
  setTopLevelNavigator,
  goBack,
};