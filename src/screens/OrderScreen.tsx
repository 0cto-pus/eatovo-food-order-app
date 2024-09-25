import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";
import { ApplicationState, onGetOrders, OrderModel, UserState } from "../redux";

import { ButtonWithIcon } from "../components";
import { FlatList } from "react-native-gesture-handler";

import { useNavigation } from "../utils";

import { OrderCard } from "../components/OrderCard";

interface OrderScreenProps {
  userReducer: UserState;
  onGetOrders: Function;
  navigation: { getParam: Function; goBack: Function };
}

const _OrderScreen: React.FC<OrderScreenProps> = (props) => {
  const { navigate } = useNavigation();

  const { goBack } = props.navigation;

  const { user, orders } = props.userReducer;

  useEffect(() => {
    props.onGetOrders(user);
  }, []);

  const onTapOrder = (order: OrderModel) => {
    navigate("OrderDetailPage", { order });
  };

  const orderView = () => {
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
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <ButtonWithIcon icon={require("../images/arrow_icon2.png")} onTap={() => goBack()} width={32} height={38} />
            <Text style={{ fontSize: 18, fontWeight: "600", marginLeft: 30 }}>Siparişlerim</Text>
          </View>
        </View>

        <View style={styles.body}>
          <FlatList showsVerticalScrollIndicator={false} data={orders} renderItem={({ item }) => <OrderCard item={item} onTap={() => onTapOrder(item)} />} keyExtractor={(item) => `${item._id}`} />
        </View>

        <View style={styles.footer}></View>
      </View>
    );
  };

  if (orders.length > 0) {
    return orderView();
  } else {
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
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <ButtonWithIcon icon={require("../images/arrow_icon2.png")} onTap={() => goBack()} width={32} height={38} />
            <Text style={{ fontSize: 22, fontWeight: "600", marginLeft: 30 }}>Siparişlerim</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={{ fontSize: 18, fontWeight: "500" }}>Siparişleriniz burada gözükecek.</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2" },
  navigation: { flex: 1, marginTop: 43 },
  body: { flex: 9, justifyContent: "center", alignItems: "center" },
  footer: {
    flex: 2,
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
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
  userReducer: state.userReducer,
});

const OrderScreen = connect(mapStateToProps, { onGetOrders })(_OrderScreen);

export { OrderScreen };
