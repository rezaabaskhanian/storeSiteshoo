
import {
    createStackNavigator,
    createAppContainer,
    createBottomTabNavigator,
    createSwitchNavigator
} from 'react-navigation'
import * as CartScreens from '../../screens/App/Cart'

export default CartStack = createStackNavigator(
    {
        Cart: CartScreens.Cart,
        // Cart1: CartScreens.Cart,
        CartDetail: CartScreens.CartDetail
    },
    {
        initialRouteName: 'Cart',
        headerMode: 'none'
    }
)