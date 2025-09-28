import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
	Animated,
	Platform,
	StyleSheet,
	type TextStyle,
	View,
} from "react-native";
import type { BenchmarkResult } from "../types";
import { NativeText } from "./NativeComponents";

interface ResultsCardProps {
	results: BenchmarkResult[];
}

export function ResultsCard({ results }: ResultsCardProps) {
	const fadeAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (results.length > 0) {
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 500,
				useNativeDriver: true,
			}).start();
		}
	}, [results, fadeAnim]);

	if (results.length === 0) return null;

	return (
		<Animated.View style={[styles.card, { opacity: fadeAnim }]}>
			<View style={styles.header}>
				<MaterialIcons
					name="analytics"
					size={24}
					color={Platform.OS === "ios" ? "#007AFF" : "#1976D2"}
				/>
				<NativeText variant="headline" style={styles.title}>
					Results
				</NativeText>
			</View>

			{results.map((result, index) => {
				const isWinner = index === 0 && results.length > 1;
				const speedup = isWinner
					? Math.round(
							((results[1].writeTime + results[1].readTime) /
								(result.writeTime + result.readTime)) *
								10,
						) / 10
					: 0;

				return (
					<View
						key={result.name}
						style={[styles.resultCard, isWinner && styles.winnerCard]}
					>
						<View style={styles.resultHeader}>
							<View style={styles.resultTitle}>
								<MaterialIcons
									name={
										result.name === "expo-native-storage"
											? "rocket-launch"
											: "storage"
									}
									size={16}
									color={isWinner ? "#4CAF50" : "#757575"}
									style={{ marginRight: 6 }}
								/>
								<NativeText variant="headline">{result.name}</NativeText>
							</View>
							{isWinner && (
								<View style={styles.badge}>
									<MaterialIcons name="emoji-events" size={12} color="#FFF" />
									<NativeText variant="caption" style={styles.badgeText}>
										{`${speedup}x faster`}
									</NativeText>
								</View>
							)}
						</View>

						<View style={styles.resultStats}>
							<View style={styles.statRow}>
								<NativeText variant="caption" color="#8E8E93">
									Write
								</NativeText>
								<NativeText variant="body">{`${result.writeTime}ms`}</NativeText>
							</View>
							<View style={styles.statRow}>
								<NativeText variant="caption" color="#8E8E93">
									Read
								</NativeText>
								<NativeText variant="body">{`${result.readTime}ms`}</NativeText>
							</View>
							<View style={styles.divider} />
							<View style={styles.statRow}>
								<NativeText variant="caption" color="#8E8E93">
									Total
								</NativeText>
								<NativeText
									variant="headline"
									style={isWinner ? styles.winnerTime : undefined}
								>
									{`${result.writeTime + result.readTime}ms`}
								</NativeText>
							</View>
						</View>
					</View>
				);
			})}
		</Animated.View>
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
		marginBottom: 16,
	},
	title: {
		marginLeft: 8,
		flex: 1,
	},
	resultCard: {
		padding: 12,
		backgroundColor: Platform.OS === "ios" ? "#F9F9F9" : "#F5F5F5",
		borderRadius: 8,
		marginBottom: 8,
	},
	winnerCard: {
		backgroundColor: Platform.OS === "ios" ? "#E8F5FF" : "#E8F5E9",
		borderWidth: 1,
		borderColor: Platform.OS === "ios" ? "#007AFF20" : "#4CAF5020",
	},
	resultHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	resultTitle: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	resultStats: {
		gap: 8,
	},
	statRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	divider: {
		height: 1,
		backgroundColor: "#00000010",
		marginVertical: 4,
	},
	badge: {
		backgroundColor: "#4CAF50",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	badgeText: {
		color: "#FFFFFF",
		fontWeight: "600",
		fontSize: 11,
	},
	winnerTime: {
		color: "#4CAF50",
		fontWeight: "700",
	} as TextStyle,
});
