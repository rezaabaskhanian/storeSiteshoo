import { StyleSheet, Text, View ,ActivityIndicator} from 'react-native'
import React from 'react'
import AddToCart  from './AddToCart'
import RemoveToCart  from './RemoveToCart'
const ShowModal = (props) => {
    const data =props.data
    const count =props.count
 
  return (
    <View style={styles.container}>
        <View style={styles.viwMain}>
        <View style={styles.viwAdd}>
              <AddToCart addAction={props.onPressAdd}/>
              {!data.lazy ? <Text style={styles.txtadd}>{count}</Text> :
                                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                        <ActivityIndicator size={28} />
                                    </View>}
              <RemoveToCart count={count} removeAction={props.onPressRemove}/>
                            </View>
        </View>
        <View style={styles.viwBottom} />
    </View>
  )
}

export default ShowModal

const styles = StyleSheet.create({
    container: { position: 'absolute',
         width: '100%', height: '100%',
          zIndex: 2000 
        },
        viwMain:{
            position: 'absolute',
            top: 5,
            left: 5,
            right: 5,
            backgroundColor: 'white',
            borderRadius: 4,
            elevation: 2,
            zIndex: 2002,
            alignItems: 'center',
            justifyContent: 'center'
        },
        viwAdd:{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            width: 80,
            justifyContent: 'space-between'
        },
        txtadd:{
            fontFamily: 'Iranian_Sans',
            fontWeight: 'bold',
             color: 'black',
        fontSize: 12,
        textAlign: 'center',
        alignSelf: 'center',
        padding: 5                    
            },
            viwBottom :{
                position: 'absolute', width: '100%', 
                height: '100%',
                backgroundColor: 'gray',
                 opacity: 0.4,
                  zIndex: 2000
            }



   
})