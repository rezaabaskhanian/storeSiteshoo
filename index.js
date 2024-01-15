/**
 * @format
 */
import {
    AppRegistry,
    SafeAreaView,
    AsyncStorage
} from 'react-native'
import App from './src/App';
import React from 'react'
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper'
import { name as appName } from './app.json'
import StyleSheet from 'react-native-extended-stylesheet'
import color from 'color'
import Axios from 'axios'
import { Root } from 'native-base'
import { initial } from 'react-beep'
import initBeep from './src/store/initBeep.json'
import { config } from './src/App'
initial(initBeep)

const theme = {
    ...DefaultTheme
    // fonts:{
    //   regular:  ,
    //   medium: ,
    //   light: ,
    //   thin:
    // }
}

async function configs() {

    await
        await StyleSheet.build({
            $GrayColor: 'rgb(231,231,231)',
            $MainColor: color('#43B02A').toString(),
            $BackgroundColor: color('white').toString(),
            $RedColor: color('#ee2024')
                // .lighten(0.85)
                .toString(),

            '@media ios': {
                $IRANYekanBold: 'IRANYekanMobile(FaNum)',
                $IRANYekanRegular: 'IRANYekanMobile(FaNum)',
                $IRANYekanLight: 'IRANYekanMobile(FaNum)',
                $WeightBold: 'bold',
                $WeightRegular: 'normal',
                $WeightLight: '100'
            },
            '@media android': {
                $IRANYekanBold: 'IRANYekanBold',
                $IRANYekanRegular: 'IRANYekanRegular',
                $IRANYekanLight: 'IRANYekanLight',
                $WeightBold: 'normal',
                $WeightRegular: 'normal',
                $WeightLight: 'normal'
            }
        })

    AsyncStorage.getItem('token').then(token => {
        Axios.defaults.headers = {
            Authorization: 'Bearer ' + token
        }
    })

    StyleSheet.build({
        $GrayColor: 'rgb(231,231,231)',
        $MainColor: color('#43B02A').toString(),
        $BackgroundColor: color('white').toString(),
        $RedColor: color('#ee2024')
            //.lighten(0.85)
            .toString(),
        '@media ios': {
            $IRANYekanBold: 'IRANYekanMobile(FaNum)',
            $IRANYekanRegular: 'IRANYekanMobile(FaNum)',
            $IRANYekanLight: 'IRANYekanMobile(FaNum)',
            $WeightBold: 'bold',
            $WeightRegular: 'normal',
            $WeightLight: '100'
        },
        '@media android': {
            $IRANYekanBold: 'IRANYekanBold',
            $IRANYekanRegular: 'IRANYekanRegular',
            $IRANYekanLight: 'IRANYekanLight',
            $WeightBold: 'normal',
            $WeightRegular: 'normal',
            $WeightLight: 'normal'
        }
    })
}

class AppWithProviders extends React.Component {
    constructor(props) {
        super(props)

        this.getModules()

    }
    getModules = () => {
        Axios.get(config.BaseUrl + '/api/features/get_modules').then((data) => {
            configs()
            AsyncStorage.setItem('theme', (data.data.THEME).toString())
        })
    }


    render() {
        return (
            <PaperProvider theme={theme}>
                <Root>
                    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                        <App />
                    </SafeAreaView>
                </Root>
            </PaperProvider>

        )
    }
}

AppRegistry.registerComponent(appName, () => AppWithProviders);
