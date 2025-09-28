import { MaterialIcons } from "@expo/vector-icons";
import { Platform, StyleSheet, View } from "react-native";
import { NativeButton, NativeProgress, NativeText } from "./NativeComponents";

interface BenchmarkCardProps {
	isRunning: boolean;
	progress: number;
	operationCount: number;
	onRunBenchmark: () => void;
}

export function BenchmarkCard({
	isRunning,
	progress,
	operationCount,
	onRunBenchmark,
}: BenchmarkCardProps) {
	return (
		<View style={styles.card}>
			<View style={styles.header}>
				<MaterialIcons
					name="speed"
					size={24}
					color={Platform.OS === "ios" ? "#007AFF" : "#1976D2"}
				/>
				<NativeText variant="headline" style={styles.title}>
					Performance Test
				</NativeText>
			</View>

			<NativeText
				variant="body"
				color={Platform.OS === "ios" ? "#6C6C70" : "#757575"}
				style={styles.description}
			>
				{`Compare ${operationCount} read/write operations between expo-native-storage and AsyncStorage`}
			</NativeText>

			{isRunning && (
				<View style={styles.progressContainer}>
					<NativeProgress progress={progress} />
					<NativeText variant="caption" style={styles.progressText}>
						{`${Math.round(progress * 100)}% complete`}
					</NativeText>
				</View>
			)}

			<NativeButton
				variant="default"
				onPress={onRunBenchmark}
				disabled={isRunning}
				loading={isRunning}
				fullWidth
				icon="play-arrow"
			>
				{isRunning ? "Running Benchmark..." : "Run Benchmark"}
			</NativeButton>
		</View>
	);
}

const styles = StyleSheet.create({
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
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	title: {
		marginLeft: 8,
		flex: 1,
	},
	description: {
		marginBottom: 16,
		lineHeight: 20,
	},
	progressContainer: {
		marginBottom: 16,
	},
	progressText: {
		textAlign: "center",
		marginTop: 8,
	},
});
