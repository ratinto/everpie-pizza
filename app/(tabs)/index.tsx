import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import {
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
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
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
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
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
    image:
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800",
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
    id: 1,
    name: "Shawarma Chicken Burst",
    description:
      "Ultimate 2-layered chicken indulgence with peri peri, BBQ and garlic toppings.",
    price: "₹349",
    variant: "Regular | New Hand Tossed",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900",
  },
  {
    id: 2,
    name: "Tandoori Chicken Burst",
    description:
      "Spicy tandoori flavor packed with juicy marinated chicken and extra cheese.",
    price: "₹369",
    variant: "Regular | Cheese Burst",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900",
  },
  {
    id: 3,
    name: "Southern Spice Chicken Burst",
    description:
      "Crunchy southern-style chicken bites with creamy sauce and jalapeno kick.",
    price: "₹389",
    variant: "Regular | New Hand Tossed",
    image:
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=900",
  },
];

const CHEESE_LAVA_ITEMS = [
  {
    id: 1,
    name: "Cheese Lava Margherita",
    description: "8 cheesy pulls with rich mozzarella and soft crust center.",
    price: "₹299",
    variant: "Regular | New Hand Tossed",
    image:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=900",
  },
  {
    id: 2,
    name: "Cheese Lava Farmhouse",
    description: "Loaded with capsicum, onion and sweet corn over cheese lava base.",
    price: "₹329",
    variant: "Regular | Pan Crust",
    image:
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=900",
  },
];

const TAKEAWAY_LOCATIONS = [
  "ASHOKA UNIVERSITY SONIPAT HARYANA",
  "SECTOR 14, GURUGRAM HARYANA",
  "CONNAUGHT PLACE, NEW DELHI",
  "SECTOR 62, NOIDA UTTAR PRADESH",
];

export default function HomeScreen() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(TAKEAWAY_LOCATIONS[0]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleHeroScroll = (event: any) => {
    const slideWidth = HERO_BANNER_WIDTH;
    const scrollX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(scrollX / slideWidth);
    setActiveSlideIndex(nextIndex);
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
                <Text style={styles.takeawayText}>Takeaway from</Text>
                <Ionicons name="chevron-down" size={16} color="white" />
              </View>
              <Text style={styles.addressText} numberOfLines={1}>
                {selectedLocation}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.rewardsButton}>
              <Ionicons name="pizza-outline" size={16} color="#ffd700" />
              <Text style={styles.rewardsText}>CHEESY{"\n"}REWARDS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileIcon}>
              <Ionicons name="person-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Modes */}
        <View style={styles.deliveryModes}>
          <TouchableOpacity style={styles.modeButton}>
            <Text style={styles.modeText}>Delivery</Text>
            <Text style={styles.modeSubtext}>Select Location</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, styles.modeButtonActive]}
          >
            <Text style={styles.modeTextActive}>Takeaway</Text>
            <View style={styles.activeIndicator} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.modeButton}>
            <Text style={styles.modeText}>Dine-in</Text>
            <Text style={styles.modeSubtext}>Select Store</Text>
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

              <TouchableOpacity style={styles.orderNowButton}>
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

        {/* App Install Banner */}
        <View style={styles.installBanner}>
          <View style={styles.installIconContainer}>
            <Ionicons name="logo-windows" size={24} color="white" />
          </View>
          <View style={styles.installTextContainer}>
            <Text style={styles.installSubtext}>Download app for</Text>
            <Text style={styles.installMainText}>
              Faster app experience & more
            </Text>
          </View>
          <TouchableOpacity style={styles.installButton}>
            <Text style={styles.installButtonText}>Install</Text>
          </TouchableOpacity>
        </View>

        {/* Cravings Grid */}
        <View style={styles.cravingsSection}>
          <Text style={styles.sectionTitle}>What are you craving for?</Text>
          <View style={styles.cravingsGrid}>
            {CRAVING_ITEMS.map((item) => (
              <TouchableOpacity key={item.id} style={styles.cravingItem}>
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
          <Text style={styles.menuCarouselHeading}>Chicken Burst in 5 Flavours</Text>
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
                  <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add +</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.menuCarouselSection}>
          <Text style={styles.menuCarouselHeading}>Cheese Lava Pull Apart Pizza</Text>
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
                  <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add +</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBannerContainer}>
          <View style={styles.promoBanner}>
            <Text style={styles.promoTitle}>FREE DELIVERY</Text>
            <Text style={styles.promoSubtitle}>
              On all orders above ₹149{" "}
              <Text style={styles.strikeText}>₹99</Text>
            </Text>
          </View>
        </View>

        <View style={{ height: 36 }} />
      </ScrollView>

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
              <Text style={styles.locationModalTitle}>Choose takeaway location</Text>
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
                  <Text style={[styles.locationOptionText, isSelected && styles.locationOptionTextSelected]}>
                    {location}
                  </Text>
                  {isSelected && <Ionicons name="checkmark-circle" size={18} color="#0078a8" />}
                </TouchableOpacity>
              );
            })}
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
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#0b1b3d",
    paddingTop: 10,
    paddingBottom: 15,
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
    borderWidth: 1,
    borderColor: "#4a5b7d",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  rewardsText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  profileIcon: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  deliveryModes: {
    flexDirection: "row",
    backgroundColor: "#16274a",
    marginHorizontal: 15,
    borderRadius: 8,
    padding: 2,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  modeButtonActive: {
    backgroundColor: "white",
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
    backgroundColor: "#d12e2e",
    alignItems: "center",
    paddingVertical: 20,
    position: "relative",
    overflow: "hidden",
    width: HERO_BANNER_WIDTH,
    marginHorizontal: 15,
    borderRadius: 14,
  },
  heroCarouselContent: {
    paddingVertical: 15,
  },
  bannerBackground: {
    position: "absolute",
    top: -50,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: "#0b1b3d",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  bannerTitleSmall: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 2,
    marginTop: 10,
  },
  bannerTitleLarge: {
    color: "white",
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 10,
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
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  priceContainerRow: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
    fontSize: 12,
    fontWeight: "bold",
  },
  priceValue: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  orderNowButton: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  orderNowText: {
    color: "#d12e2e",
    fontWeight: "bold",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d0d0d0",
  },
  paginationDotActive: {
    width: 22,
    backgroundColor: "#d12e2e",
  },
  installBanner: {
    flexDirection: "row",
    alignItems: "center",
    margin: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "white",
  },
  installIconContainer: {
    backgroundColor: "#0066cc",
    padding: 8,
    borderRadius: 6,
  },
  installTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  installSubtext: {
    fontSize: 12,
    color: "#666",
  },
  installMainText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0066cc",
  },
  installButton: {
    backgroundColor: "#d12e2e",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  installButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cravingsSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  cravingsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cravingItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 25,
  },
  cravingImageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  cravingImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#f5f5f5",
  },
  tagContainer: {
    position: "absolute",
    top: -8,
    alignSelf: "center",
    backgroundColor: "#ffcc00",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
  },
  tagText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#8b4513",
  },
  cravingText: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#444",
  },
  menuCarouselSection: {
    backgroundColor: "#f3f3f3",
    paddingVertical: 16,
    marginBottom: 12,
  },
  menuCarouselHeading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2c2c2c",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  menuCarouselSubheading: {
    fontSize: 13,
    color: "#7f4a2e",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 12,
    paddingHorizontal: 18,
    lineHeight: 18,
  },
  menuCardsRow: {
    paddingLeft: 15,
    paddingRight: 15,
    gap: MENU_CARD_SPACING,
  },
  menuCard: {
    width: MENU_CARD_WIDTH,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  menuCardImage: {
    width: "100%",
    height: 280,
  },
  menuCardOverlay: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 86,
  },
  menuCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  menuCardDescription: {
    marginTop: 4,
    color: "#f4f4f4",
    fontSize: 13,
    lineHeight: 17,
  },
  menuCardFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.75)",
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
    backgroundColor: "#ed1e4f",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 12,
  },
  addButtonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
  },
  promoBannerContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  promoBanner: {
    backgroundColor: "#e6f2ff",
    borderRadius: 10,
    padding: 20,
    alignItems: "flex-start",
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#d12e2e",
    fontStyle: "italic",
  },
  promoSubtitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    marginTop: 5,
  },
  strikeText: {
    textDecorationLine: "line-through",
    color: "#888",
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
});
