import ProductCard from "@/components/ProductCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
    FlatList,
    ListRenderItem,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const CACHE_STORAGE_KEY = "@shopping_cart";

export default function favorite() {
  //---------------------interface and typescript stuff
  interface Product {
    $id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    local: string;
  }

  const renderProductItem: ListRenderItem<Product> = ({ item }) => (
    <ProductCard item={item} />
  );

  //---------------------states
  const [asyncStorageData, setAsyncStorageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //----------------------------get items function
  const getStoredItems = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(CACHE_STORAGE_KEY);

      if (jsonValue !== null) {
        const items = JSON.parse(jsonValue);

        console.log("📦 Items retrieved:", items);
        setAsyncStorageData(items);
        console.log("sdasadaasdasasdasdsdas");
        return items;
      }

      console.log("Empty storage: No items found.");
      return [];
    } catch (e) {
      console.error("❌ Error reading from storage:", e);
      return [];
    }
  };

  //----------------------------clear items function
  const clearCartStorage = async () => {
    try {
      await AsyncStorage.removeItem(CACHE_STORAGE_KEY);

      setAsyncStorageData([]);

      console.log("✅ Cart cleared from storage and state");
      return true;
    } catch (error) {
      console.error("❌ Error clearing storage:", error);
      return false;
    }
  };

  //-----------------use effect
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      await getStoredItems();
      setIsLoading(false);
    };

    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.cleanCache}
        onPress={() => clearCartStorage()}
      >
        <Text>Borrar Favoritos</Text>
      </TouchableOpacity>
      {!isLoading ? (
        <FlatList
          style={styles.flatList}
          data={asyncStorageData}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.$id}
          numColumns={2}
          contentContainerStyle={styles.flatListContentContainer}
        />
      ) : (
        <Text>Cargando...</Text>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "red",
    flex: 1,
  },
  flatList: {
    width: "100%",
    marginBottom: 80,
    flexWrap: "wrap",
  },
  flatListContentContainer: {
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  cleanCache: {
    backgroundColor: "blue",
    height: 50,
    width: 100,
  },
});
