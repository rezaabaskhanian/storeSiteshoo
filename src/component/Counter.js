import React, { Component } from 'react';
import { View,Text} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet'




export default class Counter extends Component {

    state = {
        time: 60
    }

    componentDidMount() {
        this.setTimer()
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }

    setTimer() {
        this.timer = setInterval(() => {
            this.countTimes();
        }, 1000);
        this.setState({ disabledSendAgain: true })
    }
    countTimes = () => {
        if (this.state.time <= 0) {
            clearInterval(this.clock);
            this.setState({ disabledSendAgain: false, timer: 120 })
            this.props.counterGone()

        } else {
            this.setState((prevstate) => ({ time: prevstate.time - 1 }));
        }
    };

    render() {
        return (
            <View style={{
                flexDirection: 'row',
                padding: '1%'
            }}>
                {/*<Text style={{...styles.TextLight , fontSize:12}}>کد به شماره شما تا {this.state.time} ثانیه دیگر ارسال می شود</Text>*/}
                <Text style={{...styles.TextLight , fontSize:12}}>امکان درخواست مجدد کد تا {this.state.time} ثانیه دیگر</Text>
            </View>
        );
    }


}

const styles = StyleSheet.create({

    TextLight: {
        fontFamily: '$IRANYekanLight'
    },
})




