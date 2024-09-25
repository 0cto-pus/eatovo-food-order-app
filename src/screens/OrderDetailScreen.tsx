import React from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { connect } from "react-redux";
import { ApplicationState, OrderModel, UserState, onCancelOrder } from "../redux";

import { ButtonWithIcon, FoodCard } from "../components";
import { FlatList } from "react-native-gesture-handler";
import moment from "moment";

import { ButtonWithTitle } from "../components/ButtonWithTitle";

interface OrderDetailProps {
  userReducer: UserState;
  onCancelOrder: Function;
  navigation: { getParam: Function; goBack: Function };
}

const _OrderDetailScreen: React.FC<OrderDetailProps> = (props) => {
  const { goBack, getParam } = props.navigation;
  const { user } = props.userReducer;

  const order = getParam("order") as OrderModel;

  const onTapCancelOrder = () => {
    Alert.alert("Bu siparişi iptal etmek istiyor musunuz?", "İptal ücreti, şartlar ve koşullara göre uygulanabilir! \n İptal onayını size yakında göndereceğiz!", [
      { text: "Cancel", onPress: () => {}, style: "cancel" },
      {
        text: "Yes",
        onPress: () => {
          props.onCancelOrder(order, user);
          goBack();
        },
      },
    ]);
  };

  const headerCard = () => {
    return (
      <View style={{ padding: 10, alignItems: "flex-start" }}>
        <Text style={styles.orderInfo}>Sipariş zamanı: {moment(order.orderDate).format("Do MMM YY, h:mm a")}</Text>
        <Text style={styles.orderInfo}>Sipariş tutarı: {order.totalAmount}₺</Text>
      </View>
    );
  };

  const footerCard = () => {
    if (order.orderStatus.toLowerCase() === "cancelled") {
      return (
        <>
          <View style={{ marginBottom: 10, justifyContent: "center", alignItems: "center", height: 200 }}>
            <Text style={{ fontSize: 18 }}>Sipariş iptal edildi. </Text>
          </View>
        </>
      );
    } else if (order.orderStatus.toLowerCase() === "waiting") {
      return (
        <>
          <View
            style={{
              marginBottom: 10,
            }}
          >
            <ButtonWithTitle title={"Siparişi İptal Et"} onTap={() => onTapCancelOrder()} height={50} width={320} />
          </View>
        </>
      );
    } else {
      return <></>;
    }
  };

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
          <Text style={{ fontSize: 22, fontWeight: "600", marginLeft: 30 }}>Sipariş ID :{order.orderID}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={order.items}
          renderItem={({ item }) => <FoodCard item={item.food} onTap={() => {}} onUpdateCart={() => {}} unit={item.unit} />}
          keyExtractor={(item) => `${item._id}`}
          ListHeaderComponent={headerCard}
          ListFooterComponent={footerCard}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2" },
  navigation: { flex: 1, marginTop: 43 },
  body: { flex: 11, justifyContent: "center", alignItems: "center" },

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
  orderInfo: {
    fontSize: 18,
    color: "#2e2e2e",
    fontWeight: "500",
    marginBottom: 10,
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const OrderDetailScreen = connect(mapStateToProps, { onCancelOrder })(_OrderDetailScreen);

export { OrderDetailScreen };
