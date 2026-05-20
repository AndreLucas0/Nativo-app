import { View, Text, StyleSheet, Pressable } from "react-native";
import { Check, Star } from "lucide-react-native";
import { router } from "expo-router";

type Props = {
    titulo: string;
    posicao: "left" | "center" | "right";
    rota: any;
};

export default function TrilhaItem({
    titulo,
    posicao,
    rota,
}: Props) {
    return (
        <View
            style={[
                styles.container,
                {
                    alignSelf:
                        posicao === "left"
                            ? "flex-start"
                            : posicao === "center"
                                ? "center"
                                : "flex-end",
                },
            ]}
        >
            {/* BOLINHA */}
            <Pressable
                style={styles.circulo}
                onPress={() => router.push(rota)}
            >
                <Check size={40} color="#000" strokeWidth={4} />

                {/* ESTRELA */}
                <View style={styles.estrela}>
                    <Star
                        size={18}
                        color="#FFD43B"
                        fill="#FFD43B"
                    />
                </View>
            </Pressable>

            {/* TEXTO */}
            <Text style={styles.texto}>
                {titulo}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 30,
        alignItems: "center",
        width: 140,
    },

    circulo: {
        width: 90,
        height: 90,

        borderRadius: 999,

        backgroundColor: "#8AE234",

        justifyContent: "center",
        alignItems: "center",

        position: "relative",
    },

    estrela: {
        position: "absolute",
        top: -2,
        right: -2,
    },

    texto: {
        color: "#FFF",
        marginTop: 12,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 14,
    },
});