import AsyncStorage from "@react-native-async-storage/async-storage";
import Storage from "expo-native-storage";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { BenchmarkCard } from "./src/components/BenchmarkCard";
import { NativeSlider, NativeText } from "./src/components/NativeComponents";
import { ResultsCard } from "./src/components/ResultsCard";
import type { BenchmarkResult } from "./src/types";

export default function App() {
	const [results, setResults] = useState<BenchmarkResult[]>([]);
	const [isRunning, setIsRunning] = useState(false);
	const [progress, setProgress] = useState(0);
	const [operationCount, setOperationCount] = useState(100);

	const runBenchmark = async (
		name: string,
		setItem: (key: string, value: string) => Promise<void>,
		getItem: (key: string) => Promise<string | null>,
		removeItem: (key: string) => Promise<void>,
		operations = 100,
	) => {
		console.log(
			`Running ${name} benchmark with ${operations} operations...`,
		);

		setProgress(0.1);
		const writeStart = Date.now();
		for (let i = 0; i < operations; i++) {
			await setItem(`test_${i}`, `value_${i}_${Date.now()}`);
			if (i % Math.floor(operations / 10) === 0) {
				setProgress(0.1 + (i / operations) * 0.4);
			}
		}
		const writeTime = Date.now() - writeStart;

		setProgress(0.5);
		const readStart = Date.now();
		for (let i = 0; i < operations; i++) {
			await getItem(`test_${i}`);
			if (i % Math.floor(operations / 10) === 0) {
				setProgress(0.5 + (i / operations) * 0.4);
			}
		}
		const readTime = Date.now() - readStart;

		setProgress(0.9);
		for (let i = 0; i < operations; i++) {
			await removeItem(`test_${i}`);
		}
		setProgress(1);

		return { name, writeTime, readTime, operations };
	};

	const runAllBenchmarks = async () => {
		setIsRunning(true);
		setResults([]);
		setProgress(0);

		try {
			const nativeResult = await runBenchmark(
				"expo-native-storage",
				Storage.setItem.bind(Storage),
				Storage.getItem.bind(Storage),
				Storage.removeItem.bind(Storage),
				operationCount,
			);

			setProgress(0);

			const asyncResult = await runBenchmark(
				"AsyncStorage",
				AsyncStorage.setItem,
				AsyncStorage.getItem,
				AsyncStorage.removeItem,
				operationCount,
			);

			setResults([nativeResult, asyncResult]);
		} catch (error) {
			console.error("Benchmark failed:", error);
		} finally {
			setIsRunning(false);
			setProgress(0);
		}
	};

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container} edges={["top"]}>
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.header}>
						<NativeText variant="title">expo-native-storage</NativeText>
						<NativeText variant="caption" style={styles.subtitle}>
							Performance Benchmark Tool
						</NativeText>
					</View>

					<View style={styles.card}>
						<View style={styles.sliderHeader}>
							<NativeText variant="label">Operations</NativeText>
							<NativeText variant="headline" style={styles.operationCount}>
								{String(operationCount)}
							</NativeText>
						</View>

						<NativeSlider
							value={(operationCount - 100) / 900}
							onValueChange={(value) => {
								const operations = Math.round((value * 900 + 100) / 100) * 100;
								setOperationCount(Math.min(Math.max(operations, 100), 1000));
							}}
							min={0}
							max={1}
						/>

						<View style={styles.sliderLabels}>
							<NativeText variant="caption" color="#8E8E93">
								100
							</NativeText>
							<NativeText variant="caption" color="#8E8E93">
								1000
							</NativeText>
						</View>
					</View>

					<BenchmarkCard
						isRunning={isRunning}
						progress={progress}
						operationCount={operationCount}
						onRunBenchmark={runAllBenchmarks}
					/>

					<ResultsCard results={results} />
				</ScrollView>
				<StatusBar hidden={true} />
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Platform.OS === "ios" ? "#F2F2F7" : "#FAFAFA",
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: 16,
	},
	header: {
		alignItems: "center",
		marginBottom: 24,
		marginTop: 8,
	},
	subtitle: {
		textAlign: "center",
		marginTop: 4,
	},
	card: {
		backgroundColor: "#FFFFFF",
		borderRadius: Platform.OS === "ios" ? 10 : 12,
		padding: 16,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: Platform.OS === "ios" ? 0.04 : 0.1,
		shadowRadius: 8,
		elevation: Platform.OS === "ios" ? 0 : 2,
	},
	sliderHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	sliderLabels: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 4,
	},
	operationCount: {
		fontSize: 24,
		fontWeight: "700",
		color: Platform.OS === "ios" ? "#007AFF" : "#1976D2",
	},
});
