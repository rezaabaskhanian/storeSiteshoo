import {
    createStackNavigator,
    createAppContainer,
    createBottomTabNavigator,
    createSwitchNavigator
} from 'react-navigation'

// import { StoreProfile } from "../../screens/App/Home";
import {Home,
	Stores,
	StoreProfile,
	ProductProfile,
	StoreCategory,
	StoreProducts,
	ProductSubCats} from '../../screens/App/Home/index'

export default HomeStack = createStackNavigator(
    {
         Home: StoreProfile,
        // StoreProfile: HomeScreens.StoreProfile,
        Category: Home,
        // Home: LandingPage,
        Stores: Stores,
        ProductProfile:ProductProfile ,
        StoreCategory:StoreCategory,
        StoreProducts:StoreProducts,
        ProductSubCats:ProductSubCats
    },
    {
        initialRouteName: 'Home',
        headerMode: 'none',
    }
)