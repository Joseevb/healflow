"use client";

import {
	Control,
	ControllerRenderProps,
	FieldPath,
	FieldValues,
} from "react-hook-form";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { InputHTMLAttributes, JSX } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type InputType = NonNullable<InputHTMLAttributes<HTMLInputElement>["type"]>;

type BaseFieldConfig = {
	label: string;
	placeholder?: string;
	group?: string;
	className?: string;
};

type InputFieldConfig = BaseFieldConfig & {
	type: InputType | "textarea" | "checkbox";
};

type RadioGroupConfig = BaseFieldConfig & {
	type: "radio";
	options: { label: string; value: string }[];
};

type SelectFieldConfig = BaseFieldConfig & {
	type: "select";
	options: { label: string; value: string }[];
};

export type FieldConfig =
	| InputFieldConfig
	| SelectFieldConfig
	| RadioGroupConfig;

export type FieldConfigs<T> = Record<keyof T, FieldConfig>;

const createRenderMap = <T extends FieldValues>(
	config: FieldConfig,
	name: string,
): Record<string, (field: ControllerRenderProps<T>) => JSX.Element> => ({
	textarea: (field) => <Textarea placeholder={config.placeholder} {...field} />,
	select: (field) => (
		<Select onValueChange={field.onChange} defaultValue={field.value}>
			<SelectTrigger>
				<SelectValue placeholder={config.placeholder} />
			</SelectTrigger>
			<SelectContent>
				{(config as SelectFieldConfig).options.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	),
	checkbox: (field) => (
		<div className="flex items-center space-x-2">
			<Checkbox
				id={name}
				checked={field.value}
				onCheckedChange={field.onChange}
			/>
			<FormLabel
				htmlFor={name}
				className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{config.label}
			</FormLabel>
		</div>
	),
	radio: (field) => (
		<RadioGroup
			onValueChange={field.onChange}
			defaultValue={field.value}
			className={(config as RadioGroupConfig).className}
		>
			{(config as RadioGroupConfig).options.map(({ label, value }) => (
				<FormItem key={value}>
					<FormControl>
						<RadioGroupItem value={value} />
					</FormControl>
					<FormLabel>{label}</FormLabel>
				</FormItem>
			))}
		</RadioGroup>
	),
});

const createRenderDefault =
	<T extends FieldValues>(config: FieldConfig) =>
	// eslint-disable-next-line react/display-name
	(field: ControllerRenderProps<T>) => (
		<Input
			placeholder={config.placeholder}
			type={(config as InputFieldConfig).type}
			{...field}
			onChange={(e) => {
				let value: unknown = e.target.value;
				if (config.type === "number") {
					value = e.target.value === "" ? 0 : Number(e.target.value);
				}
				field.onChange(value);
			}}
		/>
	);

interface DynamicFormFieldProps<T extends FieldValues> {
	name: FieldPath<T>;
	control: Control<T>;
	fieldConfigs: Record<string, FieldConfig>;
}

interface DynamicFormGroupProps<T extends FieldValues> {
	control: Control<T>;
	fieldConfigs: Record<string, FieldConfig>;
}

export function DynamicFormField<T extends FieldValues>({
	name,
	control,
	fieldConfigs,
}: Readonly<DynamicFormFieldProps<T>>) {
	const config = fieldConfigs[name as keyof typeof fieldConfigs];

	const renderMap = createRenderMap<T>(config, name);
	const renderDefault = createRenderDefault<T>(config);

	if (config.type === "checkbox") {
		return (
			<FormField
				control={control}
				name={name}
				render={({ field }) => (
					<FormItem className="flex-1">
						<FormControl>
							{renderMap[config.type]?.(field) ?? renderDefault(field)}
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		);
	}

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="flex-1">
					<FormLabel>{config.label}</FormLabel>
					<FormControl>
						{renderMap[config.type]?.(field) ?? renderDefault(field)}
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export function DynamicFormGroup<T extends FieldValues>({
	control,
	fieldConfigs,
}: Readonly<DynamicFormGroupProps<T>>) {
	const orderedGroups: { groupName: string; fields: string[] }[] = [];
	const seenGroups = new Set<string>();

	Object.entries(fieldConfigs).forEach(([fieldName, config]) => {
		const groupName = config.group || `__single_${fieldName}`;

		if (!seenGroups.has(groupName)) {
			seenGroups.add(groupName);
			orderedGroups.push({ groupName, fields: [] });
		}

		const group = orderedGroups.find((g) => g.groupName === groupName);
		group!.fields.push(fieldName);
	});

	return (
		<div className="flex flex-col gap-4">
			{orderedGroups.map(({ groupName, fields }) => (
				<div
					key={groupName}
					className={fields.length > 1 ? "flex gap-4" : "flex flex-col"}
				>
					{fields.map((fieldName) => (
						<DynamicFormField<T>
							key={fieldName}
							name={fieldName as FieldPath<T>}
							fieldConfigs={fieldConfigs}
							control={control}
						/>
					))}
				</div>
			))}
		</div>
	);
}
