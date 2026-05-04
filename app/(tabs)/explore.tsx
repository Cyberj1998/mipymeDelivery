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
    const phoneNumber = "50219524";

    const messageItems = cart
      .map(
        (item) =>
          `${item.name}, Precio: ${item.price}, Cantidad: ${item.quantity}`,
      )
      .join("\n");

    const message = `${messageItems}\nTotal a pagar: ${totalPrice}, Direccion: ${address}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    try {
      const supported = await Linking.canOpenURL(whatsappUrl);

      if (supported && address.length != 0) {
        await Linking.openURL(whatsappUrl);
        clearCart();
      } else {
        Alert.alert("Introdusca su direccion por favor");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Ocurrió un problema al intentar abrir la aplicación",
      );
      console.error("Error opening WhatsApp:", error);
    }
  };

  const handleRequest = () => {
    handleShareToWhatsApp();
  };

  return (
    <SafeAreaView style={styles.container}>
      {modal ? (
        <KeyboardAvoidingView behavior="height" style={styles.modal}>
          <TouchableOpacity
            onPress={() => handleModal()}
            style={styles.closeButton}
          >
            <Image source={CloseIcon} style={styles.closeIcon} />
          </TouchableOpacity>
          <TextInput
            style={styles.textArea}
            placeholder="Introdusca su direccion..."
            placeholderTextColor="#999"
            multiline={true}
            textAlignVertical="top"
            onChangeText={(text) => setAddress(text)}
            value={address}
          />
          <TouchableOpacity
            style={styles.checkoutButton}
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
            <Text style={styles.emptyCarText}>carrito vacio</Text>
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
        <View style={styles.invisibleContainer}>
          <View style={styles.paymentContainer}>
            <Text style={styles.totalQuantityText}>
              productos: {totalQuantity}
            </Text>
            <Text style={styles.texttTotalPrice}>
              total a pagar: $ {totalPrice.toFixed()}
            </Text>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => handleModal()}
            >
              <Text style={styles.checkoutText}>Checkout</Text>
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
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  paymentContainer: {
    backgroundColor: "#eeeeee",
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
    backgroundColor: "#15caca",
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
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  texttTotalPrice: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  totalQuantityText: {
    color: "black",
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
    backgroundColor: "#fff",
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
    backgroundColor: "#ffffff",
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
    color: "black",
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
