import useCartStore from "@/store/CartSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import banner from "../../assets/images/banner_favorite.png";
import TrashIcon from "../../assets/images/icons/trash.png";
import FavoriteCard from "../../components/FavoriteCard";
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
    <FavoriteCard item={item} onRemove={handleRemoveItem} />
  );

  //---------------------states
  const [asyncStorageData, setAsyncStorageData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useCartStore((state) => state.theme);

  //----------------------------get items function
  const getStoredItems = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(CACHE_STORAGE_KEY);

      if (jsonValue !== null) {
        const items = JSON.parse(jsonValue);

        console.log("📦 Items retrieved:", items);
        setAsyncStorageData(items);
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
  //---------------------handle remove from Cache Storage Function

  const removeFromAsyncStorage = async (item: any) => {
    try {
      const jsonValue = await AsyncStorage.getItem(CACHE_STORAGE_KEY);
      let cache = jsonValue != null ? JSON.parse(jsonValue) : [];

      // Filter out the item with matching $id
      const updatedCache = cache.filter(
        (cacheItem: any) => cacheItem.$id !== item.$id,
      );

      // Only update storage if something was actually removed
      if (updatedCache.length !== cache.length) {
        await AsyncStorage.setItem(
          CACHE_STORAGE_KEY,
          JSON.stringify(updatedCache),
        );
        console.log("✅ Item removed:", item.$id);
        return true;
      }

      console.log("ℹ️ Item not found in storage");
      return false;
    } catch (error) {
      console.error("❌ AsyncStorage Error:", error);
      return false;
    }
  };

  //------------------------remove one item callback
  const handleRemoveItem = async (item: Product) => {
    const removed = await removeFromAsyncStorage(item);
    if (removed) {
      // Update local state immediately – no need to reload from storage
      setAsyncStorageData((prev) => prev.filter((i) => i.$id !== item.$id));
    }
  };

  //-----------------use effect
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setIsLoading(true);
        await getStoredItems();
        setIsLoading(false);
      };
      loadData();
    }, []),
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === "light" ? "white" : "#2b2b2b" },
      ]}
    >
      <View style={styles.banner}>
        <Image source={banner} style={styles.bannerImage} />
      </View>
      <View style={styles.flatlistContainer}>
        {!isLoading ? (
          <FlatList
            style={styles.flatList}
            data={asyncStorageData}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.$id}
            contentContainerStyle={styles.flatListContentContainer}
          />
        ) : (
          <Text>Cargando...</Text>
        )}
        <TouchableOpacity
          style={[
            styles.cleanCache,
            { backgroundColor: theme === "light" ? "#3e8dc2" : "#b0a1d5" },
          ]}
          onPress={() => clearCartStorage()}
        >
          <Image source={TrashIcon} style={styles.trash} />
          <Text style={styles.cleanCacheText}>Borrar Favoritos</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  flatlistContainer: {
    flex: 1,
    width: "100%",
    borderWidth: 2,
    borderColor: "blue",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  flatList: {
    width: "100%",
    borderWidth: 2,
    borderColor: "red",
    marginBottom: 80,
    flexWrap: "wrap",
  },
  flatListContentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  cleanCache: {
    borderRadius: 10,
    height: 50,
    width: 120,
    position: "relative",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  trash: {
    height: 25,
    width: 25,
  },
  cleanCacheText: {
    color: "#fff",
    fontWeight: 500,
    fontSize: 12,
  },
  banner: {
    height: 150,
    width: "90%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: {
    height: 150,
    width: "100%",
    resizeMode: "cover",
    borderRadius: 20,
  },
});
