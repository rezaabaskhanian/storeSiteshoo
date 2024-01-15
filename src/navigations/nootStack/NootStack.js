import {
    createStackNavigator,
    createAppContainer,
    createBottomTabNavigator,
    createSwitchNavigator
} from 'react-navigation'
import * as NooteScreen from '../../screens/App/Notebook'

export default NootStack = createStackNavigator(
    {
        Note: NooteScreen.NooteBook,
        // Cart1: CartScreens.Cart,
    },
    {
        initialRouteName: 'Note',
        headerMode: 'none'
    }
)