import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { connect } from "react-redux";
import { ApplicationState, ShoppingState, onUserLogout, UserState } from "../redux";

import { ScrollView } from "react-native-gesture-handler";

import { useNavigation } from "../utils";

import { LoginScreen } from "./LoginScreen";

interface AccountScreenProps {
  userReducer: UserState;
  shoppingReducer: ShoppingState;
  onUserLogout: Function;
}

const _AccountScreen: React.FC<AccountScreenProps> = (props) => {
  const { user } = props.userReducer;
  const { navigate } = useNavigation();
  const options = [
    {
      title: "Profili düzenle",
      action: () => {
        alert("Profili düzenle");
      },
    },
    {
      title: "Siparişlerimi görüntüle",
      action: () => {
        navigate("Siparişlerimi görüntüle");
      },
    },
    {
      title: "Desteğe ulaş",
      action: () => {
        alert("Desteğe ulaş");
      },
    },
    {
      title: "Çıkış",
      action: () => {
        props.onUserLogout();
      },
    },
  ];

  const optionCard = (title: string, action: Function) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "#FFF",
          height: 80,
          justifyContent: "space-around",
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          paddingLeft: 50,
          paddingRight: 20,
          borderBottomColor: "#d3d3d3",
          borderTopColor: "#d3d3d3",
          borderTopWidth: 0.5,
          borderBottomWidth: 0.5,
        }}
        key={title}
        onPress={() => {
          action();
        }}
      >
        <Text style={{ flex: 1, fontSize: 18, color: "#525252" }}>{title}</Text>
        <Image source={require("../images/arrow_icon.png")} style={{ width: 40, height: 40 }} />
      </TouchableOpacity>
    );
  };

  if (user.token !== undefined) {
    return (
      <View style={styles.container}>
        <View style={styles.navigation}>
          <View
            style={{
              display: "flex",
              height: 60,
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <Image source={require("../images/eatovo_mascot.png")} style={{ width: 150, height: 150, marginRight: 20 }}></Image>

            <View>
              <Text style={{ fontSize: 22, fontWeight: "600" }}>{user.firstName || "Ziyaretçi"}</Text>
              <Text style={{ fontSize: 18 }}>{user.email}</Text>
            </View>
          </View>
        </View>
        <View style={styles.body}>
          <ScrollView>
            {options.map(({ title, action }) => {
              return optionCard(title, action);
            })}
          </ScrollView>
        </View>
      </View>
    );
  } else {
    return <LoginScreen />;
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2" },
  navigation: { flex: 3, marginTop: 44, padding: 10, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" },
  body: { flex: 9, displa: "flex" },
  footer: { flex: 2, justifyContent: "center", paddingLeft: 10, paddingRight: 10 },
  paymentView: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    margin: 5,
    backgroundColor: "#E3BE74",
  },
  paymentOptions: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
  },
  amountDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    margin: 5,
  },
  options: {
    display: "flex",
    flexDirection: "column",
    height: 120,
    width: 160,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    boderColor: "#A0A0A0",
    backgroundColor: "#F2F2F2",
    borderWidth: 0.2,
    borderRadius: 10,
    margin: 10,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#545252",
  },
  icon: {
    width: 115,
    height: 80,
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  shoppingReducer: state.shoppingReducer,
  userReducer: state.userReducer,
});

const AccountScreen = connect(mapStateToProps, { onUserLogout })(_AccountScreen);

export { AccountScreen };
