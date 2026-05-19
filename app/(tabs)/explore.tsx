import useCartStore from "@/store/CartSlice";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  ListRenderItem,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CartBackground from "../../assets/images/icons/cartBackground.png";
import CloseIcon from "../../assets/images/icons/delete.png";
import EmptyCar from "../../assets/images/icons/remove.png";
import WhatsAppIcon from "../../assets/images/icons/whatsapp.png";
import CartCard from "../../components/CartCard";

export default function TabTwoScreen() {
  const cart = useCartStore((state) => state.cart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalQuantity = useCartStore((state) => state.getTotalQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const theme = useCartStore((state) => state.theme);

  interface Product {
    $id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    categoryIcon: string;
  }

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [modal, setModal] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    setTotalPrice(getTotalPrice());
    setTotalQuantity(getTotalQuantity());
  }, [cart]);

  const handleModal = () => {
    setModal((prev) => !prev);
  };

  const renderProductItem: ListRenderItem<Product> = ({ item }) => (
    <CartCard item={item} />
  );

  const handleShareToWhatsApp = async () => {
    if (!address || address.trim().length === 0) {
      Alert.alert("Error", "Por favor, introduzca su dirección");
      return;
    }

    const phoneNumber = "50219524";
    const messageItems = cart
      .map(
        (item: any) =>
          `${item.name}, Precio: ${item.price}, Cantidad: ${item.quantity}`,
      )
      .join("\n");

    const message = `${messageItems}\nTotal a pagar: ${totalPrice}, Direccion: ${address}`;
    const encodedMessage = encodeURIComponent(message);

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    const whatsappScheme = `whatsapp://send?text=${encodedMessage}`;

    try {
      const supported = await Linking.canOpenURL(whatsappScheme);

      if (supported) {
        await Linking.openURL(whatsappUrl);
        clearCart();
      } else {
        Alert.alert("Error", "WhatsApp no está instalado en este dispositivo");
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un problema al intentar abrir WhatsApp");
      console.error("Error opening WhatsApp:", error);
    }
  };

  const handleRequest = () => {
    handleShareToWhatsApp();
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === "light" ? "white" : "#352F44" },
      ]}
    >
      {modal ? (
        <KeyboardAvoidingView
          behavior="height"
          style={[
            styles.modal,
            { backgroundColor: theme === "light" ? "#fff" : "#383344" },
          ]}
        >
          <TouchableOpacity
            onPress={() => handleModal()}
            style={styles.closeButton}
          >
            <Image source={CloseIcon} style={styles.closeIcon} />
          </TouchableOpacity>
          <TextInput
            style={[
              styles.textArea,
              { backgroundColor: theme === "light" ? "#ffff" : "#5C5470" },
              { color: theme === "light" ? "" : "white" },
            ]}
            placeholder="Introduzca su direccion..."
            placeholderTextColor="#999"
            multiline={true}
            textAlignVertical="top"
            onChangeText={(text) => setAddress(text)}
            value={address}
          />
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              { backgroundColor: theme === "light" ? "#15caca" : "#b0a1d5" },
            ]}
            onPress={() => handleRequest()}
          >
            <Text style={styles.checkoutText}>Comprar</Text>
            <Image source={WhatsAppIcon} style={styles.whatsapp} />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      ) : (
        ""
      )}
      {cart.length === 0 ? (
        <View style={styles.emptyCarContainer}>
          <Image style={styles.emptyCarImage} source={CartBackground} />
          <View style={styles.emptyCarTextContainer}>
            <Text
              style={[
                styles.emptyCarText,
                { color: theme === "light" ? "black" : "white" },
              ]}
            >
              Carrito Vacío
            </Text>
            <Image style={styles.emptyCarIcon} source={EmptyCar} />
          </View>
        </View>
      ) : (
        <FlatList
          style={styles.flatList}
          data={cart}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={styles.flatListContentContainer}
        />
      )}
      {cart.length === 0 ? (
        ""
      ) : (
        <View
          style={[
            styles.invisibleContainer,
            { backgroundColor: theme === "light" ? "#ffffff" : "#352F44" },
          ]}
        >
          <View
            style={[
              styles.paymentContainer,
              { backgroundColor: theme === "light" ? "#eeeeee" : "#5C5470" },
            ]}
          >
            <Text
              style={[
                styles.totalQuantityText,
                { color: theme === "light" ? "black" : "white" },
              ]}
            >
              productos: {totalQuantity}
            </Text>
            <Text
              style={[
                styles.texttTotalPrice,
                { color: theme === "light" ? "black" : "white" },
              ]}
            >
              total a pagar: $ {totalPrice.toFixed()}
            </Text>
            <TouchableOpacity
              style={[
                styles.checkoutButton,
                { backgroundColor: theme === "light" ? "#15caca" : "#b0a1d5" },
              ]}
              onPress={() => handleModal()}
            >
              <Text
                style={[
                  styles.checkoutText,
                  { color: theme === "light" ? "#fff" : "black" },
                ]}
              >
                Dirección
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  text: {
    color: "red",
    backgroundColor: "red",
  },
  flatList: {
    width: "100%",
  },
  flatListContentContainer: {
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  invisibleContainer: {
    width: "100%",
    height: "45%",
    marginBottom: 75,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  paymentContainer: {
    height: "100%",
    width: "93%",
    borderRadius: 20,
    margin: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  checkoutButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignSelf: "center",
    width: "85%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  checkoutText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  texttTotalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  totalQuantityText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  modal: {
    height: "70%",
    width: "90%",
    position: "absolute",
    zIndex: 5,
    top: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
  },
  whatsapp: {
    height: 30,
    width: 30,
    position: "absolute",
    right: 80,
  },
  textArea: {
    height: 150,
    width: "90%",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#000",
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 5,
  },
  closeIcon: {
    height: 35,
    width: 35,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: 5,
  },
  emptyCarText: {
    fontSize: 25,
    fontWeight: 500,
  },
  emptyCarIcon: {
    height: 30,
    width: 30,
  },
  emptyCarContainer: {
    width: "100%",
    flexDirection: "row",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCarImage: {
    position: "absolute",
    height: 350,
    width: 350,
  },
  emptyCarTextContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
});
