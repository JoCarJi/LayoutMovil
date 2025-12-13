import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Image, ScrollView, View } from "react-native";
import {
    Button,
    Dialog,
    Divider,
    IconButton,
    Portal,
    Text,
    TextInput,
    useTheme
} from "react-native-paper";

import ThemeToggleButton from "@/components/custom/ThemeToggleButton";
import { useGrupal } from "@/context/GrupalContext";
import { analizarGuardarIA } from "@/services/api";
import resultadosUnitarioStyles from "../../src/css/resultadosUnitarioStyles";
import type { ResumenSolped } from "../../src/types/solped";


export default function ResultadosScreen() {
    const theme = useTheme();
    const router = useRouter();
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const { updateItem } = useGrupal();

    const [showImage, setShowImage] = useState(false);
    
    const nombreArchivo = params.nombreArchivo as string | undefined;
    const batchId = params.batchId as string | undefined;
    const imageUri = params.imageUri as string | undefined;
    const idSolped = params.idSolped ? Number(params.idSolped) : null;    

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

    useEffect(() => {
        navigation.setOptions({
        headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
            {imageUri && (
                <IconButton
                icon="image-outline"
                onPress={() =>
                    router.push({
                    pathname: "/unitario/preview",
                    params: { imageUri },
                    })
                }
                />
            )}
            <ThemeToggleButton />
            </View>
        ),
        });
    }, [navigation, imageUri, router]);

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

    const handleGuardar = async () => {
        console.log("shot");
        if (!resumenInicial || !imageUri || !nombreArchivo) {
            Alert.alert("Falta información", "No se puede guardar esta SOLPED.");
            return;
        }

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
            updateItem(batchId, { resumenEditado: payload, confirmado: true});
            Alert.alert("SOLPED actualizada", "Los cambios fueron guardados para esta SOLPED.");
            router.back();
            return;
        } else {
            try {
                const r = await analizarGuardarIA({ uri: imageUri, origen: "unitario" });

                router.push({
                    pathname: "/unitario/resultados",
                    params: {
                        resumen: JSON.stringify(r.resumen),
                        idSolped: String(r.id_solped),
                        nombreArchivo: r.nombre_archivo,
                        // para preview puedes seguir usando el uri local:
                        imageUri,
                        // y si quieres, también guarda ruta del server:
                        rutaImagenServer: r.ruta_imagen,
                },
                });
                console.log("Guardado en BD, id_solped:", r.id_solped);
                Alert.alert("Guardado", "SOLPED guardada correctamente.");
            } catch (err: any) {
                console.error(err);
                Alert.alert("Error", "No se pudo guardar en la base de datos.");
            }
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
            <Portal>
                <Dialog
                visible={showImage}
                onDismiss={() => setShowImage(false)}
                style={{ maxHeight: "80%" }}
                >
                <Dialog.Title>Previsualización</Dialog.Title>
                <Dialog.Content>
                    {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        style={{ width: "100%", height: 300 }}
                        resizeMode="contain"
                    />
                    ) : (
                    <Text>No hay imagen disponible.</Text>
                    )}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setShowImage(false)}>Cerrar</Button>
                </Dialog.Actions>
                </Dialog>
            </Portal>
        </ScrollView>
    );
}
