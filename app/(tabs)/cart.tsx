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
    image: "https://images.unsplash.com/photo-1620374645498-af6bd681a0bd?w=900",
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
  const { items, incrementItem, decrementItem, addItem, serviceMode, selectedLocation } = useCart();
  const [activeMealFilter, setActiveMealFilter] = useState("All");
  const totalQuantity = items.reduce((sum, line) => sum + line.quantity, 0);

  const subtotal = items.reduce(
    (sum, line) => sum + calculateLineTotal(line.price, line.quantity),
    0
  );
  const mrpTotal = items.reduce((sum, line) => {
    const priceToUse = line.oldPrice ?? line.price;
    return sum + calculateLineTotal(priceToUse, line.quantity);
  }, 0);
  const savings = Math.max(mrpTotal - subtotal, 0);
  const deliveryFee = serviceMode === "Delivery" && items.length > 0 ? 49 : 0;
  const taxes = items.length ? Math.round(subtotal * 0.05) : 0;
  const grandTotal = subtotal + deliveryFee + taxes;
  const mealItems = useMemo(() => {
    if (activeMealFilter === "All") return MEAL_SUGGESTIONS;
    return MEAL_SUGGESTIONS.filter((item) => item.category === activeMealFilter);
  }, [activeMealFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f6" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/(tabs)/menu")}>
          <Ionicons name="arrow-back" size={20} color="#222" />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Cart</Text>
          <Text style={styles.headerSubtitle}>
            {totalQuantity ? `${totalQuantity} item${totalQuantity > 1 ? "s" : ""} ready` : "Review your order"}
          </Text>
        </View>
        <View style={styles.offersPill}>
          <Ionicons name="pricetag-outline" size={14} color="#0b1b3d" />
          <Text style={styles.offerText}>Offers</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.locationCard}>
          <View style={styles.locationTopBadge}>
            <Text style={styles.locationTopBadgeText}>
              {serviceMode === "Delivery" ? "Delivery details" : "Pickup details"}
            </Text>
          </View>
          <View style={styles.takeawayBox}>
            <Text style={styles.takeawayLabel}>{serviceMode.toUpperCase()}</Text>
            <Text style={styles.takeawayNow}>{serviceMode === "Delivery" ? "Soon" : "Now"}</Text>
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationName}>{selectedLocation}</Text>
            <Text style={styles.locationSubtext} numberOfLines={2}>
              {serviceMode === "Delivery"
                ? "Delivering to your selected address and service area."
                : serviceMode === "Dine-in"
                  ? "Your selected restaurant for dine-in service."
                  : "Collect from your selected store location."}
            </Text>
          </View>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>Add items from menu to see them here.</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => router.push("/(tabs)/menu")}>
              <Text style={styles.emptyButtonText}>Browse Menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.itemsCard}>
            <View style={styles.cardSectionHeader}>
              <Text style={styles.cardSectionTitle}>Your items</Text>
              <Text style={styles.cardSectionMeta}>
                {totalQuantity} item{totalQuantity > 1 ? "s" : ""}
              </Text>
            </View>
            {items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemMainRow}>
                  <View style={styles.itemMeta}>
                    <View style={styles.itemTopRow}>
                      <Text style={styles.vegIcon}>▣</Text>
                      <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
                    </View>
                    <View style={styles.itemSubRow}>
                      <Text style={styles.itemVariant} numberOfLines={1}>{item.variant}</Text>
                      {savings > 0 && (
                        <Text style={styles.productSaving}>Offer applied</Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.itemSideCol}>
                    <View style={styles.itemPriceBlock}>
                      {!!item.oldPrice && (
                        <Text style={styles.itemOldPrice}>
                          {formatPrice(calculateLineTotal(item.oldPrice, item.quantity))}
                        </Text>
                      )}
                      <Text style={styles.itemPrice}>
                        {formatPrice(calculateLineTotal(item.price, item.quantity))}
                      </Text>
                    </View>

                    <View style={styles.qtyCompactWrap}>
                      <View style={styles.qtyBox}>
                        <TouchableOpacity onPress={() => decrementItem(item.id)}>
                          <Text style={styles.qtyButton}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyValue}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => incrementItem(item.id)}>
                          <Text style={styles.qtyButton}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.addMoreRow} onPress={() => router.push("/(tabs)/menu")}>
              <Text style={styles.addMoreText}>+ Add more items</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionHeading}>Complete your meal</Text>

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
              <View style={styles.suggestBody}>
                <Text style={styles.suggestTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.suggestVariant} numberOfLines={1}>
                  {item.variant}
                </Text>
              </View>
              <View style={styles.suggestFooter}>
                <Text style={styles.suggestPrice}>{item.price}</Text>
                {(() => {
                  const line = items.find((cartItem) => cartItem.id === item.id);
                  if (!line) {
                    return (
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
                    );
                  }

                  return (
                    <View style={styles.suggestQtyBox}>
                      <TouchableOpacity onPress={() => decrementItem(item.id)}>
                        <Text style={styles.suggestQtyButton}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.suggestQtyValue}>{line.quantity}</Text>
                      <TouchableOpacity onPress={() => incrementItem(item.id)}>
                        <Text style={styles.suggestQtyButton}>+</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })()}
              </View>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.sectionHeading}>Savings & rewards</Text>

        <View style={styles.couponCard}>
          <Text style={styles.couponText}>Apply Coupon</Text>
          <Ionicons name="chevron-forward" size={18} color="#7a7a7a" />
        </View>
        {items.length > 0 && (
          <View style={styles.billCard}>
            <Text style={styles.billTitle}>Bill Details</Text>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Item total</Text>
              <Text style={styles.billValue}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery fee</Text>
              <View style={styles.billValueRow}>
                <Text style={styles.billValueMuted}>Free</Text>
                <Text style={styles.billValue}>{formatPrice(deliveryFee)}</Text>
              </View>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Taxes & charges</Text>
              <Text style={styles.billValue}>{formatPrice(taxes)}</Text>
            </View>
            {savings > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billSavingsLabel}>Your savings</Text>
                <Text style={styles.billSavingsValue}>- {formatPrice(savings)}</Text>
              </View>
            )}
            <View style={styles.billDivider} />
            <View style={styles.billRow}>
              <Text style={styles.billGrandLabel}>Grand total</Text>
              <Text style={styles.billGrandValue}>{formatPrice(grandTotal)}</Text>
            </View>
          </View>
        )}
        <View style={{ height: 128 }} />
      </ScrollView>

      <View style={styles.footer}>
        {items.length > 0 && (
          <View style={styles.footerMetaRow}>
            <Text style={styles.footerMetaText}>
              {totalQuantity} item{totalQuantity > 1 ? "s" : ""} • Total {formatPrice(grandTotal)}
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.payButton} disabled={!items.length}>
          {items.length ? (
            <Text style={styles.payText}>
              Pay {formatPrice(grandTotal)}{" "}
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f5f8",
  },
  headerTextWrap: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#2a2a2a" },
  headerSubtitle: { marginTop: 2, fontSize: 12, color: "#7a7a7a", fontWeight: "500" },
  offersPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#eef4ff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  offerText: { fontSize: 13, color: "#0b1b3d", fontWeight: "700" },
  content: { flex: 1 },
  locationCard: {
    margin: 12,
    borderRadius: 18,
    backgroundColor: "white",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  locationTopBadge: {
    width: "100%",
    marginBottom: 2,
  },
  locationTopBadgeText: {
    color: "#0b1b3d",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  takeawayBox: {
    borderRightWidth: 1,
    borderRightColor: "#e8edf4",
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
    borderRadius: 16,
    backgroundColor: "white",
    padding: 22,
  },
  emptyTitle: { fontSize: 19, fontWeight: "700", color: "#242424" },
  emptySubtitle: { marginTop: 6, color: "#666", fontSize: 14 },
  emptyButton: {
    marginTop: 16,
    alignSelf: "flex-start",
    backgroundColor: "#0b1b3d",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  emptyButtonText: { color: "white", fontSize: 14, fontWeight: "700" },
  itemsCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 18,
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingTop: 6,
  },
  cardSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 8,
  },
  cardSectionTitle: {
    color: "#1f2a3d",
    fontSize: 17,
    fontWeight: "800",
  },
  cardSectionMeta: {
    color: "#6d7890",
    fontSize: 13,
    fontWeight: "600",
  },
  itemRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f6",
  },
  itemMainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  itemTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  vegIcon: {
    color: "#16a34a",
    fontSize: 15,
    marginTop: 2,
  },
  itemMeta: {
    flex: 1,
    minWidth: 0,
  },
  itemSubRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  itemSideCol: {
    minWidth: 102,
    alignItems: "flex-end",
    gap: 8,
  },
  itemPriceBlock: {
    alignItems: "flex-end",
  },
  itemOldPrice: {
    color: "#9aa3b2",
    fontSize: 12,
    textDecorationLine: "line-through",
  },
  itemPrice: { marginTop: 1, fontSize: 17, fontWeight: "800", color: "#222" },
  itemVariant: { color: "#6b7280", fontSize: 12, fontWeight: "500", flexShrink: 1 },
  productSaving: { color: "#18843b", fontSize: 11, fontWeight: "700" },
  qtyCompactWrap: {
    alignItems: "flex-end",
  },
  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderWidth: 1,
    borderColor: "#d8e1ee",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#f8fbff",
  },
  qtyButton: { fontSize: 17, fontWeight: "700", color: "#333" },
  qtyValue: { fontSize: 14, fontWeight: "700", color: "#111", minWidth: 12, textAlign: "center" },
  addMoreRow: {
    paddingVertical: 16,
  },
  itemTitle: { fontSize: 17, fontWeight: "700", color: "#222", flex: 1 },
  addMoreText: { fontSize: 16, color: "#0b1b3d", fontWeight: "700" },
  sectionHeading: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 10,
    color: "#4f5d74",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  filterChipRow: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    gap: 8,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: "#e3e3e3",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f5f5f7",
  },
  filterChipActive: { backgroundColor: "#0b1b3d", borderColor: "#0b1b3d" },
  filterChipText: { color: "#5b5b5b", fontSize: 13, fontWeight: "500" },
  filterChipTextActive: { color: "white" },
  suggestRow: { paddingHorizontal: 12, gap: 10, paddingBottom: 10 },
  suggestCard: {
    width: 186,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e6ebf5",
    shadowColor: "#0b1b3d",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  suggestImage: { width: "100%", height: 116 },
  suggestBody: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
    minHeight: 66,
  },
  suggestTitle: { color: "#1f2a3d", fontWeight: "700", fontSize: 13, lineHeight: 18 },
  suggestVariant: { marginTop: 4, color: "#6b7280", fontSize: 12, fontWeight: "500" },
  suggestFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 2,
  },
  suggestPrice: { color: "#0b1b3d", fontSize: 14, fontWeight: "800" },
  suggestAdd: {
    backgroundColor: "#e63b4d",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  suggestAddText: { color: "white", fontSize: 13, fontWeight: "700" },
  suggestQtyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderWidth: 1,
    borderColor: "#d8e1ee",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#f8fbff",
  },
  suggestQtyButton: { fontSize: 16, fontWeight: "700", color: "#333" },
  suggestQtyValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
    minWidth: 12,
    textAlign: "center",
  },
  couponCard: {
    marginHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#edf1f5",
  },
  couponText: { fontSize: 17, fontWeight: "600", color: "#2a2a2a" },
  billCard: {
    marginHorizontal: 12,
    borderRadius: 18,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#edf1f5",
  },
  billTitle: {
    color: "#1f2a3d",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 12,
  },
  billRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 7,
  },
  billLabel: {
    color: "#5f6c82",
    fontSize: 14,
    fontWeight: "500",
  },
  billValue: {
    color: "#1f2a3d",
    fontSize: 14,
    fontWeight: "700",
  },
  billValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  billValueMuted: {
    color: "#18843b",
    fontSize: 13,
    fontWeight: "700",
  },
  billSavingsLabel: {
    color: "#18843b",
    fontSize: 14,
    fontWeight: "600",
  },
  billSavingsValue: {
    color: "#18843b",
    fontSize: 14,
    fontWeight: "800",
  },
  billDivider: {
    height: 1,
    backgroundColor: "#edf1f5",
    marginVertical: 8,
  },
  billGrandLabel: {
    color: "#1f2a3d",
    fontSize: 16,
    fontWeight: "800",
  },
  billGrandValue: {
    color: "#0b1b3d",
    fontSize: 18,
    fontWeight: "900",
  },
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
  footerMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  footerMetaText: {
    color: "#4f5d74",
    fontSize: 13,
    fontWeight: "600",
  },
  payButton: {
    backgroundColor: "#f70c4d",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },
  payText: { color: "white", fontSize: 18, fontWeight: "700" },
  payStrike: { textDecorationLine: "line-through", opacity: 0.85 },
});
