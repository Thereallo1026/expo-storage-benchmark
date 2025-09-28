import {
	Button as AndroidButton,
	LinearProgress as AndroidProgress,
	Slider as AndroidSlider,
} from "@expo/ui/jetpack-compose";
import {
	Host,
	Button as IOSButton,
	LinearProgress as IOSProgress,
	Slider as IOSSlider,
} from "@expo/ui/swift-ui";
import type { MaterialIcons } from "@expo/vector-icons";
import { Platform, Text as RNText, type TextStyle, View } from "react-native";

export function NativeSlider({
	value,
	onValueChange,
	min = 0,
	max = 1,
}: {
	value: number;
	onValueChange: (value: number) => void;
	min?: number;
	max?: number;
}) {
	if (Platform.OS === "ios") {
		return (
			<Host style={{ minHeight: 44, width: "100%" }}>
				<IOSSlider
					value={value}
					onValueChange={onValueChange}
					min={min}
					max={max}
				/>
			</Host>
		);
	}

	return (
		<AndroidSlider
			value={value}
			onValueChange={onValueChange}
			style={{ minHeight: 60, width: "100%" }}
			min={min}
			max={max}
		/>
	);
}

export function NativeButton({
	children,
	onPress,
	variant = "default",
	disabled = false,
	loading = false,
	fullWidth = false,
}: {
	children: string;
	onPress: () => void;
	variant?: "default" | "bordered";
	disabled?: boolean;
	loading?: boolean;
	fullWidth?: boolean;
	icon?: keyof typeof MaterialIcons.glyphMap;
}) {
	if (Platform.OS === "ios") {
		return (
			<Host style={[{ minHeight: 44 }, fullWidth && { width: "100%" }]}>
				<IOSButton
					variant={variant === "bordered" ? "borderless" : "default"}
					onPress={onPress}
					disabled={disabled || loading}
				>
					{children}
				</IOSButton>
			</Host>
		);
	}

	return (
		<View style={fullWidth && { width: "100%" }}>
			<AndroidButton
				variant={variant === "bordered" ? "bordered" : "default"}
				onPress={onPress}
				disabled={disabled || loading}
				style={{ minHeight: 48 }}
			>
				{children}
			</AndroidButton>
		</View>
	);
}

export function NativeText({
	children,
	variant = "body",
	style,
	color,
}: {
	children: string;
	variant?: "title" | "headline" | "body" | "caption" | "label";
	style?: TextStyle;
	color?: string;
}) {
	return (
		<RNText
			style={[
				{
					fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
					color: Platform.OS === "ios" ? "#000000" : "#212121",
				},
				variant === "title" && {
					fontSize: 32,
					fontWeight: Platform.OS === "ios" ? "700" : "bold",
				},
				variant === "headline" && {
					fontSize: 17,
					fontWeight: "600",
				},
				variant === "body" && {
					fontSize: 15,
					lineHeight: 22,
				},
				variant === "caption" && {
					fontSize: 13,
					lineHeight: 18,
					opacity: 0.6,
				},
				variant === "label" && {
					fontSize: 13,
					fontWeight: "600",
					textTransform: "uppercase",
					letterSpacing: 0.5,
					opacity: 0.6,
				},
				color && { color },
				style,
			]}
		>
			{children}
		</RNText>
	);
}

export function NativeProgress({ progress }: { progress: number }) {
	if (Platform.OS === "ios") {
		return (
			<Host style={{ height: 4, width: "100%" }}>
				<IOSProgress progress={progress} color="#007AFF" />
			</Host>
		);
	}

	return (
		<AndroidProgress
			progress={progress}
			style={{ height: 4, width: "100%" }}
			color="#1976D2"
		/>
	);
}
