import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { TextField } from "../components";
import { ButtonWithTitle } from "../components/ButtonWithTitle";
import { connect } from "react-redux";
import { ApplicationState, OnUserLogin, OnUserSignup, UserState, OnRequestOTP, OnVerifyOTP } from "../redux";
import { useNavigation } from "../utils";

interface LoginProps {
  OnUserLogin: Function;
  OnUserSignup: Function;
  userReducer: UserState;
  OnRequestOTP: Function;
  OnVerifyOTP: Function;
}

const _LoginScreen: React.FC<LoginProps> = ({ OnUserLogin, OnUserSignup, userReducer, OnRequestOTP, OnVerifyOTP }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("Giriş Yap");
  const [isSignup, setIsSignup] = useState(false);

  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(true);
  const [requestOtpTitle, setRequestOtpTitle] = useState("Request a new OTP in");
  const [canRequestOtp, setCanRequestOtp] = useState(false);

  let countDown: number;

  const { user } = userReducer;

  const { navigate } = useNavigation();
  useEffect(() => {
    if (user.token !== undefined) {
      if (user.verified === true) {
        navigate("CartPage");
      } else {
        setVerified(user.verified);
        onEnabledOtpRequest();
      }
    }
    return () => {
      clearInterval(countDown);
    };
  }, [user]);

  useEffect(() => {
    if (!verified) {
      OnVerifyOTP(otp, user);
    }
  }, [verified]);

  const onTapOptions = () => {
    setIsSignup(!isSignup);
    setTitle(!isSignup ? "Üye Ol" : "Giriş Yap");
  };
  const onTapAuthenticate = () => {
    if (isSignup) {
      OnUserSignup(email, phone, password);
    } else {
      OnUserLogin(email, password);
    }
  };

  const onEnabledOtpRequest = () => {
    const otpDate = new Date();
    otpDate.setTime(new Date().getTime() + 2 * 60 * 1000);
    const otpTime = otpDate.getTime();

    let countDown = setInterval(function () {
      const currentTime = new Date().getTime();
      const totalTime = otpTime - currentTime;
      let minutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((totalTime % (1000 * 60)) / 1000);

      setRequestOtpTitle(`Yeni doğrulama kodu gönderebilmek için bekle ${minutes}:${seconds}`);

      if (minutes < 1 && seconds < 1) {
        setRequestOtpTitle(`Yeni doğrulama kodu gönder`);
        setCanRequestOtp(true);
        clearInterval(countDown);
      }
    }, 1000);
  };

  const onTapVerify = () => {
    OnRequestOTP(otp, user);
  };

  const onTapRequestOTP = () => {
    setCanRequestOtp(false);
    OnVerifyOTP(otp, user);
  };

  if (!verified) {
    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <Image source={require("../images/verify.png")} style={{ width: 120, height: 120, margin: 20 }} />
          <Text style={{ fontSize: 22, fontWeight: "500", margin: 10 }}>Doğrulama</Text>
          <Text
            style={{
              fontSize: 16,
              padding: 10,
              marginBottom: 20,
              color: "#716F6F",
            }}
          >
            Doğrulama kodunu gir.
          </Text>
          <TextField isOTP={true} placeholder="••••••" onTextChange={setOtp} />
          <ButtonWithTitle title="OTP Doğrulama" onTap={onTapVerify} width={345} height={50} />
          <ButtonWithTitle title={requestOtpTitle} isNoBg={true} onTap={onTapRequestOTP} width={320} height={50} disable={!canRequestOtp} />
        </View>
        <View style={styles.footer}></View>
      </View>
    );
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
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#2E2E2E" }}>{title}</Text>
          </View>
        </View>
        <View style={styles.body}>
          <TextField placeholder="Email" onTextChange={setEmail} isSecure={false} />

          {isSignup && <TextField placeholder="Telefon Numarası" onTextChange={setPhone} isSecure={false} />}
          <TextField placeholder="Şifre" onTextChange={setPassword} isSecure={true} />

          <ButtonWithTitle title={title} height={50} width={350} onTap={onTapAuthenticate} />

          <ButtonWithTitle title={!isSignup ? "Hesabın yok mu? Tıkla Üye Ol." : "Hesabın var mı? Giriş Yap"} height={50} width={350} onTap={onTapOptions} isNoBg={true} />
        </View>
        <View style={styles.footer}></View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  navigation: { flex: 1, marginTop: 43 },
  body: { flex: 10, justifyContent: "center", alignItems: "center" },
  footer: { flex: 3 },
});

const mapStateToProps = (state: ApplicationState) => ({
  shoppingReducer: state.shoppingReducer,
  userReducer: state.userReducer,
});

const LoginScreen = connect(mapStateToProps, {
  OnUserLogin,
  OnUserSignup,
  OnRequestOTP,
  OnVerifyOTP,
})(_LoginScreen);

export { LoginScreen };
