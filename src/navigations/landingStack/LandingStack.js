import {
    createStackNavigator,
    createAppContainer,
    createBottomTabNavigator,
    createSwitchNavigator
} from 'react-navigation'
import * as NooteScreen from '../../screens/App/Notebook'
import { Landing } from '../../screens/Landing'
import LandingPage from '../../screens/LandingPage/LandingPage'
import * as HomeScreens from '../../screens/App/Home'
import { AuthScreen } from '../../screens'
export default LandingModule = createStackNavigator(
    {
        Landing: Landing,
        LandingPage: LandingPage,
        StoreProducts: HomeScreens.StoreProducts,
        ProductSubCats: HomeScreens.ProductSubCats,
        IntroPage: AuthScreen.IntroPage,
    },
    {
        initialRouteName: 'Landing',
        headerMode: 'none'
    }
)