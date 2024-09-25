import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Image, Alert } from "react-native";

import * as Location from "expo-location";

import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onUpdateLocation, UserState, ApplicationState, Address } from "../redux";

import { useNavigation } from "../utils";

const screenWidth = Dimensions.get("screen").width;

interface LandingProps {
  userReducer: UserState;
  onUpdateLocation: Function;
}

const _LandingScreen: React.FC<LandingProps> = (props) => {
  const { onUpdateLocation } = props;

  const { navigate } = useNavigation();

  const [address, setAddress] = useState<Address>();

  const [displayAddress, setDisplayAddress] = useState("Waiting for Current Location");

  const showAlert = (title: string, msg: string) => {
    Alert.alert(title, msg, [
      {
        text: "ok",
        onPress: () => {
          navigate("LocationPage");
        },
      },
    ]);
  };

  const accessDeviceLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        showAlert("Konum Yetkilendirmesi Gerekli!", "En yakın restoranları görüntüleyebilmek için lütfen uygulamaya konum yetkisi veriniz.");
        return;
      }

      let location: any = await Location.getCurrentPositionAsync({});

      const { coords } = location;

      if (coords) {
        const { latitude, longitude } = coords;

        let addressResponse: any = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        for (let item of addressResponse) {
          let currentAddress = `${item.name},${item.street}, ${item.postalCode}, ${item.subregion}`;
          const { country, city, postalCode } = item;
          setAddress(item);
          onUpdateLocation({
            displayAddress: currentAddress,
            postalCode,
            city,
            country,
          });

          setDisplayAddress(currentAddress);

          if (currentAddress.length > 0) {
            setTimeout(() => {
              navigate("homeStack");
            }, 2000);
          }

          return;
        }
      } else {
        showAlert("Konum Bulunamadı!", "Doğru konumu girdiğinizden emin olun.");
      }
    } catch (err) {
      console.log("location error " + err);
      showAlert("Konum Yetkilendirmesi Gerekli!", "En yakın restoranları görüntüleyebilmek için lütfen uygulamaya konum yetkisi veriniz.");
    }
  };

  const checkExistingLocation = async () => {
    try {
      const locationData = await AsyncStorage.getItem("user_location");

      if (locationData !== null) {
        const saveAddress = JSON.parse(locationData);
        props.onUpdateLocation(saveAddress);
        setTimeout(() => {
          navigate("homeStack");
        }, 500);
      } else {
        await accessDeviceLocation();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkExistingLocation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.navigation} />

      <View style={styles.body}>
        <Image source={require("../images/delivery_icon.png")} style={styles.deliveryIcon} />
        <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}>Your Delivery Address</Text>
        </View>
        <Text style={styles.addressText}> {displayAddress}</Text>
      </View>
      <View style={styles.footer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(242,242,242,1)",
  },
  navigation: {
    flex: 2,
  },
  body: {
    flex: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  deliveryIcon: {
    width: 120,
    height: 120,
  },
  addressContainer: {
    width: screenWidth - 100,
    borderBottomColor: "red",
    borderBottomWidth: 0.5,
    padding: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  addressTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#7D7D7D",
  },
  addressText: {
    fontSize: 20,
    fontWeight: "200",
    color: "#4F4F4F",
  },

  footer: {
    flex: 1,
  },
});

const mapToStateProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const LandingScreen = connect(mapToStateProps, { onUpdateLocation })(_LandingScreen);

export { LandingScreen };
