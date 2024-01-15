import * as React from 'react';
import { SliderBox } from "react-native-image-slider-box";
import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

export default class BannerSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: props.data
        };
    }

    render() {
        // { console.log(this.props.data, 'this.props.data') }
        return (

            <SliderBox images={this.props.data} style={styles.img} resizeMode={'contain'} autoplay={true} circleLoop={true}/>
        )
    }
}


const styles = StyleSheet.create({
    img: {
        width: wp('90%'),
        height: hp('28%'),
        borderRadius: wp('5%'),
        marginLeft: wp('5%')
    }
});
