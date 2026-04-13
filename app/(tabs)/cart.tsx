import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { calculateLineTotal, useCart } from "@/context/cart-context";

function formatPrice(value: number) {
  return `₹${value}`;
}

const MEAL_FILTERS = ["All", "Breads & Dips", "Dips", "Crazy Deals", "Chicken Feast"];

const MEAL_SUGGESTIONS = [
  {
    id: 1001,
    title: "Sourdough Garlic Bread",
    category: "Breads & Dips",
    price: "₹199",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=900",
    variant: "Regular",
  },
  {
    id: 1002,
    title: "Garlic Breadsticks",
    category: "Breads & Dips",
    price: "₹129",
    image: "https://images.unsplash.com/photo-1620374645498-af6bd681a0bd?w=900",
    variant: "Regular",
  },
  {
    id: 1003,
    title: "Cheesy Dip",
    category: "Dips",
    price: "₹79",
    image: "https://images.unsplash.com/photo-1553787499-6f91332480ff?w=900",
    variant: "Single",
  },
  {
    id: 1004,
    title: "Chicken Wings",
    category: "Chicken Feast",
    price: "₹229",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=900",
    variant: "6 Pcs",
  },
];

export default function CartScreen() {
  const router = useRouter();
  const { items, incrementItem, decrementItem, addItem } = useCart();
  const [activeMealFilter, setActiveMealFilter] = useState("All");

  const subtotal = items.reduce(
    (sum, line) => sum + calculateLineTotal(line.price, line.quantity),
    0
  );
  const mrpTotal = items.reduce((sum, line) => {
    const priceToUse = line.oldPrice ?? line.price;
    return sum + calculateLineTotal(priceToUse, line.quantity);
  }, 0);
  const savings = Math.max(mrpTotal - subtotal, 0);
  const mealItems = useMemo(() => {
    if (activeMealFilter === "All") return MEAL_SUGGESTIONS;
    return MEAL_SUGGESTIONS.filter((item) => item.category === activeMealFilter);
  }, [activeMealFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f6" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/menu")}>
          <Ionicons name="arrow-back" size={22} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
        <View style={styles.offersWrap}>
          <Ionicons name="pricetag-outline" size={14} color="#7a7a7a" />
          <Text style={styles.offerText}>Offers</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.locationCard}>
          <View style={styles.takeawayBox}>
            <Text style={styles.takeawayLabel}>TAKEAWAY</Text>
            <Text style={styles.takeawayNow}>Now</Text>
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationName}>ASHOKA UNIVERSITY SONIPAT HARYANA</Text>
            <Text style={styles.locationSubtext} numberOfLines={2}>
              Ground Floor, Ashoka University Property, Rajiv Gandhi Education City...
            </Text>
          </View>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>Add items from menu to see them here.</Text>
          </View>
        ) : (
          <View style={styles.itemsCard}>
            {items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemMeta}>
                  <View style={styles.itemTopRow}>
                    <Text style={styles.vegIcon}>▣</Text>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                  </View>
                  <Text style={styles.itemVariant}>{item.variant}</Text>
                  {savings > 0 && (
                    <Text style={styles.productSaving}>
                      Saving {formatPrice(savings)} with this Product!
                    </Text>
                  )}
                </View>

                <View style={styles.itemControlCol}>
                  <View style={styles.qtyBox}>
                    <TouchableOpacity onPress={() => decrementItem(item.id)}>
                      <Text style={styles.qtyButton}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => incrementItem(item.id)}>
                      <Text style={styles.qtyButton}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.itemPriceRow}>
                    {!!item.oldPrice && (
                      <Text style={styles.itemOldPrice}>
                        {formatPrice(calculateLineTotal(item.oldPrice, item.quantity))}
                      </Text>
                    )}
                    <Text style={styles.itemPrice}>
                      {formatPrice(calculateLineTotal(item.price, item.quantity))}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.addMoreRow} onPress={() => router.push("/(tabs)/menu")}>
              <Text style={styles.addMoreText}>+ Add more items</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionDivider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Complete Your Meal With</Text>
          <View style={styles.dividerLine} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipRow}
        >
          {MEAL_FILTERS.map((filter) => {
            const isActive = filter === activeMealFilter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveMealFilter(filter)}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestRow}
        >
          {mealItems.map((item) => (
            <View key={item.id} style={styles.suggestCard}>
              <Image source={{ uri: item.image }} style={styles.suggestImage} contentFit="cover" />
              <View style={styles.suggestOverlay}>
                <Text style={styles.suggestTitle} numberOfLines={1}>
                  {item.title}
                </Text>
              </View>
              <View style={styles.suggestFooter}>
                <Text style={styles.suggestPrice}>{item.price}</Text>
                <TouchableOpacity
                  style={styles.suggestAdd}
                  onPress={() =>
                    addItem({
                      id: item.id,
                      title: item.title,
                      price: item.price,
                      image: item.image,
                      variant: item.variant,
                    })
                  }
                >
                  <Text style={styles.suggestAddText}>Add +</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.sectionDivider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Savings & Rewards</Text>
          <View style={styles.dividerLine} />
        </View>

        {savings > 0 && (
          <View style={styles.savingsCard}>
            <Text style={styles.savingsText}>You saved {formatPrice(savings)} with this cart</Text>
          </View>
        )}
        <View style={styles.couponCard}>
          <Text style={styles.couponText}>Apply Coupon</Text>
          <Ionicons name="chevron-forward" size={18} color="#7a7a7a" />
        </View>
        <View style={{ height: 128 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.payButton} disabled={!items.length}>
          {items.length ? (
            <Text style={styles.payText}>
              Pay {formatPrice(subtotal)}{" "}
              {savings > 0 && <Text style={styles.payStrike}>{formatPrice(mrpTotal)}</Text>}
            </Text>
          ) : (
            <Text style={styles.payText}>Add items to continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
    backgroundColor: "white",
  },
  headerTitle: { marginLeft: 10, fontSize: 18, fontWeight: "700", color: "#2a2a2a", flex: 1 },
  offersWrap: { flexDirection: "row", alignItems: "center", gap: 4 },
  offerText: { fontSize: 13, color: "#6b6b6b", fontWeight: "600" },
  content: { flex: 1 },
  locationCard: {
    margin: 12,
    borderRadius: 12,
    backgroundColor: "white",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  takeawayBox: {
    borderRightWidth: 1,
    borderRightColor: "#ececec",
    paddingRight: 10,
  },
  takeawayLabel: { fontSize: 11, fontWeight: "700", color: "#777" },
  takeawayNow: { fontSize: 18, fontWeight: "700", color: "#2a2a2a" },
  locationInfo: { flex: 1 },
  locationName: { fontSize: 14, fontWeight: "700", color: "#2d2d2d" },
  locationSubtext: { marginTop: 2, fontSize: 12, color: "#686868", lineHeight: 17 },
  emptyCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "white",
    padding: 20,
  },
  emptyTitle: { fontSize: 19, fontWeight: "700", color: "#242424" },
  emptySubtitle: { marginTop: 6, color: "#666", fontSize: 14 },
  itemsCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "white",
    paddingHorizontal: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  itemTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  vegIcon: {
    color: "#16a34a",
    fontSize: 15,
  },
  itemMeta: {
    flex: 1,
    paddingRight: 8,
  },
  itemControlCol: {
    alignItems: "flex-end",
    minWidth: 104,
  },
  itemPriceRow: { marginTop: 6, flexDirection: "row", alignItems: "center", gap: 6 },
  itemOldPrice: { color: "#8f8f8f", fontSize: 14, textDecorationLine: "line-through" },
  itemPrice: { fontSize: 17, fontWeight: "800", color: "#222" },
  itemVariant: { marginTop: 4, color: "#565656", fontSize: 13, fontWeight: "500" },
  productSaving: { marginTop: 2, color: "#18843b", fontSize: 12, fontWeight: "700" },
  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#dedede",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  qtyButton: { fontSize: 18, fontWeight: "700", color: "#333" },
  qtyValue: { fontSize: 15, fontWeight: "700", color: "#111", minWidth: 14, textAlign: "center" },
  addMoreRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  itemTitle: { fontSize: 17, fontWeight: "700", color: "#222", flex: 1 },
  addMoreText: { fontSize: 18, color: "#4a4a4a", fontWeight: "500" },
  sectionDivider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#dfdfdf" },
  dividerText: { marginHorizontal: 12, fontSize: 14, color: "#666", fontWeight: "500" },
  filterChipRow: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    gap: 8,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: "#e3e3e3",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f5f5f7",
  },
  filterChipActive: { backgroundColor: "#232323", borderColor: "#232323" },
  filterChipText: { color: "#5b5b5b", fontSize: 13, fontWeight: "500" },
  filterChipTextActive: { color: "white" },
  suggestRow: { paddingHorizontal: 12, gap: 10, paddingBottom: 10 },
  suggestCard: {
    width: 172,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#111",
  },
  suggestImage: { width: "100%", height: 126 },
  suggestOverlay: {
    position: "absolute",
    left: 8,
    right: 8,
    bottom: 34,
  },
  suggestTitle: { color: "white", fontWeight: "700", fontSize: 13 },
  suggestFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.74)",
  },
  suggestPrice: { color: "white", fontSize: 13, fontWeight: "700" },
  suggestAdd: {
    backgroundColor: "#f70c4d",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  suggestAddText: { color: "white", fontSize: 18, fontWeight: "700" },
  savingsCard: {
    marginHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "white",
    padding: 14,
    marginBottom: 10,
  },
  savingsText: { color: "#18843b", fontSize: 17, fontWeight: "700" },
  couponCard: {
    marginHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  couponText: { fontSize: 17, fontWeight: "600", color: "#2a2a2a" },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e9e9e9",
  },
  payButton: {
    backgroundColor: "#f70c4d",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  payText: { color: "white", fontSize: 18, fontWeight: "700" },
  payStrike: { textDecorationLine: "line-through", opacity: 0.85 },
});
