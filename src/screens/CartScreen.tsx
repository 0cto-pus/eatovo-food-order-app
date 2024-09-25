import React, { useState, useEffect, createRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, Alert } from "react-native";
import { connect } from "react-redux";
import { ApplicationState, ShoppingState, onUpdateCart, UserState, onCreateOrder, onApplyOffer } from "../redux";

import { FoodCardInfo } from "../components";
import { FlatList, ScrollView } from "react-native-gesture-handler";

import { checkExistence, useNavigation } from "../utils";
import { ButtonWithTitle } from "../components/ButtonWithTitle";

import PaymentTypePopup from "react-native-raw-bottom-sheet";
import { CardPayment } from "../components/CardPayment";
import { PaymentIntent } from "@stripe/stripe-react-native";

interface CartScreenProps {
  userReducer: UserState;
  shoppingReducer: ShoppingState;
  onUpdateCart: Function;
  onCreateOrder: Function;
  onApplyOffer: Function;
}

const _CartScreen: React.FC<CartScreenProps> = (props) => {
  const { navigate } = useNavigation();

  const [totalAmount, setTotalAmount] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [payableAmount, setPayableAmount] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [isPayment, setIsPayment] = useState(false);

  const { Cart, user, location, appliedOffer } = props.userReducer;

  const popupRef = createRef<PaymentTypePopup>();

  useEffect(() => {
    onCalculateAmount();
  }, [appliedOffer, Cart]);
  const showAlert = (title: string, msg: string) => {
    Alert.alert(title, msg, [
      {
        text: "OK",
        onPress: () => {
          props.onApplyOffer(appliedOffer, true);
        },
      },
    ]);
  };
  const onCalculateAmount = () => {
    let total = 0;
    if (Array.isArray(Cart)) {
      Cart.map((food) => {
        total += food.price * food.unit;
      });
    }

    const tax = (total / 100) * 0.9 + 40;

    if (total > 0) {
      setTotalTax(tax);
    }

    setTotalAmount(total);
    setPayableAmount(total + tax);
    setDiscount(0);

    if (appliedOffer._id !== undefined) {
      if (total >= appliedOffer.minValue) {
        const discount = (total / 100) * appliedOffer.offerPercentage;
        setDiscount(discount);
        const afterDiscount = total - discount;
        setPayableAmount(afterDiscount);
      } else {
        showAlert("Kupon şartları sağlanamadı", `Kuponu uygulamak için minimum tutarı karşılamalısınız: ${appliedOffer.minValue} ya da başka bir kupon kullanın.`);
      }
    }
  };

  const onTapPlaceOrder = (paymentResponse: string) => {
    props.onCreateOrder(Cart, user, paymentResponse);
    popupRef.current?.close();
    props.onApplyOffer(appliedOffer, true);
  };

  const footerContent = () => {
    return (
      <View style={{ flex: 1, display: "flex" }}>
        <TouchableOpacity
          style={[styles.row, { height: 80 }]}
          onPress={() => {
            navigate("CartOfferPage");
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#525252", marginBottom: 10 }}>Kuponlarım</Text>
            {appliedOffer._id !== undefined ? (
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#B5E83A" }}> Kupon %{appliedOffer.offerPercentage} indirim ile uygulandı. </Text>
              </View>
            ) : (
              <View>
                <Text style={{ color: "#B5E83A", fontSize: 16 }}> İndirim kuponlarına gözat! </Text>
              </View>
            )}
          </View>
          <Image source={require("../images/arrow_icon.png")} style={{ width: 40, height: 40 }} />
        </TouchableOpacity>

        <View style={[styles.row, { height: 250, justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "column" }]}>
          <Text style={{ flex: 1, fontSize: 18, fontWeight: "600", color: "#525252", marginBottom: 10 }}>Ödeme Detayları</Text>
          <View style={styles.paymentInfo}>
            <Text style={{ flex: 1, fontSize: 14 }}>Toplam:</Text>
            <Text style={{ fontSize: 16 }}>{totalAmount.toFixed(0)}₺</Text>
          </View>
          <View style={styles.paymentInfo}>
            <Text style={{ flex: 1, fontSize: 14 }}>KDV & Kurye ücreti:</Text>
            <Text style={{ fontSize: 16 }}>{totalTax.toFixed(0)}₺</Text>
          </View>
          {appliedOffer._id !== undefined && (
            <View style={styles.paymentInfo}>
              <Text style={{ flex: 1, fontSize: 14 }}>İndirim miktarı (Kupon: {appliedOffer.promoCode} ):</Text>
              <Text style={{ fontSize: 16 }}>{discount.toFixed(0)}₺</Text>
            </View>
          )}

          <View style={styles.paymentInfo}>
            <Text style={{ flex: 1, fontSize: 14 }}>Net Ücret:</Text>
            <Text style={{ fontSize: 16 }}>{payableAmount}₺</Text>
          </View>
        </View>
      </View>
    );
  };
  const popupView = () => {
    return (
      //@ts-ignore
      <PaymentTypePopup
        height={400}
        ref={popupRef}
        closeOnDragDown={true}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
          container: {
            justifyContent: "flex-start",
            alignItems: "center",
          },
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <View style={styles.paymentView}>
            <Text style={{ fontSize: 18 }}>Ödenecek miktar</Text>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>{payableAmount.toFixed(0)}₺</Text>
          </View>

          <View
            style={{
              display: "flex",
              height: 100,
              padding: 20,
              flexDirection: "row",
            }}
          >
            <Image source={require("../images/delivery_icon.png")} style={{ width: 50, height: 50 }} />
            <View>
              <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 5 }}>Teslimat adresi</Text>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#666666",
                  marginBottom: 5,
                  width: Dimensions.get("screen").width - 60,
                }}
              >{`${location.displayAddress}`}</Text>
            </View>
          </View>
          <ScrollView horizontal={true}>
            <View style={styles.paymentOptions}>
              <TouchableOpacity onPress={() => onTapPlaceOrder("COD")} style={styles.options}>
                <Image source={require("../images/door-service-icon2.png")} style={styles.icon} />
                <Text style={styles.optionText}>Kapıda ödeme</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsPayment(true)} style={styles.options}>
                <Image source={require("../images/payment-gateway-icon2.png")} style={styles.icon} />
                <Text style={styles.optionText}>Online ödeme</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </PaymentTypePopup>
    );
  };

  const onValidateOrder = () => {
    if (user !== undefined) {
      if (!user.verified) {
        navigate("LoginPage");
      } else {
        popupRef.current?.open();
      }
    } else {
      navigate("LoginPage");
    }
  };
  const cartView = () => {
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
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#2E2E2E" }}>Sepetim</Text>
            {user.token !== undefined && (
              <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={() => {
                  navigate("OrderPage");
                }}
              >
                <Image source={require("../images/orders-icon2.png")} style={{ width: 45, height: 45 }}></Image>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.body}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={Cart}
            renderItem={({ item }) => <FoodCardInfo item={checkExistence(item, Cart)} onUpdateCart={props.onUpdateCart} />}
            keyExtractor={(item) => `${item._id}`}
            ListFooterComponent={footerContent}
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.amountDetails}>
            <Text style={{ fontSize: 18 }}> Toplam</Text>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>{payableAmount}₺</Text>
          </View>
          <ButtonWithTitle height={50} width={320} title="Sipariş Ver" onTap={onValidateOrder} />
        </View>
        {popupView()}
      </View>
    );
  };

  const onPaymentSuccess = (paymentResponse: PaymentIntent.Result) => {
    if (paymentResponse.status === "Succeeded") {
      const responseString = JSON.stringify(paymentResponse);
      onTapPlaceOrder(responseString);
    } else {
      setIsPayment(false);
      showAlert("Ödeme Yapılamadı", "Ödeme başarısız oldu");
    }
  };

  const onPaymentFailed = (failedResponse: string) => {
    setIsPayment(false);
    showAlert("Ödeme başarısız oldu", "Ödeme yapılamadı!" + failedResponse);
  };

  const onPaymentCancel = () => {
    setIsPayment(false);
    showAlert("Payment Cancelled!", "Payment is failed! Due to cancelled by User!");
  };

  if (Cart.length > 0) {
    if (isPayment) {
      return <CardPayment onPaymentSuccess={onPaymentSuccess} onPaymentFailed={onPaymentFailed} onPaymentCancel={onPaymentCancel} amount={payableAmount} />;
    } else {
      return cartView();
    }
  } else {
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
              marginLeft: 20,
              marginRight: 20,
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#2E2E2E" }}>Sepetim</Text>
            {user.token !== undefined && (
              <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={() => {
                  navigate("OrderPage");
                }}
              >
                <Image source={require("../images/orders-icon2.png")} style={{ width: 45, height: 45 }}></Image>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.body}>
          <Image source={require("../images/empty-card.png")} style={{ width: 100, height: 100 }} />
          <Text style={{ fontSize: 20, fontWeight: "600" }}>Sepetiniz şu an boş görünüyor.</Text>
          <Text style={{ fontSize: 15 }}>Yemek siparişiniz için hemen seçeneklere göz at!</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2" },
  navigation: { flex: 1, marginTop: 43 },
  body: { flex: 9, justifyContent: "center", alignItems: "center" },
  footer: { flex: 2, justifyContent: "center", paddingLeft: 10, paddingRight: 10, marginBottom: 10 },
  paymentView: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    margin: 5,
    backgroundColor: "#B5E83A",
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
  row: {
    display: "flex",
    backgroundColor: "white",
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderColor: "#D3D3D3",
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  paymentInfo: { flex: 1, display: "flex", flexDirection: "row", marginTop: 10, justifyContent: "space-around", paddingLeft: 10, paddingRight: 10 },
  amountView: { display: "flex", flexDirection: "row", justifyContent: "space-between", paddingLeft: 20, paddingRight: 20 },
});

const mapStateToProps = (state: ApplicationState) => ({
  shoppingReducer: state.shoppingReducer,
  userReducer: state.userReducer,
});

const CartScreen = connect(mapStateToProps, { onUpdateCart, onCreateOrder, onApplyOffer })(_CartScreen);

export { CartScreen };
