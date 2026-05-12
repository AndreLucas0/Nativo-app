
import { House } from "lucide-react-native";
import { Text, View } from "react-native";

import LessonCompleteScreen from "@/app/LessonCompleteScreen";



export default function  Premios() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      <LessonCompleteScreen xpGained={18} accuracy={100} onContinue={() => navigation.back()} /> 

      <House size={48} color="#CE0000" style={{ marginBottom: 16 }} />
      <Text>Edit app/premios.tsx to edit this screen.</Text>
    </View>
  );
}
