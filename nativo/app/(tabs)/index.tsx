
import { Text, View } from "react-native";
import { Flame, Zap, Heart } from "lucide-react-native";
import { useFonts } from "expo-font";

export default function Index() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../../assets/fonts/Space_Mono/SpaceMono-Regular.ttf"),
    SpaceMonoBold: require("../../assets/fonts/Space_Mono/SpaceMono-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{flex: 1, backgroundColor: "#000"}}>

      {/* HEADER */}
      <View
        style={{
          paddingTop: 25,
          paddingHorizontal: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#9d9d9d",
          paddingBottom: 20,
        }}
      >
        {/* ESQUERDA */}
        <View style={{flexDirection: "row", alignItems: "center"}}>
          {/* LOGO */}
          <View style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              backgroundColor: "#9EF01A",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Text style={{fontSize: 23, fontWeight: "bold", color: "#000"}}>
              N
            </Text>
          </View>

          {/* TITULO */}
          <Text style={{color: "#FFF", fontSize: 28, fontWeight: "bold"}}>
            Nativo
          </Text>
        </View>

        {/* DIREITA */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* FOGO */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Flame size={20} color="#FF7A00" />
            <Text
              style={{
                color: "#FF7A00",
                marginLeft: 4,
                fontWeight: "bold",
              }}
            >
              1
            </Text>
          </View>

          {/* ENERGIA */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Zap size={20} color="#FFD60A" fill="#FFD60A" />
            <Text
              style={{
                color: "#FFD60A",
                marginLeft: 4,
                fontWeight: "bold",
              }}
            >
              18
            </Text>
          </View>

          {/* VIDA */}
          <View
            style={{flexDirection: "row", alignItems: "center"}}>
            <Heart size={20} color="#FF4D6D" fill="#FF4D6D" />
            <Text
              style={{color: "#FF4D6D", marginLeft: 4, fontWeight: "bold",}}>
              5
            </Text>
          </View>
        </View>
      </View>

      <View>
        <Text style={{ color: "#FFF", fontSize: 25, fontWeight: "bold", marginLeft: 20, marginTop: 20, marginRight: 20, }} >
          Aprenda{" "}
          <Text style={{ color: "#9EF01A" }}>
            Expo
          </Text>
          {" "}e{" "}
          <Text style={{ color: "#00AED1" }}>
            React Native
          </Text>
          {" "}com a Nativo!
        </Text>
      </View>

      <View>

      </View>

    </View>
  );
}