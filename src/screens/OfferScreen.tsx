import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { connect } from "react-redux";
import { ApplicationState, onApplyOffer, OfferModel, ShoppingState, UserState, onGetOffers } from "../redux";

import { OfferCard } from "../components";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "../utils";

interface OfferScreenProps {
  userReducer: UserState;
  shoppingReducer: ShoppingState;
  onGetOffers: Function;
  onApplyOffer: Function;
}

const _OfferScreen: React.FC<OfferScreenProps> = ({ userReducer, onGetOffers, shoppingReducer, onApplyOffer }) => {
  const { location, Cart, appliedOffer } = userReducer;
  const { offers } = shoppingReducer;
  const { navigate } = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    onGetOffers(location.postalCode).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const onTapApplyOffer = (item: OfferModel) => {
    let total = 0;
    if (Array.isArray(Cart)) {
      Cart.map((food) => {
        total += food.price * food.unit;
      });
    }
    const taxAmount = (total / 100) * 0.9 + 40;
    const orderAmount = taxAmount + total;
    if (orderAmount >= item.minValue) {
      onApplyOffer(item, false);
      showAlert("Kampanya uygulandı!", `${item.promoCode} kodu sepete uygulandı.`);
      navigate("CartPage");
    } else {
      showAlert("Bu kampanya şu an kullanılamıyor.", `Bu teklif, yalnızca ${item.minValue} tutarındaki minimum sipariş miktarı ile geçerli değildir.`);
    }
  };

  const checkIfExist = (item: OfferModel) => {
    if (appliedOffer._id !== undefined) {
      return item._id.toString() === appliedOffer._id.toString();
    }
    return false;
  };

  const showAlert = (title: string, msg: string) => {
    Alert.alert(title, msg, [{ text: "Tamam", onPress: () => {} }]);
  };

  const onTapRemoveOffer = (item: OfferModel) => {
    onApplyOffer(item, true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        {Array.isArray(offers) && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={offers}
            renderItem={({ item }) => <OfferCard onTapApply={onTapApplyOffer} onTapRemove={onTapRemoveOffer} item={item} isApplied={checkIfExist(item)} />}
            keyExtractor={(item) => `${item._id}`}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2" },
  navigation: { flex: 1, marginTop: 43 },
  body: { flex: 10, justifyContent: "center", alignItems: "center" },
  footer: { flex: 1, backgroundColor: "cyan" },
  skeletonCard: {
    width: 350,
    height: 120,
    borderRadius: 10,
    marginVertical: 10,
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  shoppingReducer: state.shoppingReducer,
  userReducer: state.userReducer,
});

const OfferScreen = connect(mapStateToProps, { onGetOffers, onApplyOffer })(_OfferScreen);

export { OfferScreen };
