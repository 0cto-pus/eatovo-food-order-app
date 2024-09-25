import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Image, Alert } from "react-native";

import { connect } from "react-redux";
import { onUpdateLocation, UserState, ApplicationState, onFetchLocation, Address } from "../redux";

import { useNavigation } from "../utils";
import { ButtonWithIcon, LocationPick, LocationPickMap } from "../components";
import { Point } from "react-native-google-places-autocomplete";
import { ButtonWithTitle } from "../components/ButtonWithTitle";

const screenWidth = Dimensions.get("screen").width;

interface LocationProps {
  userReducer: UserState;
  onUpdateLocation: Function;
  onFetchLocation: Function;
}

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const _LocationScreen: React.FC<LocationProps> = (props) => {
  const { userReducer, onUpdateLocation } = props;

  const { navigate } = useNavigation();

  const [isMap, setIsMap] = useState(false);

  const [currentAddress, setCurrentAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<Address>();

  const { pickedAddress } = userReducer;

  const [region, setRegion] = useState<Region>({
    latitude: 26.9,
    longitude: 93.701,
    longitudeDelta: 0.0421,
    latitudeDelta: 0.0922,
  });
  const [address, setAddress] = useState<Address>();

  const [displayAddress, setDisplayAddress] = useState("Waiting for Current Location");

  const showAlert = (title: string, msg: string) => {
    Alert.alert(title, msg, [
      {
        text: "ok",
        onPress: () => {
          //navigate to manual add location
        },
      },
    ]);
  };

  useEffect(() => {
    if (pickedAddress !== undefined) {
      const { address_components } = pickedAddress;
      if (Array.isArray(address_components)) {
        setCurrentAddress(pickedAddress.formatted_address);

        address_components.map((item) => {
          let city = "";
          let country = "";
          let postalCode = "";

          if (item.types.filter((item) => item === "postal_code").length > 0) {
            postalCode = item.short_name;
          }
          if (item.types.filter((item) => item === "country").length > 0) {
            country = item.short_name;
          }
          if (item.types.filter((item) => item === "locality").length > 0) {
            city = item.short_name;
          }
          setSelectedAddress({
            displayAddress: pickedAddress.formatted_address,
            city,
            country,
            postalCode,
          });
        });
      }
    }
  }, [pickedAddress]);

  // Auto complete call
  const onChangeLocation = (location: Point) => {
    setRegion({
      latitude: location.lat,
      longitude: location.lng,
      longitudeDelta: 0.0421,
      latitudeDelta: 0.0922,
    });
    setIsMap(true);
  };
  //marker changed
  const onPickLocationFromMap = (newRegion: Region) => {
    setRegion(newRegion);
  };

  const onTapConfirmLocation = () => {
    props.onFetchLocation(region.latitude, region.longitude);
    if (selectedAddress?.postalCode !== undefined) {
      props.onUpdateLocation(selectedAddress);
      navigate("HomePage");
    }
  };

  const pickLocationView = () => {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, display: "flex", justifyContent: "flex-start", flexDirection: "row", marginTop: 40, marginLeft: 5 }}>
          <ButtonWithIcon icon={require("../images/arrow_icon2.png")} onTap={() => navigate("HomePage")} width={42} height={42} />
          <View style={{ display: "flex", flex: 1, marginRight: 5 }}>
            <LocationPick onChangeLocation={onChangeLocation} />
          </View>
        </View>

        <View style={styles.centerMsg}>
          <Image source={require("../images/delivery_icon.png")} style={styles.deliveryIcon} />
        </View>
      </View>
    );
  };

  const mapView = () => {
    return (
      <View style={styles.container}>
        <View style={styles.navigation}>
          <View
            style={{
              display: "flex",
              height: 60,
              justifyContent: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 4,
              paddingLeft: 10,
            }}
          >
            <ButtonWithIcon icon={require("../images/arrow_icon2.png")} onTap={() => navigate("HomePage")} width={42} height={42} />
            <View style={{ flex: 1, marginLeft: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "500", color: "#2E2E2E" }}>Haritadan konumunuzu seçin</Text>
            </View>
          </View>
        </View>
        <View style={styles.body}>
          <LocationPickMap lastLocation={region} onMarkerChanged={onPickLocationFromMap} />
        </View>
        <View style={styles.footer}>
          <View style={{ flex: 1, padding: 10, paddingLeft: 20, paddingRight: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "500", color: "#545454" }}>{currentAddress}</Text>
            <ButtonWithTitle title="Onayla" onTap={onTapConfirmLocation} width={320} height={50} />
          </View>
        </View>
      </View>
    );
  };

  if (isMap) {
    return mapView();
  } else {
    return pickLocationView();
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigation: {
    flex: 1,
    marginTop: 44,
  },
  body: {
    display: "flex",
    flex: 7.5,
  },
  deliveryIcon: {
    width: 120,
    height: 120,
    bottom: "30%",
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
    flex: 2.0,
  },
  centerMsg: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

const mapToStateProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const LocationScreen = connect(mapToStateProps, { onUpdateLocation, onFetchLocation })(_LocationScreen);

export { LocationScreen };
