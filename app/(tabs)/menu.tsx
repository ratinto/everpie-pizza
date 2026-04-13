import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "@/context/cart-context";

const CATEGORY_TABS = [
  { key: "Cheese Lava", label: "Cheese Lava" },
  { key: "Big Big Pizza", label: "Big Big Pizza", badge: "New Flavours" },
  { key: "Veg Pizza", label: "Veg Pizza" },
  { key: "Non-Veg Pizza", label: "Non-Veg Pizza" },
];

const MENU_ITEMS_BY_TAB = {
  "Cheese Lava": [
    {
      id: 1,
      title: "Cheese Lava Golden Corn",
      description: "8 cheesy pull-aparts topped with juicy corn and molten cheese bliss.",
      price: "₹399",
      oldPrice: "₹499",
      save: "Save ₹100",
      variant: "Medium | Pull Apart Crust",
      type: "veg",
      image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=1200",
    },
    {
      id: 2,
      title: "Cheese Lava Spiced Double Chicken",
      description: "8 cheesy pull-aparts loaded with Pepper BBQ and Peri Peri Chicken.",
      price: "₹399",
      oldPrice: "₹599",
      save: "Save ₹200",
      variant: "Medium | Pull Apart Crust",
      type: "non-veg",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200",
    },
  ],
  "Big Big Pizza": [
    {
      id: 3,
      title: "Big Big Veggie Overload",
      description: "Loaded with crunchy onions, corn and capsicum with rich cheese.",
      price: "₹499",
      oldPrice: "₹699",
      save: "Save ₹200",
      variant: "Regular | New Hand Tossed",
      type: "veg",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200",
    },
    {
      id: 4,
      title: "Big Big Chicken Feast",
      description: "Generous chicken toppings on hand tossed crust with smoky sauce.",
      price: "₹549",
      oldPrice: "₹749",
      save: "Save ₹200",
      variant: "Regular | New Hand Tossed",
      type: "non-veg",
      image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=1200",
    },
  ],
  "Veg Pizza": [
    {
      id: 5,
      title: "Farmhouse Delight",
      description: "Onion, capsicum, tomato and grilled mushroom over soft cheese base.",
      price: "₹299",
      oldPrice: "₹399",
      save: "Save ₹100",
      variant: "Regular | Classic Crust",
      type: "veg",
      image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=1200",
    },
  ],
  "Non-Veg Pizza": [
    {
      id: 6,
      title: "Pepper Barbecue Chicken",
      description: "Smoky BBQ chicken chunks and cheese spread across every bite.",
      price: "₹349",
      oldPrice: "₹449",
      save: "Save ₹100",
      variant: "Regular | Classic Crust",
      type: "non-veg",
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=1200",
    },
  ],
};

const FULL_MENU_CATEGORIES = [
  { name: "Cheese Lava", count: 8 },
  { name: "Big Big Pizza", count: 11, badge: "New" },
  { name: "Veg Pizza", count: 17 },
  { name: "Non-Veg Pizza", count: 19 },
  { name: "Crazy Deals", count: 7 },
  { name: "Chicken Feast", count: 14 },
  { name: "Cheese Burst Pizza", count: 18 },
  { name: "Cheese Volcano", count: 8 },
  { name: "Pizza Mania", count: 11 },
  { name: "Garlic Breads & Dips", count: 21 },
  { name: "Chicken Burst", count: 4 },
  { name: "Beverages", count: 7 },
  { name: "Desserts", count: 5 },
  { name: "Tacos & Parcels", count: 11 },
  { name: "Sourdough Range", count: 18 },
];

type SortMode = "POPULAR" | "PRICE_LOW_TO_HIGH" | "PRICE_HIGH_TO_LOW";

const getNumericPrice = (price: string) => Number(price.replace(/[^\d]/g, "")) || 0;

export default function MenuScreen() {
  const router = useRouter();
  const { addItem, totalItems, items, incrementItem, decrementItem } = useCart();
  const [activeTab, setActiveTab] = useState("Cheese Lava");
  const [isFullMenuOpen, setIsFullMenuOpen] = useState(false);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
  const [showVegOnly, setShowVegOnly] = useState(false);
  const [showNonVegOnly, setShowNonVegOnly] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("POPULAR");

  const visibleItems = useMemo(
    () => {
      const baseItems = MENU_ITEMS_BY_TAB[activeTab as keyof typeof MENU_ITEMS_BY_TAB] ?? [];

      const filteredItems = baseItems.filter((item) => {
        if (showVegOnly && item.type !== "veg") return false;
        if (showNonVegOnly && item.type !== "non-veg") return false;
        return true;
      });

      if (sortMode === "PRICE_LOW_TO_HIGH") {
        return [...filteredItems].sort(
          (a, b) => getNumericPrice(a.price) - getNumericPrice(b.price)
        );
      }

      if (sortMode === "PRICE_HIGH_TO_LOW") {
        return [...filteredItems].sort(
          (a, b) => getNumericPrice(b.price) - getNumericPrice(a.price)
        );
      }

      return filteredItems;
    },
    [activeTab, showVegOnly, showNonVegOnly, sortMode]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.topBlock}>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => router.push("/(tabs)")}>
            <Ionicons name="arrow-back" size={22} color="#222" />
          </TouchableOpacity>
          <Text style={styles.storeTitle}>Everpie Pizza</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.searchButton}>
              <Ionicons name="search" size={20} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => router.push("/(tabs)/cart")}
            >
              <Ionicons name="cart-outline" size={20} color="#333" />
              {totalItems > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{totalItems}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterPill, showVegOnly && styles.filterPillActive]}
            onPress={() => {
              setShowVegOnly((prev) => {
                const next = !prev;
                if (next) setShowNonVegOnly(false);
                return next;
              });
            }}
          >
            <Ionicons name="square" size={16} color={showVegOnly ? "#ffffff" : "#00a859"} />
            <Text style={[styles.filterPillText, showVegOnly && styles.filterPillTextActive]}>
              Veg Only
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterPill, showNonVegOnly && styles.filterPillActive]}
            onPress={() => {
              setShowNonVegOnly((prev) => {
                const next = !prev;
                if (next) setShowVegOnly(false);
                return next;
              });
            }}
          >
            <Ionicons name="triangle" size={15} color={showNonVegOnly ? "#ffffff" : "#a35a2b"} />
            <Text style={[styles.filterPillText, showNonVegOnly && styles.filterPillTextActive]}>
              Non Veg Only
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterPill}
            onPress={() => setIsSortSheetOpen(true)}
          >
            <Text style={styles.filterPillText}>Sort by</Text>
            <Ionicons name="swap-vertical" size={13} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabRow}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.tabRowContent}
          showsHorizontalScrollIndicator={false}
        >
          {CATEGORY_TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.categoryTab, isActive && styles.categoryTabActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                {!!tab.badge && <Text style={styles.tabBadge}>{tab.badge}</Text>}
                <Text style={[styles.categoryTabText, isActive && styles.categoryTabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <TouchableOpacity
          style={styles.tabListButton}
          activeOpacity={0.8}
          onPress={() => setIsFullMenuOpen(true)}
        >
          <Ionicons name="list-outline" size={22} color="#4f4f4f" />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionLine} />
        <Text style={styles.sectionTitle}>{activeTab}</Text>
        <View style={styles.sectionLine} />
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        <View style={styles.menuListContent}>
          {visibleItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No items for selected filters.</Text>
            </View>
          ) : (
            visibleItems.map((item) => (
              <View key={item.id} style={styles.menuCard}>
                <Image source={{ uri: item.image }} style={styles.menuImage} contentFit="cover" />

                <View style={styles.cardGradient}>
                  <View style={styles.fadeLayerOne} />
                  <View style={styles.fadeLayerTwo} />
                  <View style={styles.fadeLayerThree} />
                  <View style={styles.fadeLayerFour} />
                  <View style={styles.fadeLayerFive} />
                  <View style={styles.overlayTextBlock}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                  </View>

                  <View style={styles.bottomInfoBar}>
                    <View style={styles.priceCol}>
                      <View style={styles.priceRow}>
                        <Text style={styles.currentPrice}>{item.price}</Text>
                        {!!item.oldPrice && <Text style={styles.oldPrice}>{item.oldPrice}</Text>}
                        {!!item.save && <Text style={styles.saveTag}>{item.save}</Text>}
                      </View>
                      <Text style={styles.variantLine}>{item.variant}</Text>
                      <View style={styles.variantDash} />
                    </View>
                    {(() => {
                      const line = items.find((cartItem) => cartItem.id === item.id);
                      if (!line) {
                        return (
                          <TouchableOpacity
                            style={styles.addBtn}
                            onPress={() =>
                              addItem({
                                id: item.id,
                                title: item.title,
                                price: item.price,
                                oldPrice: item.oldPrice,
                                image: item.image,
                                variant: item.variant,
                              })
                            }
                          >
                            <Text style={styles.addBtnText}>Add +</Text>
                          </TouchableOpacity>
                        );
                      }

                      return (
                        <View style={styles.menuQtyBox}>
                          <TouchableOpacity onPress={() => decrementItem(item.id)}>
                            <Text style={styles.menuQtyButton}>-</Text>
                          </TouchableOpacity>
                          <Text style={styles.menuQtyValue}>{line.quantity}</Text>
                          <TouchableOpacity onPress={() => incrementItem(item.id)}>
                            <Text style={styles.menuQtyButton}>+</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })()}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
        <View style={{ height: 92 }} />
      </ScrollView>

      {isFullMenuOpen && (
        <View style={styles.fullMenuBackdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setIsFullMenuOpen(false)}
          />
          <View style={styles.fullMenuSheet}>
            <View style={styles.fullMenuHeader}>
              <Text style={styles.fullMenuTitle}>Full Menu</Text>
              <TouchableOpacity onPress={() => setIsFullMenuOpen(false)}>
                <Ionicons name="close" size={24} color="#7a7a7a" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {FULL_MENU_CATEGORIES.map((item) => {
                const isActive = item.name === activeTab;
                return (
                  <TouchableOpacity
                    key={item.name}
                    style={styles.fullMenuRow}
                    activeOpacity={0.8}
                    onPress={() => {
                      if (MENU_ITEMS_BY_TAB[item.name as keyof typeof MENU_ITEMS_BY_TAB]) {
                        setActiveTab(item.name);
                      }
                      setIsFullMenuOpen(false);
                    }}
                  >
                    <View style={styles.fullMenuLeft}>
                      <Text style={[styles.fullMenuName, isActive && styles.fullMenuNameActive]}>
                        {item.name}
                      </Text>
                      {!!item.badge && <Text style={styles.fullMenuNewBadge}>{item.badge}</Text>}
                    </View>
                    <Text
                      style={[styles.fullMenuCount, isActive && styles.fullMenuCountActive]}
                    >
                      {item.count}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}

      {isSortSheetOpen && (
        <View style={styles.fullMenuBackdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setIsSortSheetOpen(false)}
          />
          <View style={styles.sortSheet}>
            <View style={styles.fullMenuHeader}>
              <Text style={styles.sortSheetTitle}>Sort by</Text>
              <TouchableOpacity onPress={() => setIsSortSheetOpen(false)}>
                <Ionicons name="close" size={24} color="#7a7a7a" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.sortOptionRow}
              onPress={() => {
                setSortMode("PRICE_HIGH_TO_LOW");
                setIsSortSheetOpen(false);
              }}
            >
              <Text style={styles.sortOptionText}>Price: High to low</Text>
              <Ionicons name="chevron-forward" size={18} color="#9a9a9a" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sortOptionRow}
              onPress={() => {
                setSortMode("PRICE_LOW_TO_HIGH");
                setIsSortSheetOpen(false);
              }}
            >
              <Text style={styles.sortOptionText}>Price: Low to High</Text>
              <Ionicons name="chevron-forward" size={18} color="#9a9a9a" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  topBlock: {
    backgroundColor: "#fcfcfc",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  storeTitle: { flex: 1, marginLeft: 12, fontSize: 17, fontWeight: "700", color: "#2d2d2d" },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#f70c4d",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.03)",
  },
  filterPill: {
    borderWidth: 1,
    borderColor: "#d8d8d8",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  filterPillText: { color: "#363636", fontSize: 14, fontWeight: "500" },
  filterPillActive: {
    backgroundColor: "#0078a8",
    borderColor: "#0078a8",
  },
  filterPillTextActive: {
    color: "#ffffff",
  },
  tabRow: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    flexDirection: "row",
    alignItems: "stretch",
  },
  tabRowContent: { paddingHorizontal: 12, paddingRight: 18 },
  categoryTab: {
    paddingTop: 5,
    paddingBottom: 11,
    marginRight: 24,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
    minHeight: 53,
    justifyContent: "flex-end",
  },
  categoryTabActive: { borderBottomColor: "#de1240" },
  categoryTabText: { fontSize: 15, color: "#2f2f2f", fontWeight: "500" },
  categoryTabTextActive: { fontWeight: "700" },
  tabBadge: {
    position: "absolute",
    top: 1,
    alignSelf: "center",
    backgroundColor: "#ff476d",
    color: "white",
    fontSize: 9,
    fontWeight: "700",
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    overflow: "hidden",
  },
  tabListButton: {
    width: 52,
    borderLeftWidth: 1,
    borderLeftColor: "#ececec",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  },
  sectionHeader: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  sectionLine: { width: 44, height: 1, backgroundColor: "#e7e7e7", marginHorizontal: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#4f4f4f" },
  list: { flex: 1 },
  menuListContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
    gap: 12,
  },
  emptyState: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e4e4e4",
  },
  emptyStateText: {
    color: "#5a5a5a",
    fontSize: 14,
    fontWeight: "500",
  },
  menuCard: {
    backgroundColor: "#111",
    width: "100%",
    borderRadius: 0,
    overflow: "hidden",
  },
  menuImage: { width: "100%", height: 335 },
  cardGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 88,
    paddingHorizontal: 14,
    paddingBottom: 12,
    overflow: "hidden",
  },
  fadeLayerOne: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 210,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  fadeLayerTwo: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 178,
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  fadeLayerThree: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 148,
    backgroundColor: "rgba(0,0,0,0.17)",
  },
  fadeLayerFour: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.24)",
  },
  fadeLayerFive: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 94,
    backgroundColor: "rgba(0,0,0,0.34)",
  },
  overlayTextBlock: {
    marginBottom: 14,
  },
  itemTitle: { color: "white", fontSize: 16, fontWeight: "700" },
  itemDescription: { color: "#f1f1f1", fontSize: 10, marginTop: 4, lineHeight: 16 },
  bottomInfoBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceCol: { flex: 1, paddingRight: 10 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  currentPrice: { color: "white", fontSize: 15, fontWeight: "800" },
  oldPrice: { color: "#c9c9c9", fontSize: 9, fontWeight: "700", textDecorationLine: "line-through" },
  saveTag: {
    backgroundColor: "#14a44d",
    color: "#fff",
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    fontSize: 8,
    fontWeight: "700",
    overflow: "hidden",
  },
  variantLine: { color: "white", fontSize: 8, marginTop: 7, fontWeight: "700" },
  variantDash: {
    width: 146,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.8)",
    borderStyle: "dashed",
    marginTop: 5,
  },
  addBtn: {
    backgroundColor: "#f70c4d",
    borderRadius: 12,
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  addBtnText: { color: "white", fontSize: 21, fontWeight: "700" },
  menuQtyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.2,
    borderColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 96,
    justifyContent: "center",
  },
  menuQtyButton: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 20,
  },
  menuQtyValue: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
    minWidth: 14,
    textAlign: "center",
  },
  fullMenuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  fullMenuSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    height: "64%",
    paddingTop: 12,
    paddingHorizontal: 18,
  },
  fullMenuHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  fullMenuTitle: {
    fontSize: 35,
    fontWeight: "700",
    color: "#2f2f2f",
  },
  fullMenuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  fullMenuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fullMenuName: {
    fontSize: 16,
    color: "#2f2f2f",
    fontWeight: "500",
  },
  fullMenuNameActive: {
    color: "#0e5f8f",
    fontWeight: "700",
  },
  fullMenuNewBadge: {
    color: "#e53957",
    fontSize: 16,
    fontWeight: "700",
  },
  fullMenuCount: {
    fontSize: 16,
    color: "#353535",
    fontWeight: "500",
  },
  fullMenuCountActive: {
    color: "#0e5f8f",
    fontWeight: "700",
  },
  sortSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingTop: 12,
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  sortSheetTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2f2f2f",
  },
  sortOptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#efefef",
  },
  sortOptionText: {
    fontSize: 16,
    color: "#3a3a3a",
    fontWeight: "500",
  },
});
