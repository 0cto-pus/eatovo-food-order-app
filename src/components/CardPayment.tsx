import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ButtonWithTitle } from "./ButtonWithTitle";
import { CardField, CardFieldInput, PaymentMethod, useConfirmPayment } from "@stripe/stripe-react-native";
import { TextInput } from "react-native-gesture-handler";
import axios from "axios";

interface CardPaymentProps {
  onPaymentSuccess: Function;
  onPaymentFailed: Function;
  onPaymentCancel: Function;
  amount: number;
}

const CardPayment: React.FC<CardPaymentProps> = ({ onPaymentSuccess, onPaymentFailed, onPaymentCancel, amount }) => {
  const [name, setName] = useState("");
  const { confirmPayment, loading } = useConfirmPayment();

  const initPayment = async () => {
    try {
      const response = await axios.post("http://10.0.2.2:4000/create-payment-intent", {
        amount,
        currency: "try",
        paymentMethod: "card",
      });

      if (response.data) {
        const clientSecret = response.data.clientSecret;

        const { error, paymentIntent } = await confirmPayment(clientSecret, {
          paymentMethodType: "Card",
          paymentMethodData: {
            billingDetails: { name: "Customer Name" },
          },
        });

        if (error) {
          console.log("Payment failed", error.message);
          onPaymentFailed(error.message);
        } else {
          console.log("Payment successful", paymentIntent);
          onPaymentSuccess(paymentIntent);
        }
      } else {
        console.log("Server did not respond correctly.");
        onPaymentFailed("Server error.");
      }
    } catch (err) {
      console.log(err);
    }
  };

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
          <Text style={{ fontSize: 18, fontWeight: "600" }}>Ödeme yap</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={{ marginTop: 60, marginBottom: 30 }}>
          <View style={styles.amountView}>
            <Text style={{ fontSize: 18 }}> Ödenecek Toplam</Text>
            <Text style={{ fontSize: 18 }}>{amount.toFixed(2)}₺</Text>
          </View>
        </View>

        <View style={styles.creditCard}>
          <TextInput autoCapitalize="none" placeholder="Name on card" keyboardType="name-phone-pad" onChange={(value) => setName(value.nativeEvent.text)} style={styles.input} />
          <CardField placeholders={{ number: "0000 0000 0000 0000" }} onCardChange={(cardDetails) => {}} onFocus={(focusField) => {}} cardStyle={inputStyle} style={styles.cardFields} />
        </View>
        <ButtonWithTitle disable={loading} isNoBg={true} title="Ödemeyi İptal Et" onTap={onPaymentCancel} height={50} width={320} />
        <ButtonWithTitle disable={loading} title="Öde" onTap={initPayment} height={50} width={320} />
      </View>
      <View style={styles.footer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2" },
  navigation: { flex: 1, marginTop: 43 },
  body: { flex: 9 },
  footer: { flex: 2, justifyContent: "center", paddingLeft: 10, paddingRight: 10 },
  creditCard: {
    backgroundColor: "#FFF",
    marginLeft: 20,
    marginRight: 20,
    padding: 12,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 50,
    borderColor: "#D3D3D3",
    borderWidth: 5,
  },
  input: {
    height: 44,
    fontSize: 17,
    borderBottomColor: "#DEDEDE",
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  cardFields: {
    width: "100%",
    height: 50,
    marginVertical: 30,
  },
  amountView: { display: "flex", flexDirection: "row", justifyContent: "space-between", paddingLeft: 20, paddingRight: 20 },
});

const inputStyle: CardFieldInput.Styles = {
  borderWidth: 1,

  borderRadius: 8,
  fontSize: 16,
};

export { CardPayment };
