import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import {
    Button,
    Divider,
    IconButton,
    Text,
    TextInput,
    useTheme
} from "react-native-paper";

import { useGrupal } from "@/context/GrupalContext";
import resultadosUnitarioStyles from "../../src/css/resultadosUnitarioStyles";
import type { ResumenSolped } from "../../src/types/solped";


export default function ResultadosScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const theme = useTheme();
    const { updateItem } = useGrupal();
    const batchId = params.batchId as string | undefined;

    const resumenInicial: ResumenSolped | null = useMemo(() => {
        if (!params.resumen) return null;
        try {
            return JSON.parse(params.resumen as string) as ResumenSolped;
        } catch (e) {
            console.error("Error parseando resumen:", e);
            return null;
        }
    }, [params.resumen]);

    const [descripcion, setDescripcion] = useState<string[]>(
        resumenInicial?.Descripcion && resumenInicial.Descripcion.length > 0
            ? resumenInicial.Descripcion
            : [""]
    );

    const [caracteristicas, setCaracteristicas] = useState<string[]>(
        resumenInicial?.Caracteristicas &&
            resumenInicial.Caracteristicas.length > 0
            ? resumenInicial.Caracteristicas
            : [""]
    );

    const [cantidad, setCantidad] = useState<string[]>(
        resumenInicial?.Cantidad && resumenInicial.Cantidad.length > 0
            ? resumenInicial.Cantidad
            : [""]
    );

    const [sustento, setSustento] = useState<string>(
        resumenInicial?.Sustento_texto ?? ""
    );


    if (!resumenInicial) {
        return (
            <View style={resultadosUnitarioStyles.container}>
                <Text>Error: no se recibieron datos.</Text>
            </View>
        );
    }

    const handleChangeArrayItem = (
        index: number,
        value: string,
        arr: string[],
        setter: (v: string[]) => void
    ) => {
        const next = [...arr];
        next[index] = value;
        setter(next);
    };

    const handleDeleteArrayItem = (
        index: number,
        arr: string[],
        setter: (v: string[]) => void
    ) => {
        const next = arr.filter((_, i) => i !== index);
        setter(next);
    };

    const handleGuardar = () => {
        if (!resumenInicial) return;

        const payload: ResumenSolped = {
            ...resumenInicial,
            Descripcion: descripcion,
            Caracteristicas: caracteristicas,
            Cantidad: cantidad,
            Descripcion_texto: descripcion.join(" "),
            Caracteristicas_texto: caracteristicas.join(" "),
            Cantidad_texto:
            cantidad.length > 0 ? cantidad.join(" / ") : null,
            Sustento_texto: sustento,
        };

        if (batchId) {
            // MODO GRUPAL
            updateItem(batchId, {
            resumenEditado: payload,
            confirmado: true,
            });

            // En web, los onPress del Alert se ignoran, así que navegamos nosotros:
            Alert.alert(
            "SOLPED actualizada",
            "Los cambios fueron guardados para esta SOLPED."
            );
            router.back();
        } else {
            // MODO UNITARIO
            console.log("Datos editados:", payload);
            Alert.alert("Guardado local", "Se guardaron los datos editados.");
        }
    };


    return (
        <ScrollView
            contentContainerStyle={[
                resultadosUnitarioStyles.container,
                { backgroundColor: theme.colors.background },
            ]}
        >
            {/* DESCRIPCIÓN */}
            <Text
                variant="titleMedium"
                style={[
                    resultadosUnitarioStyles.sectionTitle,
                    { color: theme.colors.onBackground },
                ]}
            >
                Descripción
            </Text>
            {descripcion.map((texto, idx) => (
                <View
                    style={resultadosUnitarioStyles.row}
                    key={`desc-${idx}`}
                >
                    <TextInput
                        mode="outlined"
                        style={resultadosUnitarioStyles.input}
                        value={texto}
                        onChangeText={(val) =>
                            handleChangeArrayItem(
                                idx,
                                val,
                                descripcion,
                                setDescripcion
                            )
                        }
                    />
                    <IconButton
                        icon="trash-can-outline"
                        onPress={() =>
                            handleDeleteArrayItem(
                                idx,
                                descripcion,
                                setDescripcion
                            )
                        }
                    />
                </View>
            ))}

            <Divider style={resultadosUnitarioStyles.divider} />

            {/* CARACTERÍSTICAS */}
            <Text
                variant="titleMedium"
                style={resultadosUnitarioStyles.sectionTitle}
            >
                Características
            </Text>
            {caracteristicas.map((texto, idx) => (
                <View
                    style={resultadosUnitarioStyles.row}
                    key={`car-${idx}`}
                >
                    <TextInput
                        mode="outlined"
                        style={resultadosUnitarioStyles.input}
                        value={texto}
                        onChangeText={(val) =>
                            handleChangeArrayItem(
                                idx,
                                val,
                                caracteristicas,
                                setCaracteristicas
                            )
                        }
                    />
                    <IconButton
                        icon="trash-can-outline"
                        onPress={() =>
                            handleDeleteArrayItem(
                                idx,
                                caracteristicas,
                                setCaracteristicas
                            )
                        }
                    />
                </View>
            ))}

            <Divider style={resultadosUnitarioStyles.divider} />

            {/* CANTIDAD */}
            <Text
                variant="titleMedium"
                style={resultadosUnitarioStyles.sectionTitle}
            >
                Cantidad
            </Text>
            {cantidad.map((texto, idx) => (
                <View
                    style={resultadosUnitarioStyles.row}
                    key={`cant-${idx}`}
                >
                    <TextInput
                        mode="outlined"
                        style={resultadosUnitarioStyles.input}
                        value={texto}
                        onChangeText={(val) =>
                            handleChangeArrayItem(
                                idx,
                                val,
                                cantidad,
                                setCantidad
                            )
                        }
                        keyboardType="numeric"
                    />
                    <IconButton
                        icon="trash-can-outline"
                        onPress={() =>
                            handleDeleteArrayItem(idx, cantidad, setCantidad)
                        }
                    />
                </View>
            ))}

            <Divider style={resultadosUnitarioStyles.divider} />

            {/* SUSTENTO */}
            <Text
                variant="titleMedium"
                style={resultadosUnitarioStyles.sectionTitle}
            >
                Sustento
            </Text>
            <TextInput
                mode="outlined"
                multiline
                numberOfLines={4}
                value={sustento}
                onChangeText={setSustento}
                style={resultadosUnitarioStyles.textArea}
            />

            <Button
                mode="contained"
                style={{ marginTop: 24 }}
                onPress={handleGuardar}
            >
                {batchId ? "Guardar y volver" : "Guardar"}
            </Button>

            <Button
                mode="text"
                style={{ marginTop: 8 }}
                onPress={() => router.back()}
            >
                Volver
            </Button>
        </ScrollView>
    );
}
