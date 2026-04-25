import { ServiceMode, useCart } from "@/context/cart-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const HERO_BANNER_WIDTH = width - 30;
const MENU_CARD_WIDTH = width * 0.84;
const MENU_CARD_SPACING = 12;

const HERO_SLIDES = [
  {
    id: 1,
    titleSmall: "5 COURSE",
    titleLarge: "LUNCH FEAST",
    timeText: "Available 11AM - 3PM",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    leftLabel: "PIZZA MEAL STARTING @",
    leftPrice: "₹149",
    rightLabel: "LOADED MEAL STARTING @",
    rightPrice: "₹199",
  },
  {
    id: 2,
    titleSmall: "FAMILY",
    titleLarge: "PARTY DEALS",
    timeText: "Available all day",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
    leftLabel: "STARTING FROM",
    leftPrice: "₹399",
    rightLabel: "SAVE UP TO",
    rightPrice: "40%",
  },
  {
    id: 3,
    titleSmall: "CHEESY",
    titleLarge: "DELIGHTS",
    timeText: "Freshly baked every order",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800",
    leftLabel: "CLASSIC RANGE @",
    leftPrice: "₹99",
    rightLabel: "PREMIUM RANGE @",
    rightPrice: "₹249",
  },
];

const CRAVING_ITEMS = [
  {
    id: 1,
    name: "5 Course Lunch\nFeast",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200",
    tag: null,
  },
  {
    id: 2,
    name: "Lunch\nXtravaganza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200",
    tag: "NEW",
  },
  {
    id: 3,
    name: "Cheese Lava",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=200",
    tag: "NEW",
  },
  {
    id: 4,
    name: "Sourdough\nRange",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=200",
    tag: "NEW",
  },
  {
    id: 5,
    name: "Chicken Feast",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200",
    tag: "NEW",
  },
  {
    id: 6,
    name: "Big Big Pizza",
    image: "https://images.unsplash.com/photo-1571066811602-716837d681de?w=200",
    tag: "NEW FLAVOURS",
  },
  {
    id: 7,
    name: "Party Combos",
    image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=200",
    tag: null,
  },
  {
    id: 8,
    name: "Veg Pizza",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200",
    tag: null,
  },
  {
    id: 9,
    name: "Non-Veg Pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200",
    tag: null,
  },
];

const CHICKEN_BURST_ITEMS = [
  {
    id: 101,
    name: "Shawarma Chicken Burst",
    description:
      "Ultimate 2-layered chicken indulgence with peri peri, BBQ and garlic toppings.",
    price: "₹349",
    variant: "Regular | New Hand Tossed",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900",
  },
  {
    id: 102,
    name: "Tandoori Chicken Burst",
    description:
      "Spicy tandoori flavor packed with juicy marinated chicken and extra cheese.",
    price: "₹369",
    variant: "Regular | Cheese Burst",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900",
  },
  {
    id: 103,
    name: "Southern Spice Chicken Burst",
    description:
      "Crunchy southern-style chicken bites with creamy sauce and jalapeno kick.",
    price: "₹389",
    variant: "Regular | New Hand Tossed",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=900",
  },
];

const CHEESE_LAVA_ITEMS = [
  {
    id: 201,
    name: "Cheese Lava Margherita",
    description: "8 cheesy pulls with rich mozzarella and soft crust center.",
    price: "₹299",
    variant: "Regular | New Hand Tossed",
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=900",
  },
  {
    id: 202,
    name: "Cheese Lava Farmhouse",
    description:
      "Loaded with capsicum, onion and sweet corn over cheese lava base.",
    price: "₹329",
    variant: "Regular | Pan Crust",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=900",
  },
];

const TAKEAWAY_LOCATIONS = [
  "ASHOKA UNIVERSITY SONIPAT HARYANA",
  "SECTOR 14, GURUGRAM HARYANA",
  "CONNAUGHT PLACE, NEW DELHI",
  "SECTOR 62, NOIDA UTTAR PRADESH",
];

const SIDEBAR_ITEMS = [
  "Deals & Offers",
  "Big Pizza",
  "Track Current Order",
  "Order History",
  "w Dominos",
  "Terms & Conditions",
  "Bulk Order",
  "3 EXCITIN",
  "-& STUF",
  "Nutritional Information",
];

const SIDEBAR_ITEM_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  "Deals & Offers": "pricetag-outline",
  "Big Pizza": "pizza-outline",
  "Track Current Order": "locate-outline",
  "Order History": "receipt-outline",
  "w Dominos": "heart-outline",
  "Terms & Conditions": "document-text-outline",
  "Bulk Order": "briefcase-outline",
  "3 EXCITIN": "sparkles-outline",
  "-& STUF": "fast-food-outline",
  "Nutritional Information": "leaf-outline",
};

const CRAVING_TO_MENU_CATEGORY: Record<string, string | undefined> = {
  "Cheese Lava": "Cheese Lava",
  "Big Big Pizza": "Big Big Pizza",
  "Veg Pizza": "Veg Pizza",
  "Non-Veg Pizza": "Non-Veg Pizza",
};

export default function HomeScreen() {
  const router = useRouter();
  const {
    addItem,
    decrementItem,
    incrementItem,
    items,
    totalItems,
    serviceMode,
    selectedLocation,
    setServiceMode,
    setSelectedLocation,
  } = useCart();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleHeroScroll = (event: any) => {
    const slideWidth = HERO_BANNER_WIDTH;
    const scrollX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(scrollX / slideWidth);
    setActiveSlideIndex(nextIndex);
  };

  const openCategory = (itemName: string) => {
    const category = CRAVING_TO_MENU_CATEGORY[itemName.replace(/\n/g, " ")];
    if (category) {
      router.push({ pathname: "/(tabs)/menu", params: { category } });
      return;
    }
    router.push("/(tabs)/menu");
  };

  const handleModePress = (mode: ServiceMode) => {
    setServiceMode(mode);
    setIsLocationModalOpen(true);
  };

  const locationHeadingByMode: Record<ServiceMode, string> = {
    Delivery: "Deliver to",
    Takeaway: "Takeaway from",
    "Dine-in": "Dine-in at",
  };

  const locationSubtextByMode: Record<ServiceMode, string> = {
    Delivery: "Select address",
    Takeaway: "Pick store",
    "Dine-in": "Choose restaurant",
  };

  const locationModalTitleByMode: Record<ServiceMode, string> = {
    Delivery: "Choose delivery location",
    Takeaway: "Choose takeaway location",
    "Dine-in": "Choose dine-in store",
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b1b3d" />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.locationContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsLocationModalOpen(true)}
            >
              <View style={styles.locationRow}>
                <Ionicons name="location" size={16} color="white" />
                <Text style={styles.takeawayText}>{locationHeadingByMode[serviceMode]}</Text>
                <Ionicons name="chevron-down" size={16} color="white" />
              </View>
              <Text style={styles.addressText} numberOfLines={1}>
                {selectedLocation}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.rewardsButton}
              onPress={() => router.push("/(tabs)/cart")}
            >
              <Ionicons name="pizza-outline" size={16} color="#ffd700" />
              <Text style={styles.rewardsText}>CHEESY{"\n"}REWARDS</Text>
              {totalItems > 0 && (
                <View style={styles.headerCartBadge}>
                  <Text style={styles.headerCartBadgeText}>{totalItems}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileIcon}
              onPress={() => setIsSidebarOpen(true)}
            >
              <Ionicons name="person-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Modes */}
        <View style={styles.deliveryModes}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              serviceMode === "Delivery" && styles.modeButtonActive,
            ]}
            onPress={() => handleModePress("Delivery")}
          >
            <Text
              style={
                serviceMode === "Delivery"
                  ? styles.modeTextActive
                  : styles.modeText
              }
            >
              Delivery
            </Text>
            <Text style={styles.modeSubtext}>{locationSubtextByMode.Delivery}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              serviceMode === "Takeaway" && styles.modeButtonActive,
            ]}
            onPress={() => handleModePress("Takeaway")}
          >
            <Text
              style={
                serviceMode === "Takeaway"
                  ? styles.modeTextActive
                  : styles.modeText
              }
            >
              Takeaway
            </Text>
            {serviceMode === "Takeaway" && (
              <View style={styles.activeIndicator} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              serviceMode === "Dine-in" && styles.modeButtonActive,
            ]}
            onPress={() => handleModePress("Dine-in")}
          >
            <Text
              style={
                serviceMode === "Dine-in"
                  ? styles.modeTextActive
                  : styles.modeText
              }
            >
              Dine-in
            </Text>
            <Text style={styles.modeSubtext}>{locationSubtextByMode["Dine-in"]}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Banner Carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={handleHeroScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.heroCarouselContent}
        >
          {HERO_SLIDES.map((slide) => (
            <View key={slide.id} style={styles.mainBanner}>
              <View style={styles.bannerBackground} />
              <Text style={styles.bannerTitleSmall}>{slide.titleSmall}</Text>
              <Text style={styles.bannerTitleLarge}>{slide.titleLarge}</Text>
              <View style={styles.bannerTimeContainer}>
                <Ionicons name="time-outline" size={16} color="#ffd700" />
                <Text style={styles.bannerTimeText}>{slide.timeText}</Text>
              </View>

              <Image
                source={{ uri: slide.image }}
                style={styles.bannerImage}
                contentFit="cover"
              />

              <View style={styles.priceContainerRow}>
                <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>{slide.leftLabel}</Text>
                  <Text style={styles.priceValue}>{slide.leftPrice}</Text>
                </View>
                <View style={styles.priceDivider} />
                <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>{slide.rightLabel}</Text>
                  <Text style={styles.priceValue}>{slide.rightPrice}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.orderNowButton}
                onPress={() => router.push("/(tabs)/menu")}
              >
                <Text style={styles.orderNowText}>ORDER NOW</Text>
                <Ionicons name="arrow-forward" size={16} color="#d12e2e" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <View style={styles.paginationContainer}>
          {HERO_SLIDES.map((slide, index) => (
            <View
              key={slide.id}
              style={[
                styles.paginationDot,
                index === activeSlideIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        {/* Cravings Grid */}
        <View style={styles.cravingsSection}>
          <Text style={styles.sectionTitle}>What are you craving for?</Text>
          <View style={styles.cravingsGrid}>
            {CRAVING_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.cravingItem}
                onPress={() => openCategory(item.name)}
              >
                <View style={styles.cravingImageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.cravingImage}
                  />
                  {item.tag && (
                    <View style={styles.tagContainer}>
                      <Text style={styles.tagText}>{item.tag}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cravingText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.menuCarouselSection}>
          <Text style={styles.menuCarouselHeading}>
            Chicken Burst in 5 Flavours
          </Text>
          <Text style={styles.menuCarouselSubheading}>
            Tandoori | Garlic | Shawarma | Southern Spice | Korean
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={MENU_CARD_WIDTH + MENU_CARD_SPACING}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={styles.menuCardsRow}
          >
            {CHICKEN_BURST_ITEMS.map((item) => (
              <View key={item.id} style={styles.menuCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.menuCardImage}
                  contentFit="cover"
                />
                <View style={styles.menuCardOverlay}>
                  <Text style={styles.menuCardTitle} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.menuCardDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
                <View style={styles.menuCardFooter}>
                  <View>
                    <Text style={styles.menuCardPrice}>{item.price}</Text>
                    <Text style={styles.menuCardVariant} numberOfLines={1}>
                      {item.variant}
                    </Text>
                  </View>
                  {(() => {
                    const line = items.find((cartItem) => cartItem.id === item.id);
                    if (!line) {
                      return (
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={() =>
                            addItem({
                              id: item.id,
                              title: item.name,
                              price: item.price,
                              image: item.image,
                              variant: item.variant,
                            })
                          }
                        >
                          <Text style={styles.addButtonText}>Add +</Text>
                        </TouchableOpacity>
                      );
                    }

                    return (
                      <View style={styles.homeQtyBox}>
                        <TouchableOpacity onPress={() => decrementItem(item.id)}>
                          <Text style={styles.homeQtyButton}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.homeQtyValue}>{line.quantity}</Text>
                        <TouchableOpacity onPress={() => incrementItem(item.id)}>
                          <Text style={styles.homeQtyButton}>+</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })()}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.menuCarouselSection}>
          <Text style={styles.menuCarouselHeading}>
            Cheese Lava Pull Apart Pizza
          </Text>
          <Text style={styles.menuCarouselSubheading}>8 Cheesy Pulls</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={MENU_CARD_WIDTH + MENU_CARD_SPACING}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={styles.menuCardsRow}
          >
            {CHEESE_LAVA_ITEMS.map((item) => (
              <View key={item.id} style={styles.menuCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.menuCardImage}
                  contentFit="cover"
                />
                <View style={styles.menuCardOverlay}>
                  <Text style={styles.menuCardTitle} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.menuCardDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
                <View style={styles.menuCardFooter}>
                  <View>
                    <Text style={styles.menuCardPrice}>{item.price}</Text>
                    <Text style={styles.menuCardVariant} numberOfLines={1}>
                      {item.variant}
                    </Text>
                  </View>
                  {(() => {
                    const line = items.find((cartItem) => cartItem.id === item.id);
                    if (!line) {
                      return (
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={() =>
                            addItem({
                              id: item.id,
                              title: item.name,
                              price: item.price,
                              image: item.image,
                              variant: item.variant,
                            })
                          }
                        >
                          <Text style={styles.addButtonText}>Add +</Text>
                        </TouchableOpacity>
                      );
                    }

                    return (
                      <View style={styles.homeQtyBox}>
                        <TouchableOpacity onPress={() => decrementItem(item.id)}>
                          <Text style={styles.homeQtyButton}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.homeQtyValue}>{line.quantity}</Text>
                        <TouchableOpacity onPress={() => incrementItem(item.id)}>
                          <Text style={styles.homeQtyButton}>+</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })()}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 36 }} />
      </ScrollView>

      {totalItems > 0 && (
        <View style={styles.floatingCartWrap}>
          <TouchableOpacity
            style={styles.floatingCartButton}
            activeOpacity={0.9}
            onPress={() => router.push("/(tabs)/cart")}
          >
            <View>
              <Text style={styles.floatingCartLabel}>View Cart</Text>
              <Text style={styles.floatingCartMeta}>
                {totalItems} item{totalItems > 1 ? "s" : ""} added
              </Text>
            </View>
            <Ionicons name="cart-outline" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={isLocationModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLocationModalOpen(false)}
      >
        <View style={styles.locationModalBackdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setIsLocationModalOpen(false)}
          />
          <View style={styles.locationModalCard}>
            <View style={styles.locationModalHeader}>
              <Text style={styles.locationModalTitle}>
                {locationModalTitleByMode[serviceMode]}
              </Text>
              <TouchableOpacity onPress={() => setIsLocationModalOpen(false)}>
                <Ionicons name="close" size={22} color="#616161" />
              </TouchableOpacity>
            </View>
            {TAKEAWAY_LOCATIONS.map((location) => {
              const isSelected = selectedLocation === location;
              return (
                <TouchableOpacity
                  key={location}
                  style={styles.locationOption}
                  onPress={() => {
                    setSelectedLocation(location);
                    setIsLocationModalOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.locationOptionText,
                      isSelected && styles.locationOptionTextSelected,
                    ]}
                  >
                    {location}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#0078a8"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>

      <Modal
        visible={isSidebarOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSidebarOpen(false)}
      >
        <View style={styles.sidebarBackdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setIsSidebarOpen(false)}
          />
          <View style={styles.sidebarPanel}>
            <View style={styles.sidebarHeader}>
              <View style={styles.sidebarHeaderTextWrap}>
                <Text style={styles.sidebarEyebrow}>EVERPIE</Text>
                <Text style={styles.sidebarTitle}>Quick Menu</Text>
                <Text style={styles.sidebarMeta}>
                  Fresh deals, orders and essentials
                </Text>
              </View>
              <TouchableOpacity
                style={styles.sidebarCloseButton}
                onPress={() => setIsSidebarOpen(false)}
              >
                <Ionicons name="close" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sidebarList}
            >
              {SIDEBAR_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.sidebarRow}
                  activeOpacity={0.85}
                  onPress={() => {
                    setIsSidebarOpen(false);
                    Alert.alert(item, "This section can be connected next.");
                  }}
                >
                  <View style={styles.sidebarRowLeft}>
                    <View style={styles.sidebarRowIcon}>
                      <Ionicons
                        name={SIDEBAR_ITEM_ICONS[item] ?? "chevron-forward"}
                        size={16}
                        color="#0b1b3d"
                      />
                    </View>
                    <Text style={styles.sidebarRowText}>{item}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#6b7895" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1b3d",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  content: {
    backgroundColor: "#f4f7ff",
  },
  header: {
    backgroundColor: "#0b1b3d",
    paddingTop: 12,
    paddingBottom: 18,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  locationContainer: {
    flex: 1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  takeawayText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  addressText: {
    color: "#a0a0a0",
    fontSize: 12,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rewardsButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "#314b7f",
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    backgroundColor: "rgba(255,215,0,0.08)",
  },
  rewardsText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
  headerCartBadge: {
    position: "absolute",
    top: -8,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#e63b4d",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  headerCartBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "800",
  },
  profileIcon: {
    borderWidth: 1,
    borderColor: "#314b7f",
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  deliveryModes: {
    flexDirection: "row",
    backgroundColor: "#132447",
    marginHorizontal: 15,
    borderRadius: 14,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 10,
  },
  modeButtonActive: {
    backgroundColor: "#ffffff",
  },
  modeText: {
    color: "#a0a0a0",
    fontWeight: "bold",
  },
  modeTextActive: {
    color: "black",
    fontWeight: "bold",
  },
  modeSubtext: {
    color: "#a0a0a0",
    fontSize: 10,
    marginTop: 2,
  },
  activeIndicator: {
    width: 20,
    height: 2,
    backgroundColor: "black",
    marginTop: 4,
  },
  mainBanner: {
    backgroundColor: "#e63b4d",
    alignItems: "center",
    paddingVertical: 22,
    position: "relative",
    overflow: "hidden",
    width: HERO_BANNER_WIDTH,
    marginHorizontal: 15,
    borderRadius: 22,
    shadowColor: "#9f1928",
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
  heroCarouselContent: {
    paddingTop: 16,
    paddingBottom: 14,
  },
  bannerBackground: {
    position: "absolute",
    top: -50,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: "#0b1b3d",
    borderBottomLeftRadius: 56,
    borderBottomRightRadius: 56,
  },
  bannerTitleSmall: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 1.6,
    marginTop: 10,
  },
  bannerTitleLarge: {
    color: "white",
    fontSize: 38,
    fontWeight: "900",
    marginBottom: 8,
  },
  bannerTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  bannerTimeText: {
    color: "#ffd700",
    fontWeight: "bold",
  },
  bannerImage: {
    width: HERO_BANNER_WIDTH - 24,
    height: 204,
    borderRadius: 16,
    marginBottom: 18,
  },
  priceContainerRow: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  priceBox: {
    flex: 1,
    alignItems: "center",
  },
  priceDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  priceLabel: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
    opacity: 0.92,
  },
  priceValue: {
    color: "white",
    fontSize: 34,
    fontWeight: "800",
  },
  orderNowButton: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 999,
    gap: 8,
  },
  orderNowText: {
    color: "#d12e2e",
    fontWeight: "700",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#c7cfdd",
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: "#10244d",
  },
  cravingsSection: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 18,
    color: "#1c2942",
  },
  cravingsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cravingItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 22,
  },
  cravingImageContainer: {
    position: "relative",
    marginBottom: 10,
  },
  cravingImage: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: "#ffffff",
    shadowColor: "#0b1b3d",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  tagContainer: {
    position: "absolute",
    top: -8,
    alignSelf: "center",
    backgroundColor: "#ffd84d",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "white",
  },
  tagText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#6b3d00",
  },
  cravingText: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
    lineHeight: 17,
  },
  menuCarouselSection: {
    backgroundColor: "transparent",
    paddingTop: 18,
    paddingBottom: 16,
    marginHorizontal: 15,
    marginBottom: 14,
    borderRadius: 0,
  },
  menuCarouselHeading: {
    fontSize: 21,
    fontWeight: "800",
    color: "#15233f",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  menuCarouselSubheading: {
    fontSize: 13,
    color: "#8a4e24",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 14,
    paddingHorizontal: 18,
    lineHeight: 18,
  },
  menuCardsRow: {
    paddingLeft: 14,
    paddingRight: 14,
    gap: MENU_CARD_SPACING,
  },
  menuCard: {
    width: MENU_CARD_WIDTH,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e6ebf5",
    shadowColor: "#0b1b3d",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  menuCardImage: {
    width: "100%",
    height: 280,
  },
  menuCardOverlay: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 88,
  },
  menuCardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "white",
  },
  menuCardDescription: {
    marginTop: 6,
    color: "#f4f4f4",
    fontSize: 13,
    lineHeight: 18,
  },
  menuCardFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "rgba(11,27,61,0.72)",
  },
  menuCardPrice: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
  menuCardVariant: {
    color: "white",
    fontSize: 14,
    opacity: 0.9,
  },
  addButton: {
    backgroundColor: "#e63b4d",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  addButtonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
  },
  homeQtyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  homeQtyButton: {
    color: "#1a1a1a",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 22,
  },
  homeQtyValue: {
    minWidth: 14,
    textAlign: "center",
    color: "#111111",
    fontSize: 15,
    fontWeight: "800",
  },
  locationModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  locationModalCard: {
    backgroundColor: "white",
    borderRadius: 14,
    overflow: "hidden",
  },
  locationModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
  },
  locationModalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#242424",
  },
  locationOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationOptionText: {
    color: "#2e2e2e",
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  locationOptionTextSelected: {
    color: "#0078a8",
    fontWeight: "700",
  },
  sidebarBackdrop: {
    flex: 1,
    backgroundColor: "rgba(8,0,24,0.36)",
    alignItems: "flex-start",
  },
  sidebarPanel: {
    width: "78%",
    height: "100%",
    backgroundColor: "#fcfaf7",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 4, height: 0 },
    elevation: 16,
  },
  sidebarHeader: {
    backgroundColor: "#0b1b3d",
    paddingHorizontal: 18,

    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 14 : 18,
    paddingBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sidebarHeaderTextWrap: {
    flex: 1,
    paddingRight: 14,
  },
  sidebarEyebrow: {
    color: "#92a9d7",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  sidebarTitle: {
    marginTop: 6,
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
  },
  sidebarMeta: {
    marginTop: 8,
    color: "#c3cde0",
    fontSize: 12,
    fontWeight: "500",
  },
  sidebarCloseButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  sidebarList: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 24,
  },
  sidebarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e3db",
  },
  sidebarRowLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
  },
  sidebarRowIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#f0ece6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sidebarRowText: {
    flex: 1,
    color: "#1c2942",
    fontSize: 16,
    fontWeight: "700",
  },
  floatingCartWrap: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 18,
  },
  floatingCartButton: {
    backgroundColor: "#0b1b3d",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  floatingCartLabel: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
  },
  floatingCartMeta: {
    marginTop: 2,
    color: "#c7d2e8",
    fontSize: 12,
    fontWeight: "500",
  },
});
